// ===========================================================
// LessonsList — レッスン一覧管理 /admin/lessons
// ===========================================================

import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import Pagination from '../../components/admin/Pagination'
import ImportModal from '../../components/admin/ImportModal'
import { exportToExcel, type ColumnDef } from '../../services/import-export'

interface LessonItem {
  status?: string
  id: number
  title: string
  order: number
  time: string
  course_id: number
  course_title: string
}

export default function LessonsList() {
  const [lessons, setLessons] = useState<LessonItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('')
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [showImport, setShowImport] = useState(false)
  const perPage = 20

  const LESSON_COLUMNS: ColumnDef[] = [
    { key: 'id', label: 'ID', width: 8 },
    { key: 'title', label: 'タイトル', width: 40 },
    { key: 'course_id', label: 'コースID', width: 10 },
    { key: 'course_title', label: '所属コース', width: 30 },
    { key: 'order', label: '順序', width: 8 },
    { key: 'time', label: '時間', width: 10 },
    { key: 'content', label: '内容', width: 50 },
    { key: 'status', label: 'ステータス', width: 10 },
    { key: 'created_at', label: '作成日', width: 15 },
  ]

  const handleExport = async () => {
    try {
      const { data } = await api.client.get('/lessons', { params: { per_page: 9999 } })
      const items = data.success ? (data.data || []) : []
      const rows = items.map((l: any) => ({
        id: l.id,
        title: l.title,
        course_id: l.course_id || '',
        course_title: l.course_title || '',
        order: l.order || 0,
        time: l.time || '',
        content: (l.content || '').replace(/<[^>]*>/g, ''),
        status: l.status || 'publish',
        created_at: l.created_at?.slice(0, 10) || '',
      }))
      exportToExcel(rows, LESSON_COLUMNS, `レッスン一覧_全${rows.length}件_${new Date().toISOString().slice(0, 10)}`)
    } catch {}
  }

  const handleImport = async (rows: Record<string, any>[]) => {
    let success = 0; let failed = 0; const errors: { row: number; message: string }[] = []
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i]; const rowNum = i + 2
      if (!r['タイトル']?.trim()) { failed++; errors.push({ row: rowNum, message: 'タイトルが空です' }); continue }
      try {
        await api.client.post('/lessons', { title: r['タイトル'], order: parseInt(r['順序'] || '1'), time: r['時間'] || '' })
        success++
      } catch (e: any) { failed++; errors.push({ row: rowNum, message: e.response?.data?.message || '保存失敗' }) }
    }
    if (success > 0) { setPage(1); window.location.reload() }
    return { success, failed, errors }
  }

  const courseOptions = useMemo(() => {
    const map = new Map<number, string>()
    lessons.forEach(l => { if (l.course_id && l.course_title) map.set(l.course_id, l.course_title) })
    return Array.from(map.entries()).map(([id, title]) => ({ id, title })).sort((a, b) => a.title.localeCompare(b.title))
  }, [lessons])

  const filteredLessons = useMemo(() => {
    let result = lessons
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      result = result.filter(l => l.title.toLowerCase().includes(q))
    }
    if (courseFilter) {
      result = result.filter(l => l.course_id === parseInt(courseFilter))
    }
    return result
  }, [lessons, search, courseFilter])

  const totalPages = Math.ceil(filteredLessons.length / perPage)
  const paginatedLessons = filteredLessons.slice((page - 1) * perPage, page * perPage)

  const fetchLessons = () => {
    setLoading(true)
    setError('')
    api.client.get('/lessons', { params: { per_page: 200 } })
      .then(({ data }) => {
        if (data && data.success) setLessons(data.data || [])
        else setError(data?.message || 'データの取得に失敗しました。')
      })
      .catch((err: any) => {
        setError(err?.response?.data?.message || err?.message || 'APIエラーが発生しました。')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchLessons() }, [])

  useEffect(() => { setPage(1) }, [search, courseFilter])
  useEffect(() => { setSelectedIds([]) }, [page])


  const handleBatchStatus = async (statusStr: string) => {
    for (const id of selectedIds) {
      try { await api.client.put(`/lessons/${id}`, { status: statusStr }) } catch {}
    }
    setLessons(prev => prev.map(i => selectedIds.includes(i.id) ? { ...i, status: statusStr } : i))
    setSelectedIds([])
  }

  const allSelected = paginatedLessons.length > 0 && paginatedLessons.every(i => selectedIds.includes(i.id))

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? paginatedLessons.map(i => i.id) : [])
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await api.deleteLesson(deleteId)
      setLessons(prev => prev.filter(l => l.id !== deleteId))
    } catch {}
    setDeleting(false)
    setDeleteId(null)
  }

  const goToPage = (p: number) => { if (p >= 1 && p <= totalPages) setPage(p) }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>レッスン管理</h1>
          <p className="admin-page-desc">全コースのレッスンを管理</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="admin-btn" onClick={handleExport}>📤 エクスポート</button>
          <button className="admin-btn" onClick={() => setShowImport(true)}>📥 インポート</button>
          <Link to="/admin/lessons/new" className="admin-btn admin-btn-primary">+ 新規レッスン</Link>
          <Link to="/admin/courses" className="admin-btn" style={{ fontSize: 11.5 }}>← コース管理に戻る</Link>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {/* Search & Filters */}
      <div className="admin-search-bar">
        <input type="text" className="admin-input" placeholder="レッスンタイトルを検索..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className="admin-input admin-input-sm" value={courseFilter}
          onChange={e => setCourseFilter(e.target.value)}>
          <option value="">すべてのコース</option>
          {courseOptions.map(co => (
            <option key={co.id} value={co.id}>{co.title}</option>
          ))}
        </select>
        <span style={{ fontSize: 12, color: 'var(--ink-3)', alignSelf: 'center', whiteSpace: 'nowrap' }}>
          {filteredLessons.length} / {lessons.length} 件
        </span>
      </div>

      {loading ? (
        <div className="admin-loading">読み込み中...</div>
      ) : lessons.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">🎋</div>
          <p>まだレッスンがありません</p>
          <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>まずコースを作成し、その後WordPress管理画面でレッスンを追加してください。</p>
        </div>
      ) : filteredLessons.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">🔍</div>
          <p>検索条件に一致するレッスンがありません</p>
          <button className="admin-btn" style={{ marginTop: 12 }} onClick={() => { setSearch(''); setCourseFilter('') }}>クリア</button>
        </div>
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}><input type="checkbox" onChange={e => handleSelectAll(e.target.checked)} checked={allSelected} /></th>
                  <th>タイトル</th>
                  <th>所属コース</th>
                  <th>順序</th>
                  <th>時間</th>
                  <th>ステータス</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLessons.map(l => (
                  <tr key={l.id}>
                    <td><input type="checkbox" checked={selectedIds.includes(l.id)} onChange={e => setSelectedIds(prev => e.target.checked ? [...prev, l.id] : prev.filter(id => id !== l.id))} /></td>
                    <td className="admin-cell-title">{l.title}</td>
                    <td>{l.course_title || '—'}</td>
                    <td>{l.order || '—'}</td>
                    <td>{l.time || '—'}</td>
                    <td>
                      <div className="admin-actions">
                        <Link to={`/admin/lessons/${l.id}/edit`} className="admin-btn admin-btn-sm">編集</Link>
                        <Link to={`/lesson/${l.id}`} className="admin-btn admin-btn-sm">表示</Link>
                        <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => setDeleteId(l.id)}>削除</button>
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
            <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
          )}
        </>
      )}

      {showImport && <ImportModal columns={LESSON_COLUMNS} templateFilename="レッスンインポート" onImport={handleImport} onClose={() => { setShowImport(false); window.location.reload() }} />}
      {deleteId && (
        <div className="admin-overlay" onClick={() => !deleting && setDeleteId(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>レッスンを削除しますか？</h3>
            <p>この操作は取り消せません。</p>
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
