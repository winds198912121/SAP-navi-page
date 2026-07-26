'use client'
// ===========================================================
// ArticlesList — 記事一覧管理 /admin/articles
// ===========================================================
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { adminApi } from '@/lib/admin-api'
import Pagination from '@/components/admin/Pagination'
import ImportModal from '@/components/admin/ImportModal'
import { exportToExcel, type ColumnDef } from '@/lib/import-export'

const SAP_MODULES = [
  { slug: 'fi', code: 'FI', name_ja: '財務会計' },
  { slug: 'co', code: 'CO', name_ja: '管理会計' },
  { slug: 'mm', code: 'MM', name_ja: '購買・在庫' },
  { slug: 'sd', code: 'SD', name_ja: '販売管理' },
  { slug: 'pp', code: 'PP', name_ja: '生産計画' },
  { slug: 'hr', code: 'HR', name_ja: '人事管理' },
  { slug: 'abap', code: 'ABAP', name_ja: '開発言語' },
  { slug: 'basis', code: 'Basis', name_ja: '基盤管理' },
  { slug: 's4', code: 'S/4', name_ja: 'S/4HANA' },
]

const ARTICLE_COLUMNS: ColumnDef[] = [
  { key: 'id', label: 'ID', width: 8 },
  { key: 'title', label: 'タイトル', width: 40 },
  { key: 'slug', label: 'スラッグ', width: 20 },
  { key: 'module_name', label: 'モジュール', width: 15 },
  { key: 'difficulty_name', label: '難易度', width: 10 },
  { key: 'reading_time', label: '読了時間(分)', width: 12 },
  { key: 'views', label: '閲覧数', width: 10 },
  { key: 'status', label: 'ステータス', width: 10 },
  { key: 'created_at', label: '作成日', width: 15 },
]

export default function AdminArticles() {
  const [articles, setArticles] = useState<any[]>([])
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

  const fetchArticles = () => {
    setLoading(true); setError('')
    const params: any = { per_page: perPage, page, status: 'all' }
    if (moduleFilter) params.module = moduleFilter
    adminApi.getArticles(params).then(res => {
      if (res.success) { setArticles(res.data || []); setTotal(res.total || 0) }
      else setError(res.message || '取得失敗')
    }).catch(() => setError('APIエラー')).finally(() => setLoading(false))
  }

  useEffect(() => { fetchArticles() }, [page, moduleFilter])
  useEffect(() => { setSelectedIds([]) }, [page])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    if (!search.trim()) { fetchArticles(); return }
    setLoading(true)
    adminApi.searchArticles(search, { per_page: perPage })
      .then(res => { if (res.success) { setArticles(res.data || []); setTotal(res.data?.length || 0) } })
      .finally(() => setLoading(false))
  }

  const handleExport = async () => {
    const res = await adminApi.getArticles({ per_page: 9999, status: 'all' })
    const items = res.success ? (res.data || []) : []
    const rows = items.map((a: any) => ({
      id: a.id, title: a.title, slug: a.slug,
      module_name: a.module?.name || '', difficulty_name: a.difficulty?.name || '',
      reading_time: a.reading_time || 5, views: a.views || 0,
      status: a.status || 'publish', created_at: a.created_at?.slice(0, 10) || '',
    }))
    exportToExcel(rows, ARTICLE_COLUMNS, `記事一覧_${rows.length}件`)
  }

  const handleImport = async (rows: Record<string, any>[]) => {
    let success = 0; let failed = 0; const errors: { row: number; message: string }[] = []
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i]; const rowNum = i + 2
      if (!r['タイトル']?.trim()) { failed++; errors.push({ row: rowNum, message: 'タイトルが空です' }); continue }
      try {
        const body: any = { title: r['タイトル'], excerpt: r['摘録'] || '', reading_time: parseInt(r['読了時間(分)'] || '5') }
        const mod = (r['モジュール'] || '').toString().toLowerCase().trim()
        if (mod) { const m = SAP_MODULES.find(x => x.slug === mod || x.code?.toLowerCase() === mod); if (m) body.module = m.slug }
        await adminApi.createArticle(body)
        success++
      } catch { failed++; errors.push({ row: rowNum, message: '保存失敗' }) }
    }
    if (success > 0) fetchArticles()
    return { success, failed, errors }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    const res = await adminApi.deleteArticle(deleteId)
    if (res.success) { setArticles(prev => prev.filter(a => a.id !== deleteId)); setTotal(prev => Math.max(0, prev - 1)) }
    setDeleting(false); setDeleteId(null)
  }

  const handleBatchStatus = async (status: string) => {
    for (const id of selectedIds) await adminApi.updateArticle(id, { status })
    setArticles(prev => prev.map(i => selectedIds.includes(i.id) ? { ...i, status } : i))
    setSelectedIds([])
  }

  const totalPages = Math.ceil(total / perPage)
  const allSelected = articles.length > 0 && articles.every(i => selectedIds.includes(i.id))

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
          <Link href="/admin/articles/new" className="admin-btn admin-btn-primary">+ 新規記事</Link>
        </div>
      </div>
      {error && <div className="admin-error">{error}</div>}

      <div className="admin-search-bar">
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
          <input type="text" className="admin-input" placeholder="記事を検索..." value={search} onChange={e => setSearch(e.target.value)} />
          <button type="submit" className="admin-btn">検索</button>
        </form>
        <select className="admin-input admin-input-sm" value={moduleFilter} onChange={e => { setModuleFilter(e.target.value); setPage(1) }}>
          <option value="">すべてのモジュール</option>
          {SAP_MODULES.map(m => <option key={m.slug} value={m.slug}>{m.code}</option>)}
        </select>
      </div>

      {loading ? <div className="admin-loading">読み込み中...</div>
      : articles.length === 0 ? (
        <div className="admin-empty"><div className="admin-empty-icon">🎋</div><p>まだ記事がありません</p><Link href="/admin/articles/new" className="admin-btn admin-btn-primary">最初の記事を作成</Link></div>
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}><input type="checkbox" onChange={e => { const c = e.target.checked; setSelectedIds(c ? articles.map(i => i.id) : []) }} checked={allSelected} /></th>
                  <th>タイトル</th>
                  <th className="col-hide-mobile">モジュール</th>
                  <th className="col-hide-mobile">難易度</th>
                  <th className="col-hide-tablet">閲覧数</th>
                  <th className="col-hide-tablet">作成日</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {articles.map(a => (
                  <tr key={a.id}>
                    <td><input type="checkbox" checked={selectedIds.includes(a.id)} onChange={e => setSelectedIds(prev => e.target.checked ? [...prev, a.id] : prev.filter(id => id !== a.id))} /></td>
                    <td className="admin-cell-title">{a.title}</td>
                    <td className="col-hide-mobile">{a.module?.name || '—'}</td>
                    <td className="col-hide-mobile">{a.difficulty ? <span className={`admin-diff-lv l${a.difficulty.slug === 'beginner' ? 1 : a.difficulty.slug === 'intermediate' ? 2 : 3}`}>{a.difficulty.name}</span> : '—'}</td>
                    <td className="col-hide-tablet">{a.views || 0}</td>
                    <td className="admin-cell-date col-hide-tablet">{a.created_at?.slice(0, 10)}</td>
                    <td>
                      <div className="admin-actions">
                        <Link href={`/admin/articles/${a.id}/edit`} className="admin-btn admin-btn-sm">編集</Link>
                        <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => setDeleteId(a.id)}>削除</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selectedIds.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'var(--accent-soft)', borderRadius: 'var(--r-md)', marginTop: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-deep)' }}>{selectedIds.length} 件選択中</span>
              <button className="admin-btn admin-btn-sm admin-btn-primary" onClick={() => handleBatchStatus('publish')}>公開する</button>
              <button className="admin-btn admin-btn-sm" onClick={() => handleBatchStatus('draft')}>下書きにする</button>
              <button className="admin-btn admin-btn-sm" onClick={() => setSelectedIds([])} style={{ marginLeft: 'auto' }}>解除</button>
            </div>
          )}
          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onChange={p => setPage(p)} />}
        </>
      )}

      {showImport && <ImportModal columns={ARTICLE_COLUMNS} templateFilename="記事インポート" onImport={handleImport} onClose={() => { setShowImport(false); fetchArticles() }} />}
      {deleteId && (
        <div className="admin-overlay" onClick={() => !deleting && setDeleteId(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>記事を削除しますか？</h3>
            <p>この操作は取り消せません。</p>
            <div className="admin-modal-actions">
              <button className="admin-btn" onClick={() => setDeleteId(null)} disabled={deleting}>キャンセル</button>
              <button className="admin-btn admin-btn-danger" onClick={handleDelete} disabled={deleting}>{deleting ? '削除中...' : '削除する'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
