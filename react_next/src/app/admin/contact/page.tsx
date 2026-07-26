'use client'
import { useState, useEffect } from 'react'
import { adminApi } from '@/lib/admin-api'

export default function AdminContact() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { setLoading(true); adminApi.getContactInquiries({ per_page: 50 }).then(r => { if (r.success) setItems(r.data || []) }).finally(() => setLoading(false)) }, [])

  const markRead = async (id: number) => {
    const res = await adminApi.markContactRead(id)
    if (res.success) setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'read' } : i))
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div><h1>📨 お問い合わせ管理</h1><p className="admin-page-desc">全 {items.length} 件（{items.filter(i => i.status === 'unread').length}件未読）</p></div>
      </div>
      {loading ? <div className="admin-loading">読み込み中...</div>
      : items.length === 0 ? <div className="admin-empty"><div className="admin-empty-icon">📨</div><p>お問い合わせはありません</p></div>
      : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>ID</th><th>名前</th><th>メール</th><th>内容</th><th>ステータス</th><th>日付</th><th>操作</th></tr></thead>
            <tbody>{items.map((item: any) => (
              <tr key={item.id}>
                <td className="admin-cell-id">{item.id}</td>
                <td>{item.name || '—'}</td>
                <td style={{ fontSize: 12 }}>{item.email || '—'}</td>
                <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12 }}>{item.message || item.content || '—'}</td>
                <td><span className={`admin-status-badge ${item.status || 'unread'}`}>{item.status === 'read' ? '既読' : item.status === 'replied' ? '返信済' : '未読'}</span></td>
                <td className="admin-cell-date">{item.created_at?.slice(0, 10) || '—'}</td>
                <td>{item.status === 'unread' && <button className="admin-btn admin-btn-sm" onClick={() => markRead(item.id)}>既読にする</button>}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  )
}
