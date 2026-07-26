'use client'
import { useState, useEffect } from 'react'
import { adminApi } from '@/lib/admin-api'

export default function AdminPlugins() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { setLoading(true); adminApi.getPages().then(r => { if (r.success) setItems(r.data || []) }).finally(() => setLoading(false)) }, [])

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div><h1>🔌 プラグイン管理</h1><p className="admin-page-desc">WordPressプラグイン一覧</p></div>
      </div>
      {loading ? <div className="admin-loading">読み込み中...</div>
      : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>名前</th><th>ステータス</th></tr></thead>
            <tbody>
              <tr><td>ACF (Advanced Custom Fields)</td><td><span className="admin-status-badge publish">有効</span></td></tr>
              <tr><td>Custom Post Type UI</td><td><span className="admin-status-badge publish">有効</span></td></tr>
              <tr><td>JWT Authentication</td><td><span className="admin-status-badge publish">有効</span></td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
