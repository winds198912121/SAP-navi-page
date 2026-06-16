// ===========================================================
// CoursesList — コース一覧管理 /admin/courses
// ===========================================================

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import Pagination from '../../components/admin/Pagination'
import ImportModal from '../../components/admin/ImportModal'
import { exportToExcel, type ColumnDef } from '../../services/import-export'

interface CourseItem {
  id: number
  title: string
  price: number
  duration: string
  module: { slug: string; name: string } | null
  difficulty: { slug: string; name: string } | null
  created_at: string
  updated_at: string
  status?: string
}

export default function CoursesList() {
  const [courses, setCourses] = useState<CourseItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [showImport, setShowImport] = useState(false)
  const perPage = 20

  const COURSE_COLUMNS: ColumnDef[] = [
    { key: 'id', label: 'ID', width: 8 },
    { key: 'title', label: 'タイトル', width: 40 },
    { key: 'module_name', label: 'モジュール', width: 15 },
    { key: 'difficulty_name', label: '難易度', width: 10 },
    { key: 'price', label: '価格', width: 10 },
    { key: 'duration', label: '時間', width: 10 },
    { key: 'instructor', label: '講師', width: 15 },
    { key: 'excerpt', label: '説明', width: 50 },
    { key: 'status', label: 'ステータス', width: 10 },
    { key: 'created_at', label: '作成日', width: 15 },
    { key: 'updated_at', label: '更新日', width: 15 },
  ]

  const handleExport = async () => {
    try {
      const { data } = await api.client.get('/courses', { params: { per_page: 9999 } })
      const items = data.success ? (data.data || []) : []
      const rows = items.map((c: any) => ({
        id: c.id,
        title: c.title,
        module_name: c.module?.name || '',
        difficulty_name: c.difficulty?.name || '',
        price: c.price || 0,
        duration: c.duration || '',
        instructor: c.instructor || '',
        excerpt: (c.excerpt || '').replace(/<[^>]*>/g, ''),
        status: c.status || 'publish',
        created_at: c.created_at?.slice(0, 10) || '',
        updated_at: c.updated_at?.slice(0, 10) || '',
      }))
      exportToExcel(rows, COURSE_COLUMNS, `コース一覧_全${rows.length}件_${new Date().toISOString().slice(0, 10)}`)
    } catch {}
  }

  const handleImport = async (rows: Record<string, any>[]) => {
    let success = 0; let failed = 0; const errors: { row: number; message: string }[] = []
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i]; const rowNum = i + 2
      if (!r['タイトル']?.trim()) { failed++; errors.push({ row: rowNum, message: 'タイトルが空です' }); continue }
      try {
        await api.client.post('/courses', { title: r['タイトル'], price: parseInt(r['価格'] || '0'), duration: r['時間'] || '' })
        success++
      } catch (e: any) { failed++; errors.push({ row: rowNum, message: e.response?.data?.message || '保存失敗' }) }
    }
    if (success > 0) fetchCourses()
    return { success, failed, errors }
  }

  const fetchCourses = () => {
    setLoading(true)
    api.client.get('/courses', { params: { per_page: perPage, page, q: search || undefined } })
      .then(({ data }) => {
        if (data.success) {
          setCourses(data.data || [])
          setTotal(data.total || 0)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchCourses() }, [page])
  useEffect(() => { setSelectedIds([]) }, [page])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchCourses()
  }


  const handleBatchStatus = async (statusStr: string) => {
    for (const id of selectedIds) {
      try { await api.client.put(`/courses/${id}`, { status: statusStr }) } catch {}
    }
    setCourses(prev => prev.map(i => selectedIds.includes(i.id) ? { ...i, status: statusStr } : i))
    setSelectedIds([])
  }

  const paginated = courses
  const allSelected = paginated.length > 0 && paginated.every(i => selectedIds.includes(i.id))

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? paginated.map(i => i.id) : [])
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await api.deleteCourse(deleteId)
      if (res.success) {
        setCourses(prev => prev.filter(c => c.id !== deleteId))
        setTotal(prev => Math.max(0, prev - 1))
      }
    } catch {}
    setDeleting(false)
    setDeleteId(null)
  }

  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>コース管理</h1>
          <p className="admin-page-desc">全 {total} 件のコース</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="admin-btn" onClick={handleExport}>📤 エクスポート</button>
          <button className="admin-btn" onClick={() => setShowImport(true)}>📥 インポート</button>
          <Link to="/admin/courses/new" className="admin-btn admin-btn-primary">+ 新規コース</Link>
        </div>
      </div>

      {/* Search */}
      <form className="admin-search-bar" onSubmit={handleSearch}>
        <input
          type="text" className="admin-input" placeholder="コースを検索..."
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <button type="submit" className="admin-btn">検索</button>
      </form>

      {/* Table */}
      {loading ? (
        <div className="admin-loading">読み込み中...</div>
      ) : courses.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">🎋</div>
          <p>まだコースがありません</p>
          <Link to="/admin/courses/new" className="admin-btn admin-btn-primary">最初のコースを作成</Link>
        </div>
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}><input type="checkbox" onChange={e => handleSelectAll(e.target.checked)} checked={allSelected} /></th>
                  <th>タイトル</th>
                  <th className="col-hide-mobile">モジュール</th>
                  <th className="col-hide-mobile">難易度</th>
                  <th className="col-hide-tablet">価格</th>
                  <th className="col-hide-tablet">時間</th>
                  <th className="col-hide-tablet col-hide-mobile">更新日</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(c => (
                  <tr key={c.id}>
                    <td className="col-hide-mobile"><input type="checkbox" checked={selectedIds.includes(c.id)} onChange={e => setSelectedIds(prev => e.target.checked ? [...prev, c.id] : prev.filter(id => id !== c.id))} /></td>
                    <td className="admin-cell-title">{c.title}</td>
                    <td className="col-hide-mobile">{c.module?.name || '—'}</td>
                    <td className="col-hide-mobile">{c.difficulty ? (
                      <span className={`admin-diff-lv l${c.difficulty.slug === 'beginner' ? 1 : c.difficulty.slug === 'intermediate' ? 2 : 3}`}>
                        {c.difficulty.name}
                      </span>
                    ) : '—'}</td>
                    <td className="col-hide-tablet">{c.price > 0 ? `¥${c.price.toLocaleString()}` : '無料'}</td>
                    <td className="col-hide-tablet">{c.duration || '—'}</td>
                    <td className="admin-cell-date col-hide-tablet col-hide-mobile">{new Date(c.updated_at || c.created_at).toLocaleDateString('ja-JP')}</td>
                    <td>
                      <div className="admin-actions">
                        <Link to={`/admin/courses/${c.id}/edit`} className="admin-btn admin-btn-sm">編集</Link>
                        <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => setDeleteId(c.id)}>削除</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {selectedIds.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "var(--accent-soft)", borderRadius: "var(--r-md)", marginTop: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--accent-deep)" }}>{selectedIds.length} 件選択中</span>
              <button className="admin-btn admin-btn-sm admin-btn-primary" onClick={() => handleBatchStatus("publish")}>公開する</button>
              <button className="admin-btn admin-btn-sm" onClick={() => handleBatchStatus("draft")}>下書きにする</button>
              <button className="admin-btn admin-btn-sm" onClick={() => setSelectedIds([])} style={{ marginLeft: "auto" }}>解除</button>
            </div>
          )}
          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onChange={p => setPage(p)} />
          )}
        </>
      )}

      {/* Delete confirmation */}
      {showImport && (
        <ImportModal
          columns={COURSE_COLUMNS}
          templateFilename="コースインポート"
          onImport={handleImport}
          onClose={() => { setShowImport(false); fetchCourses() }}
        />
      )}
      {deleteId && (
        <div className="admin-overlay" onClick={() => !deleting && setDeleteId(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>コースを削除しますか？</h3>
            <p>この操作は取り消せません。削除されたコースはゴミ箱に移動されます。</p>
            <div className="admin-modal-actions">
              <button className="admin-btn" onClick={() => setDeleteId(null)} disabled={deleting}>キャンセル</button>
              <button className="admin-btn admin-btn-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? '削除中...' : '削除する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
