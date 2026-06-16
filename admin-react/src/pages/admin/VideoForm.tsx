// ===========================================================
// VideoForm — 動画作成/編集 /admin/videos/new, /admin/videos/:id/edit
// ===========================================================

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'
import { SAP_MODULES } from '../../types'
import HtmlEditor from '../../components/admin/HtmlEditor'

export default function VideoForm() {
  const { id } = useParams(); const navigate = useNavigate(); const isEdit = !!id
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false); const [error, setError] = useState('')
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [youtubeId, setYoutubeId] = useState('')
  const [duration, setDuration] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [module, setModule] = useState('')
  const [status, setStatus] = useState('publish')

  useEffect(() => {
    if (!id) return; setLoading(true)
    api.client.get(`/videos/${id}`).then(({ data }) => {
      if (data.success && data.data) {
        const v = data.data
        setTitle(v.title || ''); setExcerpt(v.excerpt || '')
        setContent(v.content || ''); setYoutubeId(v.youtube_id || '')
        setDuration(v.duration || ''); setThumbnail(v.thumbnail || ''); setModule(v.module?.slug || '')
        setStatus(v.status || 'publish')
      }
    }).catch(() => setError('取得失敗')).finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) { setError('タイトルは必須です。'); return }
    setSaving(true); setError('')
    const payload = { title, excerpt, content, youtube_id: youtubeId, duration, thumbnail, module, status }
    try {
      if (isEdit) {
        const { data } = await api.client.put(`/videos/${id}`, payload)
        if (data.success) navigate('/admin/videos'); else setError(data.message || '更新失敗')
      } else {
        const { data } = await api.client.post('/videos', payload)
        if (data.success) navigate('/admin/videos'); else setError(data.message || '作成失敗')
      }
    } catch { setError('サーバーエラー') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="admin-page"><div className="admin-loading">読み込み中...</div></div>

  const is = { width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--line-2)', fontFamily: 'inherit', fontSize: 13, outline: 'none' } as React.CSSProperties

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <div className="admin-crumb"><Link to="/admin/videos">動画管理</Link><span className="sep"> › </span><span>{isEdit ? '編集' : '新規作成'}</span></div>
          <h1>{isEdit ? '動画を編集' : '新規動画作成'}</h1>
        </div>
      </div>
      {error && <div className="admin-error">{error}</div>}
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-card">
          <div className="admin-form-group">
            <label className="admin-label">タイトル <span className="admin-required">*</span></label>
            <input type="text" style={is} value={title} onChange={e => setTitle(e.target.value)} placeholder="動画タイトル" required />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">摘録</label>
            <textarea style={{ ...is, minHeight: 60, resize: 'vertical' }} value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="短い説明文" />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">説明文</label>
            <HtmlEditor value={content} onChange={setContent} placeholder="動画の説明を入力..." />
          </div>
        </div>
        <div className="admin-form-card">
          <h3>動画設定</h3>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">YouTube動画ID</label>
              <input type="text" style={{ ...is, fontFamily: 'monospace' }} value={youtubeId} onChange={e => setYoutubeId(e.target.value)} placeholder="dQw4w9WgXcQ" />
              {youtubeId && (
                <div style={{ marginTop: 6 }}>
                  <img src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`} alt="preview" style={{ width: 160, borderRadius: 8, border: '1px solid var(--line-2)' }} />
                </div>
              )}
            </div>
            <div className="admin-form-group">
              <label className="admin-label">再生時間</label>
              <input type="text" style={is} value={duration} onChange={e => setDuration(e.target.value)} placeholder="32:14" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">サムネイルURL</label>
              <input type="text" style={{ ...is, fontFamily: 'monospace', fontSize: 12 }} value={thumbnail} onChange={e => setThumbnail(e.target.value)} placeholder="https://example.com/thumb.jpg" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">モジュール</label>
              <select style={is} value={module} onChange={e => setModule(e.target.value)}>
                <option value="">選択なし</option>
                {SAP_MODULES.map(m => <option key={m.slug} value={m.slug}>{m.code} · {m.name_ja}</option>)}
              </select>
            </div>
          </div>
          <div className="admin-form-group">
            <label className="admin-label">ステータス</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" onClick={() => setStatus('publish')}
                style={{ flex: 1, padding: '7px 0', borderRadius: 8, border: '1.5px solid', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
                  background: status === 'publish' ? 'var(--accent)' : 'var(--bg-card)', color: status === 'publish' ? 'white' : 'var(--ink-1)', borderColor: status === 'publish' ? 'var(--accent)' : 'var(--line-2)' }}>
                公開
              </button>
              <button type="button" onClick={() => setStatus('draft')}
                style={{ flex: 1, padding: '7px 0', borderRadius: 8, border: '1.5px solid', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
                  background: status === 'draft' ? 'var(--ink-3)' : 'var(--bg-card)', color: status === 'draft' ? 'white' : 'var(--ink-1)', borderColor: status === 'draft' ? 'var(--ink-3)' : 'var(--line-2)' }}>
                下書き
              </button>
            </div>
          </div>
        </div>
        <div className="admin-form-actions">
          <Link to="/admin/videos" className="admin-btn">キャンセル</Link>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? '保存中...' : (isEdit ? '更新する' : '作成する')}
          </button>
        </div>
      </form>
    </div>
  )
}
