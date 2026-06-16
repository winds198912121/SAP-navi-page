// ===========================================================
// CourseForm — コース作成/編集 /admin/courses/new, /admin/courses/:id/edit
// ===========================================================

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'
import HtmlEditor from '../../components/admin/HtmlEditor'
import { SAP_MODULES } from '../../types'
import type { Course } from '../../types'

const DIFFICULTIES = [
  { slug: 'beginner', name: '初級' },
  { slug: 'intermediate', name: '中級' },
  { slug: 'advanced', name: '上級' },
]

export default function CourseForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    module: '',
    difficulty: '',
    price: 0,
    duration: '',
  })

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.getCourse(parseInt(id)).then(res => {
      if (res.success && res.data) {
        const c = res.data
        setForm({
          title: c.title || '',
          excerpt: c.excerpt || '',
          content: c.content || '',
          module: c.module?.slug || '',
          difficulty: c.difficulty?.slug || '',
          price: c.price || 0,
          duration: c.duration || '',
        })
      }
    }).catch(() => setError('コースの取得に失敗しました。'))
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = (field: string, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('タイトルは必須です。')
      return
    }
    setSaving(true)
    setError('')
    try {
      if (isEdit) {
        const res = await api.updateCourse(parseInt(id!), form)
        if (res.success) navigate('/admin/courses')
        else setError(res.message || '更新に失敗しました。')
      } else {
        const res = await api.createCourse(form)
        if (res.success) navigate('/admin/courses')
        else setError(res.message || '作成に失敗しました。')
      }
    } catch {
      setError('サーバーエラーが発生しました。')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="admin-page">
      <div className="admin-loading">読み込み中...</div>
    </div>
  )

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <div className="admin-crumb">
            <Link to="/admin/courses">コース管理</Link>
            <span className="sep"> › </span>
            <span>{isEdit ? '編集' : '新規作成'}</span>
          </div>
          <h1>{isEdit ? 'コースを編集' : '新規コース作成'}</h1>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-card">
          <div className="admin-form-group">
            <label className="admin-label">タイトル <span className="admin-required">*</span></label>
            <input type="text" className="admin-input" value={form.title}
              onChange={e => handleChange('title', e.target.value)} placeholder="コースタイトル" required />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">摘録</label>
            <textarea className="admin-input admin-textarea" value={form.excerpt}
              onChange={e => handleChange('excerpt', e.target.value)} placeholder="短い説明文" rows={3} />
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
              <select className="admin-input" value={form.module}
                onChange={e => handleChange('module', e.target.value)}>
                <option value="">選択なし</option>
                {SAP_MODULES.map(m => (
                  <option key={m.slug} value={m.slug}>{m.code} · {m.name_ja}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">難易度</label>
              <select className="admin-input" value={form.difficulty}
                onChange={e => handleChange('difficulty', e.target.value)}>
                <option value="">選択なし</option>
                {DIFFICULTIES.map(d => (
                  <option key={d.slug} value={d.slug}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">価格 (円)</label>
              <input type="number" className="admin-input" value={form.price}
                onChange={e => handleChange('price', parseInt(e.target.value) || 0)} min={0} />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">所要時間</label>
              <input type="text" className="admin-input" value={form.duration}
                onChange={e => handleChange('duration', e.target.value)} placeholder="例: 3 weeks" />
            </div>
          </div>
        </div>

        <div className="admin-form-actions">
          <Link to="/admin/courses" className="admin-btn">キャンセル</Link>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? '保存中...' : (isEdit ? '更新する' : '作成する')}
          </button>
        </div>
      </form>
    </div>
  )
}
