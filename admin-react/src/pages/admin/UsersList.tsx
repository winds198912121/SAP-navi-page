// ===========================================================
// UsersList — ユーザー管理 /admin/users
// ===========================================================

import { useState, useEffect } from 'react'
import api from '../../services/api'

interface UserItem {
  id: number
  email: string
  display_name: string
  roles: string[]
  registered_at: string
  avatar_url: string
}

const ROLE_LABELS: Record<string, string> = {
  administrator: '管理者', editor: '編集者', author: '投稿者', subscriber: 'メンバー',
}

const allRoles = Object.entries(ROLE_LABELS)

export default function UsersList() {
  const [items, setItems] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [batchRole, setBatchRole] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [editRole, setEditRole] = useState('')
  const perPage = 20

  const fetch = () => {
    setLoading(true); setError('')
    api.client.get('/users', { params: { per_page: perPage, page, s: search || undefined, role: roleFilter || undefined } })
      .then(({ data }) => {
        if (data.success) {
          setItems(Array.isArray(data.data) ? data.data : [])
          setTotal(typeof data.total === 'number' ? data.total : 0)
        } else setError(data.message || '取得失敗')
      })
      .catch((err: any) => setError(err?.response?.data?.message || err?.message || 'APIエラー'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [page, roleFilter])
  useEffect(() => { setSelectedIds([]) }, [page, roleFilter])

  const totalPages = Math.ceil(total / perPage)
  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); fetch() }

  const allSelected = items.length > 0 && items.every(u => selectedIds.includes(u.id))

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? items.map(u => u.id) : [])
  }

  const changeUserRole = async (id: number, newRole: string) => {
    try {
      const { data } = await api.client.put(`/users/${id}`, { role: newRole })
      if (data.success) setItems(prev => prev.map(u => u.id === id ? { ...u, roles: [newRole] } : u))
    } catch {}
  }

  const applyBatchRole = async () => {
    if (!batchRole || selectedIds.length === 0) return
    for (const id of selectedIds) {
      try { await api.client.put(`/users/${id}`, { role: batchRole }) } catch {}
    }
    setItems(prev => prev.map(u => selectedIds.includes(u.id) ? { ...u, roles: [batchRole] } : u))
    setSelectedIds([]); setBatchRole('')
  }

  const handleBatchDelete = async () => {
    if (!selectedIds.length || !window.confirm(`${selectedIds.length} 人のユーザーを削除しますか？`)) return
    const errors: string[] = []
    for (const id of selectedIds) {
      try { const { data } = await api.client.delete(`/users/${id}`); if (!data.success) errors.push(data.message) }
      catch { errors.push(`ID ${id}: 削除失敗`) }
    }
    if (errors.length) alert(errors.join('\n'))
    setItems(prev => prev.filter(u => !selectedIds.includes(u.id)))
    setTotal(prev => Math.max(0, prev - selectedIds.length))
    setSelectedIds([])
  }

  const resetPassword = async (id: number, name: string) => {
    if (!window.confirm(`${name} のパスワードをリセットし、新しいパスワードをメールで送信しますか？`)) return
    try {
      const { data } = await api.client.post(`/users/${id}/reset-password`)
      alert(data.data?.message || '送信しました')
    } catch (err: any) { alert(err?.response?.data?.message || 'リセット失敗') }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>ユーザー管理</h1>
          <p className="admin-page-desc">全 {total} ユーザー</p>
        </div>
      </div>
      {error && <div className="admin-error">{error}</div>}

      <div className="admin-search-bar">
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
          <input type="text" className="admin-input" placeholder="名前・メールを検索..."
            value={search} onChange={e => setSearch(e.target.value)} style={{ minWidth: 200 }} />
          <button type="submit" className="admin-btn">検索</button>
        </form>
        <select className="admin-input admin-input-sm" value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1) }}>
          <option value="">すべてのロール</option>
          {allRoles.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <span style={{ fontSize: 12, color: 'var(--ink-3)', alignSelf: 'center' }}>{total} 人</span>
      </div>

      {loading ? <div className="admin-loading">読み込み中...</div>
      : items.length === 0 ? (
        <div className="admin-empty"><div className="admin-empty-icon">🎋</div><p>ユーザーがいません</p></div>
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}><input type="checkbox" onChange={e => handleSelectAll(e.target.checked)} checked={allSelected} /></th>
                  <th>アバター</th>
                  <th>名前</th>
                  <th>メール</th>
                  <th>ロール</th>
                  <th>登録日</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {items.map(u => (
                  <tr key={u.id}>
                    <td><input type="checkbox" checked={selectedIds.includes(u.id)} onChange={e => setSelectedIds(prev => e.target.checked ? [...prev, u.id] : prev.filter(id => id !== u.id))} /></td>
                    <td><img src={u.avatar_url} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', background: 'var(--bg-tint)' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} /></td>
                    <td style={{ fontWeight: 600 }}>{u.display_name}</td>
                    <td style={{ fontSize: 12 }}>{u.email}</td>
                    <td>
                      {editId === u.id ? (
                        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                          <select className="admin-input" value={editRole} onChange={e => setEditRole(e.target.value)}
                            style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4 }}>
                            {allRoles.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                          </select>
                          <button className="admin-btn admin-btn-sm" onClick={() => { changeUserRole(u.id, editRole); setEditId(null) }}>保存</button>
                          <button className="admin-btn admin-btn-sm" onClick={() => setEditId(null)}>取消</button>
                        </div>
                      ) : (
                        <span style={{ cursor: 'pointer' }} onClick={() => { setEditId(u.id); setEditRole(u.roles[0] || 'subscriber') }}
                          title="クリックしてロール変更">
                          {u.roles.map(r => ROLE_LABELS[r] || r).join(', ')} ✏
                        </span>
                      )}
                    </td>
                    <td className="admin-cell-date">{new Date(u.registered_at).toLocaleDateString('ja-JP')}</td>
                    <td>
                      <div className="admin-actions" style={{ flexDirection: 'column', gap: 4 }}>
                        {u.roles.includes('administrator') ? (
                          <span style={{ fontSize: 11, color: 'var(--ink-3)', padding: '4px 0', display: 'inline-block' }}>🔒 保護</span>
                        ) : (
                          <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={async () => {
                            if (!window.confirm(`${u.display_name} を削除しますか？`)) return
                            try {
                              const { data } = await api.client.delete(`/users/${u.id}`)
                              if (!data.success) { alert(data.message); return }
                              setItems(prev => prev.filter(i => i.id !== u.id)); setTotal(prev => prev - 1)
                            } catch (err: any) { alert(err?.response?.data?.message || '削除失敗') }
                          }}>削除</button>
                        )}
                        <button className="admin-btn admin-btn-sm" onClick={() => resetPassword(u.id, u.display_name)}
                          style={{ fontSize: 10.5 }}>🔑 パスワード<br/>リセット</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bulk actions bar */}
          {selectedIds.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'var(--accent-soft)', borderRadius: 'var(--r-md)', marginTop: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-deep)' }}>{selectedIds.length} 件選択中</span>
              <select className="admin-input admin-input-sm" value={batchRole} onChange={e => setBatchRole(e.target.value)} style={{ fontSize: 12 }}>
                <option value="">ロールを変更</option>
                {allRoles.map(([k, v]) => <option key={k} value={k}>{v}にする</option>)}
              </select>
              <button className="admin-btn admin-btn-sm admin-btn-primary" disabled={!batchRole} onClick={applyBatchRole}>適用</button>
              <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={handleBatchDelete}>削除</button>
              <button className="admin-btn admin-btn-sm" onClick={() => setSelectedIds([])} style={{ marginLeft: 'auto' }}>解除</button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="admin-pagination">
              <button className="admin-btn admin-btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← 前へ</button>
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                let p: number
                if (totalPages <= 10) p = i + 1
                else if (page <= 5) p = i + 1
                else if (page >= totalPages - 4) p = totalPages - 9 + i
                else p = page - 5 + i
                if (p >= 1 && p <= totalPages) {
                  return (
                    <button key={p} onClick={() => setPage(p)} className="admin-btn admin-btn-sm"
                      style={{ minWidth: 34, justifyContent: 'center', background: p === page ? 'var(--accent)' : '', color: p === page ? 'white' : '', borderColor: p === page ? 'var(--accent)' : '' }}>
                      {p}
                    </button>
                  )
                }
                return null
              })}
              <button className="admin-btn admin-btn-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>次へ →</button>
              <span style={{ fontSize: 12, color: 'var(--ink-3)', marginLeft: 8 }}>{page} / {totalPages}</span>
            </div>
          )}
        </>
      )}
    </div>
  )
}
