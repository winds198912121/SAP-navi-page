// ===========================================================
// NoteForm — 记事作成/編集（管理画面）
// ===========================================================

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'
import { SAP_MODULES } from '../../types'

export default function NoteForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', module: '', difficulty: '',
  })

  useEffect(() => {
    if (!id) return
    api.getNote(parseInt(id)).then(res => {
      if (res.success && res.data) {
        const n = res.data
        setForm({
          title: n.title || '',
          excerpt: n.excerpt || '',
          content: n.content || '',
          module: n.module?.slug || '',
          difficulty: n.difficulty?.slug || '',
        })
      }
    }).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('タイトルは必須です'); return }
    setSaving(true)
    setError('')
    try {
      let res
      if (isEdit) {
        res = await api.updateNote(parseInt(id!), form)
      } else {
        res = await api.createNote(form)
      }
      if (res.success) {
        navigate('/admin/notes')
      } else {
        setError(res.message || '保存に失敗しました')
      }
    } catch (err: any) {
      setError(err?.message || '保存中にエラーが発生しました')
    } finally {
      setSaving(false)
    }
  }

  const update = (key: string, val: any) => setForm(prev => ({ ...prev, [key]: val }))

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)' }}>読み込み中...</div>

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Link to="/admin/notes" style={{ color: 'var(--ink-2)', textDecoration: 'none', fontSize: 20 }}>←</Link>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)' }}>{isEdit ? '记事編集' : '新規记事作成'}</h2>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: '#fef2f2', color: '#b91c1c', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: 800 }}>
        <div className="admin-field">
          <label>タイトル *</label>
          <input type="text" value={form.title} onChange={e => update('title', e.target.value)} placeholder="记事タイトル" required />
        </div>

        <div className="admin-field">
          <label>抜粋</label>
          <textarea value={form.excerpt} onChange={e => update('excerpt', e.target.value)} placeholder="記事の簡単な説明" rows={2} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div className="admin-field" style={{ marginBottom: 0 }}>
            <label>モジュール</label>
            <select value={form.module} onChange={e => update('module', e.target.value)}>
              <option value="">選択してください</option>
              {SAP_MODULES.map((m: any) => (
                <option key={m.slug} value={m.slug}>{m.name_ja || m.name}</option>
              ))}
            </select>
          </div>
          <div className="admin-field" style={{ marginBottom: 0 }}>
            <label>難易度</label>
            <select value={form.difficulty} onChange={e => update('difficulty', e.target.value)}>
              <option value="">選択してください</option>
              <option value="beginner">初級</option>
              <option value="intermediate">中級</option>
              <option value="advanced">上級</option>
            </select>
          </div>
        </div>

        <div className="admin-field">
          <label>本文 (HTML)</label>
          <textarea value={form.content} onChange={e => update('content', e.target.value)} placeholder="<h2>...</h2><p>...</p>" rows={20} style={{ fontFamily: 'monospace', fontSize: 13 }} />
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button type="submit" className="btn accent" disabled={saving}>
            {saving ? '保存中...' : (isEdit ? '更新する' : '作成する')}
          </button>
          <Link to="/admin/notes" className="btn" style={{ textDecoration: 'none' }}>キャンセル</Link>
        </div>
      </form>
    </div>
  )
}
