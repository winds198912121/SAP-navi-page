'use client'
import { useState, useEffect } from 'react'
import { adminApi } from '@/lib/admin-api'

export default function AdminApplications() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { setLoading(true); adminApi.getApplications({ per_page: 50 }).then(r => { if (r.success) setItems(r.data || []) }).finally(() => setLoading(false)) }, [])

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div><h1>📋 応募管理</h1><p className="admin-page-desc">全 {items.length} 件</p></div>
      </div>
      {loading ? <div className="admin-loading">読み込み中...</div>
      : items.length === 0 ? <div className="admin-empty"><div className="admin-empty-icon">📋</div><p>応募がまだありません</p></div>
      : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>ID</th><th>応募者</th><th>案件</th><th>ステータス</th><th>作成日</th></tr></thead>
            <tbody>{items.map((item: any) => (
              <tr key={item.id}>
                <td className="admin-cell-id">{item.id}</td>
                <td>{item.applicant_name || item.name || '—'}</td>
                <td>{item.case_title || '—'}</td>
                <td><span className={`admin-status-badge ${item.status || 'pending'}`}>{item.status || 'pending'}</span></td>
                <td className="admin-cell-date">{item.created_at?.slice(0, 10) || '—'}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  )
}
