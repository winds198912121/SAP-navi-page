// ===========================================================
// CasesList — 案件管理一覧 /admin/cases
// ===========================================================

import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import Pagination from '../../components/admin/Pagination'

interface CaseItem {
  id: number
  title: string
  mods: string[]
  rate_min: number
  rate_max: number
  location: string
  period: string
  experience: string
  urgent: boolean
  seats: number
  company?: string
  status?: string
  created_at: string
}

const MOD_COLOR: Record<string, string> = {
  fi: '#2f6d44', co: '#2641a1', mm: '#a25411', sd: '#b62a4a', pp: '#4828a8',
  hr: '#8a6212', abap: '#1f6f6f', basis: '#4a432d', s4: '#1864a3',
}

export default function CasesList() {
  const [items, setItems] = useState<CaseItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const perPage = 20

  const fetch = () => {
    setLoading(true); setError('')
    api.client.get('/cases', { params: { per_page: 100, status: 'all' } })
      .then(({ data }) => { if (data.success) setItems(data.data || []); else setError(data.message) })
      .catch(() => setError('APIエラー'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const toggleStatus = async (c: CaseItem) => {
    const ns = c.status === 'publish' ? 'draft' : 'publish'
    try { const { data } = await api.client.put(`/cases/${c.id}`, { status: ns }); if (data.success) setItems(prev => prev.map(i => i.id === c.id ? { ...i, status: ns } : i)) }
    catch {}
  }

  const handleBatchStatus = async (status: string) => {
    for (const id of selectedIds) {
      try { await api.client.put(`/cases/${id}`, { status }) } catch {}
    }
    setItems(prev => prev.map(i => selectedIds.includes(i.id) ? { ...i, status } : i))
    setSelectedIds([])
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return items
    const q = search.toLowerCase().trim()
    return items.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.mods.some(m => m.includes(q)) ||
      c.location.toLowerCase().includes(q) ||
      c.company?.toLowerCase().includes(q)
    )
  }, [items, search])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)
  useEffect(() => { setPage(1) }, [search])
  useEffect(() => { setSelectedIds([]) }, [page])

  const allSelected = paginated.length > 0 && paginated.every(c => selectedIds.includes(c.id))

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? paginated.map(c => c.id) : [])
  }

  const handleDelete = async () => {
    if (!deleteId) return; setDeleting(true)
    try { const { data } = await api.client.delete(`/cases/${deleteId}`); if (data.success) setItems(prev => prev.filter(c => c.id !== deleteId)) }
    catch {} finally { setDeleting(false); setDeleteId(null) }
  }

  const toggleStyle = (c: CaseItem): React.CSSProperties => ({
    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '3px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 600,
    background: c.status === 'publish' ? '#d8ead9' : '#f0e7d2',
    color: c.status === 'publish' ? '#3e7a52' : '#7a6e58',
    transition: 'all .12s', userSelect: 'none',
  })

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>案件管理</h1>
          <p className="admin-page-desc">全 {items.length} 件</p>
        </div>
        <Link to="/admin/cases/new" className="admin-btn admin-btn-primary">+ 新規案件</Link>
      </div>
      {error && <div className="admin-error">{error}</div>}

      <div className="admin-search-bar" style={{ flexWrap: 'nowrap' }}>
        <input type="text" className="admin-input" placeholder="タイトル・スキル・勤務地を検索..."
          value={search} onChange={e => setSearch(e.target.value)} style={{ minWidth: 200 }} />
        <span style={{ fontSize: 12, color: 'var(--ink-3)', alignSelf: 'center', whiteSpace: 'nowrap' }}>
          {filtered.length} / {items.length} 件
        </span>
      </div>

      {loading ? <div className="admin-loading">読み込み中...</div>
      : items.length === 0 ? (
        <div className="admin-empty"><div className="admin-empty-icon">🎋</div><p>まだ案件がありません</p></div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty"><div className="admin-empty-icon">🔍</div><p>検索条件に一致する案件がありません</p></div>
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}><input type="checkbox" onChange={e => handleSelectAll(e.target.checked)} checked={allSelected} /></th>
                  <th>タイトル</th>
                  <th className="col-hide-mobile">モジュール</th>
                  <th className="col-hide-tablet">単価</th>
                  <th className="col-hide-tablet col-hide-mobile">勤務地</th>
                  <th className="col-hide-tablet col-hide-mobile">期間</th>
                  <th className="col-hide-mobile">ステータス</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(c => (
                  <tr key={c.id}>
                    <td><input type="checkbox" checked={selectedIds.includes(c.id)} onChange={e => setSelectedIds(prev => e.target.checked ? [...prev, c.id] : prev.filter(id => id !== c.id))} /></td>
                    <td className="admin-cell-title">{c.title}</td>
                    <td className="col-hide-mobile">
                      <div style={{ display: 'flex', gap: 3 }}>
                        {c.mods.map(m => (
                          <span key={m} style={{
                            display: 'inline-block', padding: '1px 6px', borderRadius: 4,
                            background: MOD_COLOR[m] || '#5a9d6e', color: '#fff',
                            fontSize: 10, fontWeight: 700, fontFamily: 'monospace',
                          }}>{m.toUpperCase()}</span>
                        ))}
                      </div>
                    </td>
                    <td className="col-hide-tablet" style={{ fontWeight: 600, color: c.rate_max >= 85 ? 'var(--rose)' : 'var(--ink-0)' }}>
                      〜{c.rate_max}万
                    </td>
                    <td className="col-hide-tablet col-hide-mobile">{c.location}</td>
                    <td className="col-hide-tablet col-hide-mobile">{c.period}</td>
                    <td className="col-hide-mobile">
                      <span onClick={() => toggleStatus(c)} style={toggleStyle(c)}
                        title={c.status === 'publish' ? 'クリックで下書きに変更' : 'クリックで公開に変更'}>
                        {c.status === 'publish' ? '✅ 公開' : '📝 下書き'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <Link to={`/admin/cases/${c.id}/edit`} className="admin-btn admin-btn-sm">編集</Link>
                        <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => setDeleteId(c.id)}>削除</button>
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
          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onChange={p => setPage(p)} />
          )}
        </>
      )}
      {deleteId && (
        <div className="admin-overlay" onClick={() => !deleting && setDeleteId(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>案件を削除しますか？</h3><p>この操作は取り消せません。</p>
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
