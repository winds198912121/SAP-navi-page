'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { adminApi } from '@/lib/admin-api'

export default function AdminCases() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const fetch = () => { setLoading(true); adminApi.getCases({ per_page: 50 }).then(r => { if (r.success) setItems(r.data || []) }).finally(() => setLoading(false)) }
  useEffect(() => { fetch() }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    const res = await adminApi.deleteCase(deleteId)
    if (res.success) setItems(prev => prev.filter(i => i.id !== deleteId))
    setDeleteId(null)
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div><h1>💼 案件管理</h1><p className="admin-page-desc">全 {items.length} 件</p></div>
        <Link href="/admin/cases/new" className="admin-btn admin-btn-primary">+ 新規案件</Link>
      </div>
      {loading ? <div className="admin-loading">読み込み中...</div>
      : items.length === 0 ? <div className="admin-empty"><div className="admin-empty-icon">💼</div><p>案件がまだありません</p></div>
      : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>ID</th><th>タイトル</th><th>会社</th><th>単価</th><th>場所</th><th>操作</th></tr></thead>
            <tbody>{items.map((item: any) => (
              <tr key={item.id}>
                <td className="admin-cell-id">{item.id}</td>
                <td className="admin-cell-title">{item.title}</td>
                <td>{item.company || '—'}</td>
                <td>{item.rate_label || (item.rate_min ? `¥${item.rate_min}~${item.rate_max}` : '—')}</td>
                <td>{item.location || '—'}</td>
                <td><div className="admin-actions"><Link href={`/admin/cases/${item.id}/edit`} className="admin-btn admin-btn-sm">編集</Link><button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => setDeleteId(item.id)}>削除</button></div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {deleteId && (
        <div className="admin-overlay" onClick={() => setDeleteId(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>削除しますか？</h3><p>この操作は取り消せません。</p>
            <div className="admin-modal-actions"><button className="admin-btn" onClick={() => setDeleteId(null)}>キャンセル</button><button className="admin-btn admin-btn-danger" onClick={handleDelete}>削除する</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
