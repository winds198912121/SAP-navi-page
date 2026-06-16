// ===========================================================
// AdminModules — モジュール一覧管理 /admin/modules
// ===========================================================

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

interface ModuleData {
  slug: string
  name_ja: string
  name_en: string
  description: string
  color: string
  bg_color: string
  icon: string
  order: number
  levels: string[]
  article_count: number
  course_count: number
}

export default function AdminModules() {
  const [modules, setModules] = useState<ModuleData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    api.client.get('/modules').then(({ data }) => {
      if (data.success) setModules(data.data || [])
      else setError(data.message || '取得失敗')
    }).catch(() => setError('APIエラー')).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="admin-page"><div className="admin-loading">読み込み中...</div></div>

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>モジュール管理</h1>
          <p className="admin-page-desc">全 {modules.length} モジュール</p>
        </div>
        <Link to="/admin/modules/new" className="admin-btn admin-btn-primary">+ 新規モジュール</Link>
      </div>
      {error && <div className="admin-error">{error}</div>}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>コード</th>
              <th>名称 (日本語)</th>
              <th>名称 (英語)</th>
              <th>カラー</th>
              <th>記事数</th>
              <th>コース数</th>
              <th>順序</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {modules.map(m => (
              <tr key={m.slug}>
                <td style={{ fontWeight: 700 }}>{m.icon}</td>
                <td>{m.name_ja}</td>
                <td style={{ color: 'var(--ink-2)', fontSize: 12 }}>{m.name_en}</td>
                <td>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <span style={{ width: 18, height: 18, borderRadius: 4, background: m.color, display: 'inline-block' }} />
                    <span style={{ width: 18, height: 18, borderRadius: 4, background: m.bg_color, display: 'inline-block' }} />
                    <span style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>{m.color}</span>
                  </div>
                </td>
                <td>{m.article_count}</td>
                <td>{m.course_count}</td>
                <td>{m.order || '—'}</td>
                <td>
                  <div className="admin-actions">
                    <Link to={`/admin/modules/${m.slug}/edit`} className="admin-btn admin-btn-sm">編集</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
