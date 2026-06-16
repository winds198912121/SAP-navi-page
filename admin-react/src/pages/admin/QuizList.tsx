// ===========================================================
// QuizList — クイズ一覧管理 /admin/quizzes
// 検索・モジュール・難易度フィルター + ページネーション
// ===========================================================

import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import Pagination from '../../components/admin/Pagination'
import { SAP_MODULES } from '../../types'

interface QuizItem {
  id: number
  title: string
  options: { text: string; correct: boolean }[]
  explanation: string
  difficulty: string
  module: { slug: string; name: string } | null
  date: string
  status: string
  created_at: string
}

const DIFF_LABELS: Record<string, string> = { beginner: '初級', intermediate: '中級', advanced: '上級' }
const DIFF_OPTIONS = [
  { slug: 'beginner', name: '初級' },
  { slug: 'intermediate', name: '中級' },
  { slug: 'advanced', name: '上級' },
]

export default function QuizList() {
  const [items, setItems] = useState<QuizItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [moduleFilter, setModuleFilter] = useState('')
  const [diffFilter, setDiffFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const perPage = 20

  const fetch = () => {
    setLoading(true); setError('')
    api.client.get('/quizzes', { params: { per_page: 100 } })
      .then(({ data }) => { if (data.success) setItems(data.data || []); else setError(data.message) })
      .catch(() => setError('APIエラー'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const filtered = useMemo(() => {
    let result = items
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      result = result.filter(item => item.title.toLowerCase().includes(q) || item.explanation.toLowerCase().includes(q))
    }
    if (moduleFilter) result = result.filter(item => item.module?.slug === moduleFilter)
    if (diffFilter) result = result.filter(item => item.difficulty === diffFilter)
    if (dateFilter) result = result.filter(item => (item.date || '') === dateFilter)
    return result
  }, [items, search, moduleFilter, diffFilter, dateFilter])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  useEffect(() => { setPage(1) }, [search, moduleFilter, diffFilter, dateFilter])
  useEffect(() => { setSelectedIds([]) }, [page])

  const allSelected = paginated.length > 0 && paginated.every(q => selectedIds.includes(q.id))

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? paginated.map(q => q.id) : [])
  }

  const toggleStatus = async (q: QuizItem) => {
    const ns = q.status === 'publish' ? 'draft' : 'publish'
    try { const { data } = await api.client.put(`/quizzes/${q.id}`, { status: ns }); if (data.success) setItems(prev => prev.map(i => i.id === q.id ? { ...i, status: ns } : i)) }
    catch {}
  }

  const handleBatchStatus = async (status: string) => {
    for (const id of selectedIds) {
      try { await api.client.put(`/quizzes/${id}`, { status }) } catch {}
    }
    setItems(prev => prev.map(i => selectedIds.includes(i.id) ? { ...i, status } : i))
    setSelectedIds([])
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try { const { data } = await api.client.delete(`/quizzes/${deleteId}`); if (data.success) setItems(prev => prev.filter(q => q.id !== deleteId)) }
    catch {} finally { setDeleting(false); setDeleteId(null) }
  }

  const toggleStyle = (q: QuizItem): React.CSSProperties => ({
    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '3px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 600,
    background: q.status === 'publish' ? '#d8ead9' : '#f0e7d2',
    color: q.status === 'publish' ? '#3e7a52' : '#7a6e58',
    transition: 'all .12s', userSelect: 'none',
  })

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>クイズ管理</h1>
          <p className="admin-page-desc">全 {items.length} 問</p>
        </div>
        <Link to="/admin/quizzes/new" className="admin-btn admin-btn-primary">+ 新規クイズ</Link>
      </div>
      {error && <div className="admin-error">{error}</div>}

      {/* Filters */}
      <div className="admin-search-bar" style={{ flexWrap: 'nowrap' }}>
        <input type="text" className="admin-input" placeholder="問題文・解説を検索..."
          value={search} onChange={e => setSearch(e.target.value)} style={{ minWidth: 140 }} />
        <select className="admin-input admin-input-sm" value={moduleFilter}
          onChange={e => setModuleFilter(e.target.value)}>
          <option value="">すべてのモジュール</option>
          {SAP_MODULES.map(m => <option key={m.slug} value={m.slug}>{m.code}</option>)}
        </select>
        <select className="admin-input admin-input-sm" value={diffFilter}
          onChange={e => setDiffFilter(e.target.value)}>
          <option value="">すべての難易度</option>
          {DIFF_OPTIONS.map(d => <option key={d.slug} value={d.slug}>{d.name}</option>)}
        </select>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
          <input type="date" className="admin-input" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
            style={{ width: 140, padding: '7px 10px', fontSize: 12 }} />
          {dateFilter && (
            <span onClick={() => setDateFilter('')} style={{ cursor: 'pointer', fontSize: 15, color: 'var(--ink-3)', padding: '0 4px', userSelect: 'none' }}>×</span>
          )}
        </div>
        <span style={{ fontSize: 12, color: 'var(--ink-3)', alignSelf: 'center', whiteSpace: 'nowrap' }}>
          {filtered.length} / {items.length} 件
        </span>
      </div>

      {loading ? <div className="admin-loading">読み込み中...</div>
      : items.length === 0 ? (
        <div className="admin-empty"><div className="admin-empty-icon">🎋</div><p>まだクイズがありません</p></div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">🔍</div>
          <p>検索条件に一致するクイズがありません</p>
          <button className="admin-btn" style={{ marginTop: 12 }} onClick={() => { setSearch(''); setModuleFilter(''); setDiffFilter(''); setDateFilter('') }}>クリア</button>
        </div>
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}><input type="checkbox" onChange={e => handleSelectAll(e.target.checked)} checked={allSelected} /></th>
                  <th>問題文</th>
                  <th>正解</th>
                  <th>モジュール</th>
                  <th>難易度</th>
                  <th>実施日</th>
                  <th>ステータス</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(q => {
                  const correctIdx = q.options.findIndex(o => o.correct)
                  return (
                    <tr key={q.id}>
                      <td><input type="checkbox" checked={selectedIds.includes(q.id)} onChange={e => setSelectedIds(prev => e.target.checked ? [...prev, q.id] : prev.filter(id => id !== q.id))} /></td>
                      <td className="admin-cell-title">{q.title}</td>
                      <td style={{ fontSize: 12 }}>{correctIdx >= 0 ? String.fromCharCode(65 + correctIdx) : '—'}</td>
                      <td>{q.module?.name || '—'}</td>
                      <td>{q.difficulty ? <span className={`admin-diff-lv l${q.difficulty === 'beginner' ? 1 : q.difficulty === 'intermediate' ? 2 : 3}`}>{DIFF_LABELS[q.difficulty]}</span> : '—'}</td>
                      <td className="admin-cell-date">{q.date || '—'}</td>
                      <td>
                        <span onClick={() => toggleStatus(q)} style={toggleStyle(q)}
                          title={q.status === 'publish' ? 'クリックで下書きに変更' : 'クリックで公開に変更'}>
                          {q.status === 'publish' ? '✅ 公開' : '📝 下書き'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <Link to={`/admin/quizzes/${q.id}/edit`} className="admin-btn admin-btn-sm">編集</Link>
                          <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => setDeleteId(q.id)}>削除</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
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
            <h3>クイズを削除しますか？</h3>
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
