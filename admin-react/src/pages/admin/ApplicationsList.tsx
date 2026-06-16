// ===========================================================
// ApplicationsList — 応募管理一覧 /admin/applications
// ===========================================================

import { useState, useEffect } from 'react'
import api from '../../services/api'
import Pagination from '../../components/admin/Pagination'

interface Application {
  id: number
  case_id: number
  case_title: string
  applicant_name: string
  applicant_email: string
  applicant_phone: string
  expected_rate: string
  experience_years: string
  skill_modules: string
  self_pr: string
  resume_file: string
  status: string
  created_at: string
}

const STATUS_LABELS: Record<string, string> = {
  pending: '未対応', contacted: '連絡済', approved: '成約', rejected: '不採用',
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#f0c33c', contacted: '#72aee6', approved: '#68de7c', rejected: '#e65054',
}

export default function ApplicationsList() {
  const [items, setItems] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [detailApp, setDetailApp] = useState<Application | null>(null)
  const perPage = 20

  // Fetch is server-side paginated
  const fetchData = () => {
    setLoading(true); setError('')
    api.client.get('/applications', { params: { per_page: perPage, page, status: statusFilter || undefined, s: search || undefined } })
      .then(({ data }) => {
        if (data.success) { setItems(data.data || []); setTotal(data.total || 0) }
        else setError(data.message)
      })
      .catch(() => setError('取得失敗'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [page, statusFilter])
  useEffect(() => { setSelectedIds([]) }, [page, statusFilter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); setPage(1); fetchData()
  }

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const { data } = await api.client.post('/applications', { id, status: newStatus })
      if (data.success) setItems(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i))
    } catch {}
  }

  const handleBatchStatus = async (newStatus: string) => {
    for (const id of selectedIds) {
      try { await api.client.post('/applications', { id, status: newStatus }) } catch {}
    }
    setItems(prev => prev.map(i => selectedIds.includes(i.id) ? { ...i, status: newStatus } : i))
    setSelectedIds([])
  }

  const totalPages = Math.ceil(total / perPage)
  const allSelected = items.length > 0 && items.every(a => selectedIds.includes(a.id))

  const getSkillModules = (app: Application): string[] => {
    try { return JSON.parse(app.skill_modules) || [] } catch { return [] }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>応募管理</h1>
          <p className="admin-page-desc">全 {total} 件</p>
        </div>
      </div>
      {error && <div className="admin-error">{error}</div>}

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        {Object.entries(STATUS_LABELS).map(([k, v]) => (
          <div key={k} style={{ flex: 1, padding: '14px 16px', borderRadius: 'var(--r-md)', background: 'var(--bg-card)', border: '1px solid var(--line-1)', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: STATUS_COLORS[k] }}>{items.filter(i => i.status === k).length}</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="admin-search-bar">
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
          <input type="text" className="admin-input" placeholder="名前・メールを検索..."
            value={search} onChange={e => setSearch(e.target.value)} style={{ minWidth: 200 }} />
          <button type="submit" className="admin-btn">検索</button>
        </form>
        <select className="admin-input admin-input-sm" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}>
          <option value="">すべて</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <span style={{ fontSize: 12, color: 'var(--ink-3)', alignSelf: 'center' }}>{total} 件</span>
      </div>

      {loading ? <div className="admin-loading">読み込み中...</div>
      : items.length === 0 ? (
        <div className="admin-empty"><div className="admin-empty-icon">🎋</div><p>応募がありません</p></div>
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}><input type="checkbox" onChange={e => { setSelectedIds(e.target.checked ? items.map(a => a.id) : []) }} checked={allSelected} /></th>
                  <th>応募者</th>
                  <th>メール</th>
                  <th>案件</th>
                  <th>単価</th>
                  <th>経験</th>
                  <th>ステータス</th>
                  <th>応募日</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {items.map(a => (
                  <tr key={a.id}>
                    <td><input type="checkbox" checked={selectedIds.includes(a.id)} onChange={e => setSelectedIds(prev => e.target.checked ? [...prev, a.id] : prev.filter(id => id !== a.id))} /></td>
                    <td><strong>{a.applicant_name}</strong></td>
                    <td><a href={`mailto:${a.applicant_email}`} style={{ color: 'var(--accent-deep)', fontSize: 12 }}>{a.applicant_email}</a></td>
                    <td style={{ fontSize: 12, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {a.case_id ? (a.case_title || '—') : '汎用登録'}
                    </td>
                    <td>{a.expected_rate || '—'}</td>
                    <td>{a.experience_years || '—'}</td>
                    <td>
                      <span style={{
                        display: 'inline-block', padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                        background: STATUS_COLORS[a.status] + '22', color: STATUS_COLORS[a.status],
                      }}>
                        {STATUS_LABELS[a.status] || a.status}
                      </span>
                    </td>
                    <td className="admin-cell-date">{new Date(a.created_at).toLocaleDateString('ja-JP')}</td>
                    <td>
                      <div className="admin-actions" style={{ flexDirection: 'column', gap: 4 }}>
                        <button className="admin-btn admin-btn-sm" onClick={() => setDetailApp(a)}>詳細</button>
                        <select className="admin-input" value={a.status} onChange={e => updateStatus(a.id, e.target.value)}
                          style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4 }}>
                          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
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
              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                <button key={k} className="admin-btn admin-btn-sm" onClick={() => handleBatchStatus(k)}
                  style={{ background: STATUS_COLORS[k] + '22', color: STATUS_COLORS[k], borderColor: STATUS_COLORS[k] }}>
                  {v}に変更
                </button>
              ))}
              <button className="admin-btn admin-btn-sm" onClick={() => setSelectedIds([])} style={{ marginLeft: 'auto' }}>解除</button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          )}
        </>
      )}

      {/* Detail Modal */}
      {detailApp && (
        <div className="admin-overlay" onClick={() => setDetailApp(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 560, maxHeight: '80vh', overflowY: 'auto' }}>
            <button className="case-modal-x" onClick={() => setDetailApp(null)} aria-label="閉じる">×</button>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink-0)', margin: '0 0 16px' }}>
              📋 {detailApp.applicant_name}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 13 }}>
              <div style={detailRowStyle}><span style={kStyle}>メール</span><span>{detailApp.applicant_email}</span></div>
              <div style={detailRowStyle}><span style={kStyle}>電話</span><span>{detailApp.applicant_phone || '—'}</span></div>
              <div style={detailRowStyle}><span style={kStyle}>案件</span><span>{detailApp.case_title || '汎用登録'}</span></div>
              <div style={detailRowStyle}><span style={kStyle}>希望単価</span><span>{detailApp.expected_rate || '—'}</span></div>
              <div style={detailRowStyle}><span style={kStyle}>経験年数</span><span>{detailApp.experience_years || '—'}</span></div>
              <div style={detailRowStyle}><span style={kStyle}>応募日</span><span>{new Date(detailApp.created_at).toLocaleDateString('ja-JP')}</span></div>
              <div style={detailRowStyle}><span style={kStyle}>ステータス</span>
                <span style={{ color: STATUS_COLORS[detailApp.status], fontWeight: 600 }}>{STATUS_LABELS[detailApp.status] || detailApp.status}</span>
              </div>
              <div style={detailRowStyle}><span style={kStyle}>履歴書</span>
                <span>{detailApp.resume_file ? <a href={detailApp.resume_file} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-deep)' }}>📎 ダウンロード</a> : '—'}</span>
              </div>
              <div style={{ gridColumn: '1/-1', padding: '8px 0' }}>
                <strong style={kStyle}>スキル</strong>
                <div style={{ marginTop: 4 }}>{getSkillModules(detailApp).length > 0 ? getSkillModules(detailApp).join('、') : '—'}</div>
              </div>
            </div>
            {detailApp.self_pr && (
              <div style={{ padding: '8px 0', borderTop: '1px solid var(--line-1)', marginTop: 8 }}>
                <strong style={kStyle}>自己PR</strong>
                <p style={{ fontSize: 13, color: 'var(--ink-1)', lineHeight: 1.7, margin: '6px 0 0' }}>{detailApp.self_pr}</p>
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
              <button className="btn" onClick={() => setDetailApp(null)}>閉じる</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const detailRowStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 2, padding: '6px 0',
  borderBottom: '1px solid var(--line-1)',
}
const kStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: '0.04em', textTransform: 'uppercase',
}
