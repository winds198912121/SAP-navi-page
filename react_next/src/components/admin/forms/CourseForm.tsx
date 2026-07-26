'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { adminApi } from '@/lib/admin-api'
import { SAP_MODULES, DIFFICULTIES } from './shared'
import HtmlEditor from '../HtmlEditor'

export default function CourseForm() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string | undefined
  const isEdit = !!id
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', module: '', difficulty: '', price: 0, duration: '' })

  useEffect(() => {
    if (!id) return; setLoading(true)
    adminApi.getCourse(parseInt(id)).then(res => {
      if (res.success && res.data) { const c = res.data; setForm({ title: c.title || '', excerpt: c.excerpt || '', content: c.content || '', module: c.module?.slug || '', difficulty: c.difficulty?.slug || '', price: c.price || 0, duration: c.duration || '' }) }
    }).catch(() => setError('コースの取得に失敗しました。')).finally(() => setLoading(false))
  }, [id])

  const handleChange = (field: string, value: string | number) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('タイトルは必須です。'); return }
    setSaving(true); setError('')
    try {
      const res = isEdit ? await adminApi.updateCourse(parseInt(id!), form) : await adminApi.createCourse(form)
      if (res.success) router.push('/admin/courses')
      else setError(res.message || (isEdit ? '更新失敗' : '作成失敗'))
    } catch { setError('サーバーエラー') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="admin-page"><div className="admin-loading">読み込み中...</div></div>

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <div className="admin-crumb"><Link href="/admin/courses">コース管理</Link><span className="sep"> › </span><span>{isEdit ? '編集' : '新規作成'}</span></div>
          <h1>{isEdit ? 'コースを編集' : '新規コース作成'}</h1>
        </div>
      </div>
      {error && <div className="admin-error">{error}</div>}
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-card">
          <div className="admin-form-group">
            <label className="admin-label">タイトル <span className="admin-required">*</span></label>
            <input type="text" className="admin-input" value={form.title} onChange={e => handleChange('title', e.target.value)} placeholder="コースタイトル" required />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">摘録</label>
            <textarea className="admin-input admin-textarea" value={form.excerpt} onChange={e => handleChange('excerpt', e.target.value)} rows={3} placeholder="短い説明文" />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">内容</label>
            <HtmlEditor value={form.content} onChange={v => handleChange('content', v)} placeholder="コース内容を入力..." />
          </div>
        </div>
        <div className="admin-form-card">
          <h3>メタ情報</h3>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">モジュール</label>
              <select className="admin-input" value={form.module} onChange={e => handleChange('module', e.target.value)}>
                <option value="">選択なし</option>
                {SAP_MODULES.map(m => <option key={m.slug} value={m.slug}>{m.code} · {m.name_ja}</option>)}
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">難易度</label>
              <select className="admin-input" value={form.difficulty} onChange={e => handleChange('difficulty', e.target.value)}>
                <option value="">選択なし</option>
                {DIFFICULTIES.map(d => <option key={d.slug} value={d.slug}>{d.name}</option>)}
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">価格 (円)</label>
              <input type="number" className="admin-input" value={form.price} onChange={e => handleChange('price', parseInt(e.target.value) || 0)} min={0} />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">所要時間</label>
              <input type="text" className="admin-input" value={form.duration} onChange={e => handleChange('duration', e.target.value)} placeholder="例: 3 weeks" />
            </div>
          </div>
        </div>
        <div className="admin-form-actions">
          <Link href="/admin/courses" className="admin-btn">キャンセル</Link>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? '保存中...' : (isEdit ? '更新する' : '作成する')}
          </button>
        </div>
      </form>
    </div>
  )
}
