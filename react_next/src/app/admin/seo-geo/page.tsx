'use client'
import { adminApi } from '@/lib/admin-api'

export default function AdminSeoGeo() {
  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div><h1>🌐 SEO/GEO 設定</h1></div>
      </div>
      <div className="admin-form" style={{ maxWidth: 600 }}>
        <div className="admin-form-card">
          <div className="admin-form-group">
            <label className="admin-label">サイトタイトル</label>
            <input type="text" className="admin-input" defaultValue="SAP パンダ先生 NAVI" style={{ width: '100%' }} />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">サイト説明</label>
            <textarea className="admin-input admin-textarea" rows={3} defaultValue="SAP学習プラットフォーム for 日本人エンジニア" style={{ width: '100%' }} />
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn admin-btn-primary">保存</button>
          </div>
        </div>
      </div>
    </div>
  )
}
