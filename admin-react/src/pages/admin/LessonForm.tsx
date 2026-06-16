// ===========================================================
// LessonForm — レッスン作成/編集 /admin/lessons/new, /admin/lessons/:id/edit
// ===========================================================

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'
import HtmlEditor from '../../components/admin/HtmlEditor'

export default function LessonForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [courses, setCourses] = useState<any[]>([])
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    course_id: '',
    order: '',
    time: '',
  })

  // load course list for dropdown
  useEffect(() => {
    api.client.get('/courses', { params: { per_page: 50 } })
      .then(({ data }) => { if (data.success) setCourses(data.data || []) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.client.get(`/lessons/${id}`).then(({ data }) => {
      if (data.success && data.data) {
        const l = data.data
        setForm({
          title: l.title || '',
          excerpt: l.excerpt || '',
          content: l.content || '',
          course_id: l.course_id ? String(l.course_id) : '',
          order: l.order ? String(l.order) : '',
          time: l.time || '',
        })
      }
    }).catch(() => setError('レッスンの取得に失敗しました。'))
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = (field: string, value: string) => {
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
    const payload = {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      course_id: form.course_id ? parseInt(form.course_id) : 0,
      order: form.order ? parseInt(form.order) : 0,
      time: form.time,
    }
    try {
      if (isEdit) {
        const res = await api.updateLesson(parseInt(id!), payload)
        if (res.success) navigate('/admin/lessons')
        else setError(res.message || '更新に失敗しました。')
      } else {
        const res = await api.createLesson(payload)
        if (res.success) navigate('/admin/lessons')
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
            <Link to="/admin/lessons">レッスン管理</Link>
            <span className="sep"> › </span>
            <span>{isEdit ? '編集' : '新規作成'}</span>
          </div>
          <h1>{isEdit ? 'レッスンを編集' : '新規レッスン作成'}</h1>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-card">
          <div className="admin-form-group">
            <label className="admin-label">タイトル <span className="admin-required">*</span></label>
            <input type="text" className="admin-input" value={form.title}
              onChange={e => handleChange('title', e.target.value)} placeholder="レッスンタイトル" required />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">摘録</label>
            <textarea className="admin-input admin-textarea" value={form.excerpt}
              onChange={e => handleChange('excerpt', e.target.value)} placeholder="短い説明文" rows={3} />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">内容</label>
            <HtmlEditor value={form.content} onChange={v => handleChange('content', v)} placeholder="レッスン内容を入力..." />
          </div>
        </div>

        <div className="admin-form-card">
          <h3>レッスン設定</h3>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">所属コース</label>
              <select className="admin-input" value={form.course_id}
                onChange={e => handleChange('course_id', e.target.value)}>
                <option value="">選択してください</option>
                {courses.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">順序</label>
              <input type="number" className="admin-input" value={form.order}
                onChange={e => handleChange('order', e.target.value)} min={0} placeholder="0" />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">所要時間</label>
              <input type="text" className="admin-input" value={form.time}
                onChange={e => handleChange('time', e.target.value)} placeholder="例: 20 min" />
            </div>
          </div>
        </div>

        <div className="admin-form-actions">
          <Link to="/admin/lessons" className="admin-btn">キャンセル</Link>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? '保存中...' : (isEdit ? '更新する' : '作成する')}
          </button>
        </div>
      </form>
    </div>
  )
}
