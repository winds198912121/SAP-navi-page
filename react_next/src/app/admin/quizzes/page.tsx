'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { adminApi } from '@/lib/admin-api'

export default function AdminQuizzes() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const fetch = () => { setLoading(true); adminApi.getQuizzes({ per_page: 50 }).then(r => { if (r.success) setItems(r.data || []) }).finally(() => setLoading(false)) }
  useEffect(() => { fetch() }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    const res = await adminApi.deleteQuiz(deleteId)
    if (res.success) setItems(prev => prev.filter(i => i.id !== deleteId))
    setDeleteId(null)
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div><h1>❓ クイズ管理</h1><p className="admin-page-desc">全 {items.length} 件</p></div>
        <Link href="/admin/quizzes/new" className="admin-btn admin-btn-primary">+ 新規クイズ</Link>
      </div>
      {loading ? <div className="admin-loading">読み込み中...</div>
      : items.length === 0 ? <div className="admin-empty"><div className="admin-empty-icon">❓</div><p>クイズがまだありません</p></div>
      : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>ID</th><th>問題</th><th>モジュール</th><th>日付</th><th>操作</th></tr></thead>
            <tbody>{items.map((item: any) => (
              <tr key={item.id}>
                <td className="admin-cell-id">{item.id}</td>
                <td className="admin-cell-title">{item.question || item.title?.slice(0, 50)}</td>
                <td>{item.module?.name || '—'}</td>
                <td className="admin-cell-date">{item.date || item.created_at?.slice(0, 10) || '—'}</td>
                <td><div className="admin-actions"><Link href={`/admin/quizzes/${item.id}/edit`} className="admin-btn admin-btn-sm">編集</Link><button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => setDeleteId(item.id)}>削除</button></div></td>
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
