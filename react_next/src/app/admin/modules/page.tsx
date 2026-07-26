'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { adminApi } from '@/lib/admin-api'

export default function AdminModules() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null)

  const fetch = () => { setLoading(true); adminApi.getModules().then(r => { if (r.success) setItems(r.data || []) }).finally(() => setLoading(false)) }
  useEffect(() => { fetch() }, [])

  const handleDelete = async () => {
    if (!deleteSlug) return
    const res = await adminApi.deleteModule(deleteSlug)
    if (res.success) setItems(prev => prev.filter(i => i.slug !== deleteSlug))
    setDeleteSlug(null)
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div><h1>🧩 モジュール管理</h1><p className="admin-page-desc">全 {items.length} モジュール</p></div>
        <Link href="/admin/modules/new" className="admin-btn admin-btn-primary">+ 新規モジュール</Link>
      </div>
      {loading ? <div className="admin-loading">読み込み中...</div>
      : items.length === 0 ? <div className="admin-empty"><div className="admin-empty-icon">🧩</div><p>モジュールがまだありません</p></div>
      : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>コード</th><th>名称（日本語）</th><th>名称（英語）</th><th>記事数</th><th>操作</th></tr></thead>
            <tbody>{items.map((m: any) => (
              <tr key={m.slug}>
                <td><strong>{m.code || m.slug?.toUpperCase()}</strong></td>
                <td>{m.name_ja || '—'}</td>
                <td>{m.name_en || '—'}</td>
                <td>{m.article_count || 0}</td>
                <td><div className="admin-actions"><Link href={`/admin/modules/${m.slug}/edit`} className="admin-btn admin-btn-sm">編集</Link><button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => setDeleteSlug(m.slug)}>削除</button></div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {deleteSlug && (
        <div className="admin-overlay" onClick={() => setDeleteSlug(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>削除しますか？</h3><p>この操作は取り消せません。</p>
            <div className="admin-modal-actions"><button className="admin-btn" onClick={() => setDeleteSlug(null)}>キャンセル</button><button className="admin-btn admin-btn-danger" onClick={handleDelete}>削除する</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
