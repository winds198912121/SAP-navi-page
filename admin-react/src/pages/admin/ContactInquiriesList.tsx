// ===========================================================
// ContactInquiriesList — お問い合わせ管理一覧
// ===========================================================
import { useState, useEffect } from 'react'
import api from '../../services/api'

const STATUS_LABELS: Record<string, string> = { unread: '未読', read: '既読', replied: '返信済' }
const STATUS_COLORS: Record<string, string> = { unread: '#ef4444', read: '#f59e0b', replied: '#5a9d6e' }
const TYPE_LABELS: Record<string, string> = {
  general: '一般的なお問い合わせ', course: 'コースについて', case: '案件掲載について',
  partnership: '提携について', other: 'その他',
}

export default function ContactInquiriesList() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [detail, setDetail] = useState<any>(null)
  const [memo, setMemo] = useState('')
  const [saving, setSaving] = useState(false)
  const [stats, setStats] = useState({ total: 0, unread: 0 })

  const load = async (status?: string) => {
    setLoading(true)
    try {
      const { data } = await api.client.get('/contact/inquiries', { params: { status, per_page: 100 } })
      if (data.success) {
        setItems(data.data || [])
        setStats({ total: data.total || 0, unread: data.unread_count || 0 })
      }
    } catch (err) { console.error("Failed to load inquiry detail:", err) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openDetail = async (id: number) => {
    try {
      const { data } = await api.client.get(`/contact/inquiries/${id}`)
      if (data.success) {
        setDetail(data.data)
        setMemo(data.data.memo || '')
      }
    } catch (err) { console.error("inquiry detail error:", err); alert("詳細の取得に失敗しました"); }
  }

  const updateStatus = async (id: number, status: string) => {
    setSaving(true)
    try {
      await api.client.put(`/contact/inquiries/${id}`, { status })
      setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i))
      if (detail?.id === id) setDetail((prev: any) => ({ ...prev, status }))
    } catch {} finally { setSaving(false) }
  }

  const saveMemo = async () => {
    if (!detail) return
    setSaving(true)
    try {
      await api.client.put(`/contact/inquiries/${detail.id}`, { memo })
    } catch {} finally { setSaving(false) }
  }

  const filtered = filter ? items.filter(i => i.status === filter) : items

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>お問い合わせ管理</h1>
          <p className="admin-page-desc">サイト経由のお問い合わせを管理します</p>
        </div>
      </div>

      {/* ステータスフィルター */}
      <div className="admin-search-bar">
        {[
          { value: '', label: `すべて (${stats.total})` },
          { value: 'unread', label: `未読 (${stats.unread})` },
          { value: 'read', label: '既読' },
          { value: 'replied', label: '返信済' },
        ].map(s => (
          <button key={s.value} onClick={() => { setFilter(s.value); load(s.value || undefined) }}
            className={`admin-btn admin-btn-sm ${filter === s.value ? 'admin-btn-primary' : ''}`}>
            {s.label}
          </button>
        ))}
      </div>

      {loading ? <div className="admin-loading">読み込み中...</div> : filtered.length === 0 ? (
        <div className="admin-empty"><div className="admin-empty-icon">📨</div><p>お問い合わせはありません</p></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ステータス</th>
                <th>名前</th>
                <th>種別</th>
                <th>日付</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item: any) => (
                <tr key={item.id} style={{ opacity: item.status === 'unread' ? 1 : 0.7 }}>
                  <td>
                    <span style={{
                      fontSize: 10.5, padding: '2px 8px', borderRadius: 999, fontWeight: 700,
                      background: STATUS_COLORS[item.status] + '22',
                      color: STATUS_COLORS[item.status],
                    }}>{STATUS_LABELS[item.status] || item.status}</span>
                  </td>
                  <td style={{ fontWeight: item.status === 'unread' ? 700 : 500 }}>{item.name}</td>
                  <td><span className="admin-type-badge">{TYPE_LABELS[item.inquiry_type] || item.inquiry_type}</span></td>
                  <td className="admin-cell-date">{new Date(item.created_at).toLocaleDateString('ja-JP')}</td>
                  <td>
                    <button className="admin-btn admin-btn-sm" onClick={() => openDetail(item.id)}>詳細</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 詳細モーダル */}
      {detail && (
        <div className="admin-overlay" onClick={() => setDetail(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600, width: '100%' }}>
            <div className="admin-modal-head">
              <h3 style={{ margin: 0, fontSize: 17, fontFamily: "'Zen Maru Gothic',sans-serif" }}>
                {STATUS_LABELS[detail.status] || detail.status} のお問い合わせ
              </h3>
              <button className="admin-btn admin-btn-sm" onClick={() => setDetail(null)}>✕</button>
            </div>
            <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13.5 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><strong>お名前</strong><br />{detail.name}</div>
                {detail.name_kana && <div><strong>フリガナ</strong><br />{detail.name_kana}</div>}
                <div><strong>メールアドレス</strong><br />{detail.email || '—'}</div>
                {detail.phone && <div><strong>電話番号</strong><br />{detail.phone}</div>}
                <div><strong>種別</strong><br />{TYPE_LABELS[detail.inquiry_type] || detail.inquiry_type}</div>
                <div><strong>受付日時</strong><br />{new Date(detail.created_at).toLocaleString('ja-JP')}</div>
              </div>
              <div style={{ background: 'var(--bg-tint)', borderRadius: 8, padding: 12, whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: 13 }}>
                {detail.message}
              </div>
              <div>
                <label className="admin-label">メモ（管理者用）</label>
                <textarea className="admin-input admin-textarea" style={{ width: '100%', minHeight: 60 }} value={memo} onChange={e => setMemo(e.target.value)} />
                <button className="admin-btn admin-btn-sm admin-btn-primary" onClick={saveMemo} disabled={saving} style={{ marginTop: 6 }}>
                  {saving ? '保存中...' : 'メモを保存'}
                </button>
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                {['unread', 'read', 'replied'].map(s => (
                  <button key={s} className={`admin-btn admin-btn-sm ${detail.status === s ? 'admin-btn-primary' : ''}`}
                    onClick={() => updateStatus(detail.id, s)} disabled={detail.status === s}>
                    {STATUS_LABELS[s]} にする
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
