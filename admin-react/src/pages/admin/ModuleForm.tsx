// ===========================================================
// ModuleForm — モジュール作成/編集 /admin/modules/new, /admin/modules/:slug/edit
// ===========================================================

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'

export default function ModuleForm() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const isEdit = !!slug
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name_ja: '', name_en: '', description: '',
    color: '#5a9d6e', bg_color: '#d8ead9',
    icon: '', order: '', slug: '', levels: [] as string[],
  })

  const allLevels = ['初級', '中級', '上級']
  const toggleLevel = (level: string) => {
    setForm(prev => ({
      ...prev,
      levels: prev.levels.includes(level)
        ? prev.levels.filter(l => l !== level)
        : [...prev.levels, level],
    }))
  }

  useEffect(() => {
    if (!isEdit) return
    setLoading(true)
    api.client.get(`/modules/${slug}`).then(({ data }) => {
      if (data.success && data.data) {
        const m = data.data
        setForm({
          name_ja: m.name_ja || '',
          name_en: m.name_en || '',
          description: m.description || '',
          color: m.color || '#5a9d6e',
          bg_color: m.bg_color || '#d8ead9',
          icon: m.icon || slug!.toUpperCase(),
          order: m.order ? String(m.order) : '',
          slug: m.slug || slug!,
          levels: m.levels || [],
        })
      }
    }).catch(() => setError('取得失敗')).finally(() => setLoading(false))
  }, [slug, isEdit])

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name_ja.trim()) { setError('名称は必須です。'); return }
    setSaving(true)
    setError('')
    try {
      if (isEdit) {
        const res = await api.client.put(`/modules/${slug}`, form)
        if (res.data.success) navigate('/admin/modules')
        else setError(res.data.message || '更新に失敗')
      } else {
        if (!form.slug.trim()) { setError('スラッグは必須です。'); setSaving(false); return }
        const res = await api.client.post('/modules', form)
        if (res.data.success) navigate('/admin/modules')
        else setError(res.data.message || '作成に失敗')
      }
    } catch { setError('サーバーエラー') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="admin-page"><div className="admin-loading">読み込み中...</div></div>

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <div className="admin-crumb">
            <Link to="/admin/modules">モジュール管理</Link>
            <span className="sep"> › </span>
            <span>{isEdit ? `編集: ${slug}` : '新規作成'}</span>
          </div>
          <h1>{isEdit ? `モジュール編集: ${slug?.toUpperCase()}` : '新規モジュール作成'}</h1>
        </div>
      </div>
      {error && <div className="admin-error">{error}</div>}
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-card">
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">名称（日本語） <span className="admin-required">*</span></label>
              <input type="text" className="admin-input" value={form.name_ja}
                onChange={e => handleChange('name_ja', e.target.value)} placeholder="例: 財務会計" required />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">名称（英語）</label>
              <input type="text" className="admin-input" value={form.name_en}
                onChange={e => handleChange('name_en', e.target.value)} placeholder="例: Financial Accounting" />
            </div>
          </div>
          {!isEdit && (
            <div className="admin-form-group">
              <label className="admin-label">スラッグ <span className="admin-required">*</span></label>
              <input type="text" className="admin-input" value={form.slug}
                onChange={e => handleChange('slug', e.target.value)} placeholder="例: fi" style={{ fontFamily: 'monospace' }} required />
            </div>
          )}
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">コード（表示用）</label>
              <input type="text" className="admin-input" value={form.icon}
                onChange={e => handleChange('icon', e.target.value)} placeholder="例: FI" style={{ fontFamily: 'monospace' }} />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">表示順序</label>
              <input type="number" className="admin-input" value={form.order}
                onChange={e => handleChange('order', e.target.value)} min={0} placeholder="0" />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">テーマカラー</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="color" className="admin-input" value={form.color}
                  onChange={e => handleChange('color', e.target.value)} style={{ width: 48, height: 38, padding: 2 }} />
                <input type="text" className="admin-input" value={form.color}
                  onChange={e => handleChange('color', e.target.value)} style={{ flex: 1, fontFamily: 'monospace' }} />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">背景カラー</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="color" className="admin-input" value={form.bg_color}
                  onChange={e => handleChange('bg_color', e.target.value)} style={{ width: 48, height: 38, padding: 2 }} />
                <input type="text" className="admin-input" value={form.bg_color}
                  onChange={e => handleChange('bg_color', e.target.value)} style={{ flex: 1, fontFamily: 'monospace' }} />
              </div>
            </div>
          </div>
          <div className="admin-form-group">
            <label className="admin-label">説明</label>
            <textarea className="admin-input admin-textarea" value={form.description}
              onChange={e => handleChange('description', e.target.value)} rows={3} placeholder="モジュールの説明" />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">学習レベル（複数選択可）</label>
            <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
              {allLevels.map(level => (
                <label key={level} style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                  borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                  background: form.levels.includes(level) ? 'var(--accent-soft)' : 'var(--bg-tint)',
                  color: form.levels.includes(level) ? 'var(--accent-deep)' : 'var(--ink-1)',
                  border: `1.5px solid ${form.levels.includes(level) ? 'var(--accent)' : 'var(--line-2)'}`,
                }}>
                  <input type="checkbox" checked={form.levels.includes(level)}
                    onChange={() => toggleLevel(level)} style={{ accentColor: 'var(--accent)' }} />
                  {level}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="admin-form-actions">
          <Link to="/admin/modules" className="admin-btn">キャンセル</Link>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? '保存中...' : (isEdit ? '更新する' : '作成する')}
          </button>
        </div>
      </form>
    </div>
  )
}
