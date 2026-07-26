'use client'
import { useState, useEffect } from 'react'
import { adminApi } from '@/lib/admin-api'

export default function AdminUsers() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { setLoading(true); adminApi.getUsers({ per_page: 50 }).then(r => { if (r.success) setItems(r.data || []) }).finally(() => setLoading(false)) }, [])

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div><h1>👥 ユーザー管理</h1><p className="admin-page-desc">全 {items.length} 件</p></div>
      </div>
      {loading ? <div className="admin-loading">読み込み中...</div>
      : items.length === 0 ? <div className="admin-empty"><div className="admin-empty-icon">👥</div><p>ユーザーがいません</p></div>
      : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>ID</th><th>名前</th><th>メール</th><th>ロール</th><th>登録日</th></tr></thead>
            <tbody>{items.map((item: any) => (
              <tr key={item.id}>
                <td className="admin-cell-id">{item.id}</td>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {item.avatar && <img src={item.avatar} alt="" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />}
                  <span>{item.name || item.displayName || '—'}</span>
                </div></td>
                <td style={{ fontSize: 12 }}>{item.email || '—'}</td>
                <td>{(item.roles || []).join(', ') || '—'}</td>
                <td className="admin-cell-date">{item.registered_at?.slice(0, 10) || item.created_at?.slice(0, 10) || '—'}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  )
}
