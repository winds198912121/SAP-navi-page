// ===========================================================
// ArticlesList — 記事一覧管理 /admin/articles
// ===========================================================

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import Pagination from '../../components/admin/Pagination'
import { SAP_MODULES } from '../../types'
import ImportModal from '../../components/admin/ImportModal'
import { exportToExcel, type ColumnDef } from '../../services/import-export'

interface ArticleItem {
  id: number
  title: string
  slug: string
  module: { slug: string; name: string } | null
  difficulty: { slug: string; name: string } | null
  reading_time: number
  views: number
  created_at: string
  status?: string
}

export default function ArticlesList() {
  const [articles, setArticles] = useState<ArticleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [moduleFilter, setModuleFilter] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [showImport, setShowImport] = useState(false)
  const perPage = 20

  const ARTICLE_COLUMNS: ColumnDef[] = [
    { key: 'id', label: 'ID', width: 8 },
    { key: 'title', label: 'タイトル', width: 40 },
    { key: 'slug', label: 'スラッグ', width: 20 },
    { key: 'module_name', label: 'モジュール', width: 15 },
    { key: 'difficulty_name', label: '難易度', width: 10 },
    { key: 'topic_name', label: 'トピック', width: 15 },
    { key: 'reading_time', label: '読了時間(分)', width: 12 },
    { key: 'views', label: '閲覧数', width: 10 },
    { key: 'excerpt', label: '摘録', width: 50 },
    { key: 'status', label: 'ステータス', width: 10 },
    { key: 'created_at', label: '作成日', width: 15 },
  ]

  const handleExport = async () => {
    try {
      const { data } = await api.client.get('/articles', { params: { per_page: 9999, status: 'all' } })
      const items = data.success ? (data.data || []) : []
      const rows = items.map((a: any) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        module_name: a.module?.name || '',
        difficulty_name: a.difficulty?.name || '',
        topic_name: (a.topic?.name || ''),
        reading_time: a.reading_time || 5,
        views: a.views || 0,
        excerpt: (a.excerpt || '').replace(/<[^>]*>/g, ''),
        status: a.status || 'publish',
        created_at: a.created_at?.slice(0, 10) || '',
      }))
      exportToExcel(rows, ARTICLE_COLUMNS, `記事一覧_全${rows.length}件_${new Date().toISOString().slice(0, 10)}`)
    } catch {}
  }

  const handleImport = async (rows: Record<string, any>[]) => {
    let success = 0; let failed = 0; const errors: { row: number; message: string }[] = []
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i]; const rowNum = i + 2
      if (!r['タイトル']?.trim()) { failed++; errors.push({ row: rowNum, message: 'タイトルが空です' }); continue }
      try {
        const body: any = { title: r['タイトル'], excerpt: r['摘録'] || '', reading_time: parseInt(r['読了時間(分)'] || '5') }
        const mod = (r['モジュール'] || '').toString().toLowerCase().trim()
        if (mod && SAP_MODULES.find(m => m.slug === mod || m.code?.toLowerCase() === mod)) {
          const slug = SAP_MODULES.find(m => m.slug === mod || m.code?.toLowerCase() === mod)!.slug
          body.module = slug
        }
        const diffMap: Record<string, string> = { '初級': 'beginner', '中級': 'intermediate', '上級': 'advanced' }
        const diff = (r['難易度'] || '').toString().trim()
        if (diff && diffMap[diff]) body.difficulty = diffMap[diff]
        await api.client.post('/articles', body)
        success++
      } catch (e: any) { failed++; errors.push({ row: rowNum, message: e.response?.data?.message || '保存失敗' }) }
    }
    if (success > 0) fetchArticles()
    return { success, failed, errors }
  }

  const fetchArticles = () => {
    setLoading(true)
    setError('')
    const params: any = { per_page: perPage, page, status: 'all' }
    if (moduleFilter) params.module = moduleFilter
    api.client.get('/articles', { params })
      .then(({ data }) => {
        if (data.success) { setArticles(data.data || []); setTotal(data.total || 0) }
        else setError(data.message || '取得失敗')
      })
      .catch(() => setError('APIエラー'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchArticles() }, [page, moduleFilter])
  useEffect(() => { setSelectedIds([]) }, [page])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    if (!search.trim()) { fetchArticles(); return }
    setLoading(true)
    api.client.get('/articles/search', { params: { q: search, per_page: perPage } })
      .then(({ data }) => { if (data.success) { setArticles(data.data); setTotal(data.data.length) } })
      .catch(() => {}).finally(() => setLoading(false))
  }


  const handleBatchStatus = async (statusStr: string) => {
    for (const id of selectedIds) {
      try { await api.client.put(`/articles/${id}`, { status: statusStr }) } catch {}
    }
    setArticles(prev => prev.map(i => selectedIds.includes(i.id) ? { ...i, status: statusStr } : i))
    setSelectedIds([])
  }

  const paginated = articles
  const allSelected = paginated.length > 0 && paginated.every(i => selectedIds.includes(i.id))

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? paginated.map(i => i.id) : [])
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await api.client.delete(`/articles/${deleteId}`)
      if (res.data.success) {
        setArticles(prev => prev.filter(a => a.id !== deleteId))
        setTotal(prev => Math.max(0, prev - 1))
      }
    } catch {}
    setDeleting(false); setDeleteId(null)
  }

  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>記事管理</h1>
          <p className="admin-page-desc">全 {total} 件の記事</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="admin-btn" onClick={handleExport}>📤 エクスポート</button>
          <button className="admin-btn" onClick={() => setShowImport(true)}>📥 インポート</button>
          <Link to="/admin/articles/new" className="admin-btn admin-btn-primary">+ 新規記事</Link>
        </div>
      </div>
      {error && <div className="admin-error">{error}</div>}

      <div className="admin-search-bar">
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
          <input type="text" className="admin-input" placeholder="記事を検索..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <button type="submit" className="admin-btn">検索</button>
        </form>
        <select className="admin-input admin-input-sm" value={moduleFilter}
          onChange={e => { setModuleFilter(e.target.value); setPage(1) }}>
          <option value="">すべてのモジュール</option>
          {SAP_MODULES.map(m => <option key={m.slug} value={m.slug}>{m.code}</option>)}
        </select>
      </div>

      {loading ? <div className="admin-loading">読み込み中...</div>
      : articles.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">🎋</div>
          <p>まだ記事がありません</p>
          <Link to="/admin/articles/new" className="admin-btn admin-btn-primary">最初の記事を作成</Link>
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
                  <th className="col-hide-tablet">読了時間</th>
                  <th className="col-hide-tablet">閲覧数</th>
                  <th className="col-hide-tablet col-hide-mobile">作成日</th>
                  <th className="col-hide-mobile">ステータス</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {articles.map(a => (
                  <tr key={a.id}>
                    <td><input type="checkbox" checked={selectedIds.includes(a.id)} onChange={e => setSelectedIds(prev => e.target.checked ? [...prev, a.id] : prev.filter(id => id !== a.id))} /></td>
                    <td className="admin-cell-title">{a.title}</td>
                    <td className="col-hide-mobile">{a.module?.name || '—'}</td>
                    <td className="col-hide-mobile">{a.difficulty ? (
                      <span className={`admin-diff-lv l${a.difficulty.slug === 'beginner' ? 1 : a.difficulty.slug === 'intermediate' ? 2 : 3}`}>{a.difficulty.name}</span>
                    ) : '—'}</td>
                    <td className="col-hide-tablet">{a.reading_time || '—'} min</td>
                    <td className="col-hide-tablet">{a.views || 0}</td>
                    <td className="admin-cell-date col-hide-tablet col-hide-mobile">{new Date(a.created_at).toLocaleDateString('ja-JP')}</td>
                    <td>
                      <div className="admin-actions">
                        <Link to={`/admin/articles/${a.id}/edit`} className="admin-btn admin-btn-sm">編集</Link>
                        <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => setDeleteId(a.id)}>削除</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

      {showImport && (
        <ImportModal
          columns={ARTICLE_COLUMNS}
          templateFilename="記事インポート"
          onImport={handleImport}
          onClose={() => { setShowImport(false); fetchArticles() }}
        />
      )}
      {deleteId && (
        <div className="admin-overlay" onClick={() => !deleting && setDeleteId(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>記事を削除しますか？</h3>
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
