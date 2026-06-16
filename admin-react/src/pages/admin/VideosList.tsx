// ===========================================================
// VideosList — 動画管理一覧 /admin/videos
// ===========================================================

import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import Pagination from '../../components/admin/Pagination'
import { SAP_MODULES } from '../../types'

interface VideoItem {
  id: number
  title: string
  youtube_id: string
  duration: string
  module: { slug: string; name: string } | null
  views: number
  thumbnail?: string
  status: string
  created_at: string
}

export default function VideosList() {
  const [items, setItems] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [moduleFilter, setModuleFilter] = useState('')
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const perPage = 20

  const fetch = () => {
    setLoading(true); setError('')
    api.client.get('/videos', { params: { per_page: 100, status: 'all' } })
      .then(({ data }) => { if (data.success) setItems(data.data || []); else setError(data.message) })
      .catch(() => setError('APIエラー'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const toggleStatus = async (v: VideoItem) => {
    const ns = v.status === 'publish' ? 'draft' : 'publish'
    try { const { data } = await api.client.put(`/videos/${v.id}`, { status: ns }); if (data.success) setItems(prev => prev.map(i => i.id === v.id ? { ...i, status: ns } : i)) }
    catch {}
  }

  const handleBatchStatus = async (status: string) => {
    for (const id of selectedIds) {
      try { await api.client.put(`/videos/${id}`, { status }) } catch {}
    }
    setItems(prev => prev.map(i => selectedIds.includes(i.id) ? { ...i, status } : i))
    setSelectedIds([])
  }

  const filtered = useMemo(() => {
    let result = items
    if (search.trim()) { const q = search.toLowerCase(); result = result.filter(v => v.title.toLowerCase().includes(q)) }
    if (moduleFilter) result = result.filter(v => v.module?.slug === moduleFilter)
    return result
  }, [items, search, moduleFilter])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)
  useEffect(() => { setPage(1) }, [search, moduleFilter])

  const allSelected = paginated.length > 0 && paginated.every(v => selectedIds.includes(v.id))

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? paginated.map(v => v.id) : [])
  }

  const handleDelete = async () => {
    if (!deleteId) return; setDeleting(true)
    try { const { data } = await api.client.delete(`/videos/${deleteId}`); if (data.success) setItems(prev => prev.filter(v => v.id !== deleteId)) }
    catch {} finally { setDeleting(false); setDeleteId(null) }
  }

  const toggleStyle = (v: VideoItem): React.CSSProperties => ({
    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '3px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 600,
    background: v.status === 'publish' ? '#d8ead9' : '#f0e7d2',
    color: v.status === 'publish' ? '#3e7a52' : '#7a6e58',
    transition: 'all .12s', userSelect: 'none',
  })

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>動画管理</h1>
          <p className="admin-page-desc">全 {items.length} 件</p>
        </div>
        <Link to="/admin/videos/new" className="admin-btn admin-btn-primary">+ 新規動画</Link>
      </div>
      {error && <div className="admin-error">{error}</div>}

      <div className="admin-search-bar" style={{ flexWrap: 'nowrap' }}>
        <input type="text" className="admin-input" placeholder="タイトルを検索..."
          value={search} onChange={e => setSearch(e.target.value)} style={{ minWidth: 160 }} />
        <select className="admin-input admin-input-sm" value={moduleFilter} onChange={e => setModuleFilter(e.target.value)}>
          <option value="">すべてのモジュール</option>
          {SAP_MODULES.map(m => <option key={m.slug} value={m.slug}>{m.code}</option>)}
        </select>
        <span style={{ fontSize: 12, color: 'var(--ink-3)', alignSelf: 'center', whiteSpace: 'nowrap' }}>
          {filtered.length} / {items.length} 件
        </span>
      </div>

      {loading ? <div className="admin-loading">読み込み中...</div>
      : items.length === 0 ? (
        <div className="admin-empty"><div className="admin-empty-icon">🎋</div><p>まだ動画がありません</p></div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty"><div className="admin-empty-icon">🔍</div><p>検索条件に一致する動画がありません</p></div>
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}><input type="checkbox" onChange={e => handleSelectAll(e.target.checked)} checked={allSelected} /></th>
                  <th>サムネイル</th>
                  <th>タイトル</th>
                  <th>モジュール</th>
                  <th>時間</th>
                  <th>再生数</th>
                  <th>YouTube</th>
                  <th>ステータス</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(v => (
                  <tr key={v.id}>
                    <td><input type="checkbox" checked={selectedIds.includes(v.id)} onChange={e => setSelectedIds(prev => e.target.checked ? [...prev, v.id] : prev.filter(id => id !== v.id))} /></td>
                    <td>{v.thumbnail ? <img src={v.thumbnail} alt="" style={{ width: 60, height: 34, borderRadius: 4, objectFit: 'cover' }} /> : v.youtube_id ? <img src={`https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg`} alt="" style={{ width: 60, height: 34, borderRadius: 4, objectFit: 'cover' }} /> : <span style={{ fontSize: 18 }}>🎬</span>}</td>
                    <td className="admin-cell-title">{v.title}</td>
                    <td>{v.module?.name || '—'}</td>
                    <td>{v.duration || '—'}</td>
                    <td>{v.views || 0}</td>
                    <td>
                      {v.youtube_id ? (
                        <a href={`https://youtube.com/watch?v=${v.youtube_id}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: 'var(--accent-deep)' }}>
                          ▶ 再生
                        </a>
                      ) : '—'}
                    </td>
                    <td>
                      <span onClick={() => toggleStatus(v)} style={toggleStyle(v)}
                        title={v.status === 'publish' ? 'クリックで下書きに変更' : 'クリックで公開に変更'}>
                        {v.status === 'publish' ? '✅ 公開' : '📝 下書き'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <Link to={`/admin/videos/${v.id}/edit`} className="admin-btn admin-btn-sm">編集</Link>
                        <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => setDeleteId(v.id)}>削除</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Batch actions */}
          {selectedIds.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'var(--accent-soft)', borderRadius: 'var(--r-md)', marginTop: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-deep)' }}>{selectedIds.length} 件選択中</span>
              <button className="admin-btn admin-btn-sm admin-btn-primary" onClick={() => handleBatchStatus('publish')}>公開する</button>
              <button className="admin-btn admin-btn-sm" onClick={() => handleBatchStatus('draft')}>下書きにする</button>
              <button className="admin-btn admin-btn-sm" onClick={() => setSelectedIds([])} style={{ marginLeft: 'auto' }}>解除</button>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onChange={p => setPage(p)} />
          )}
        </>
      )}
      {deleteId && (
        <div className="admin-overlay" onClick={() => !deleting && setDeleteId(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>動画を削除しますか？</h3><p>この操作は取り消せません。</p>
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
