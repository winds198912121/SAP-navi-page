'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { adminApi } from '@/lib/admin-api'
import HtmlEditor from '../HtmlEditor'

export default function LessonForm() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string | undefined
  const isEdit = !!id
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [courses, setCourses] = useState<any[]>([])
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', course_id: '', order: '', time: '' })

  useEffect(() => { adminApi.getCourses({ per_page: 50 }).then(r => { if (r.success) setCourses(r.data || []) }).catch(() => {}) }, [])

  useEffect(() => {
    if (!id) return; setLoading(true)
    adminApi.getLesson(parseInt(id)).then(res => {
      if (res.success && res.data) {
        const l = res.data
        setForm({ title: l.title || '', excerpt: l.excerpt || '', content: l.content || '', course_id: l.course_id ? String(l.course_id) : '', order: l.order ? String(l.order) : '', time: l.time || '' })
      }
    }).catch(() => setError('レッスンの取得に失敗しました。')).finally(() => setLoading(false))
  }, [id])

  const handleChange = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('タイトルは必須です。'); return }
    setSaving(true); setError('')
    const payload = { title: form.title, excerpt: form.excerpt, content: form.content, course_id: form.course_id ? parseInt(form.course_id) : 0, order: form.order ? parseInt(form.order) : 0, time: form.time }
    try {
      const res = isEdit ? await adminApi.updateLesson(parseInt(id!), payload) : await adminApi.createLesson(payload)
      if (res.success) router.push('/admin/lessons')
      else setError(res.message || (isEdit ? '更新失敗' : '作成失敗'))
    } catch { setError('サーバーエラー') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="admin-page"><div className="admin-loading">読み込み中...</div></div>

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <div className="admin-crumb"><Link href="/admin/lessons">レッスン管理</Link><span className="sep"> › </span><span>{isEdit ? '編集' : '新規作成'}</span></div>
          <h1>{isEdit ? 'レッスンを編集' : '新規レッスン作成'}</h1>
        </div>
      </div>
      {error && <div className="admin-error">{error}</div>}
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-card">
          <div className="admin-form-group">
            <label className="admin-label">タイトル <span className="admin-required">*</span></label>
            <input type="text" className="admin-input" value={form.title} onChange={e => handleChange('title', e.target.value)} placeholder="レッスンタイトル" required />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">摘録</label>
            <textarea className="admin-input admin-textarea" value={form.excerpt} onChange={e => handleChange('excerpt', e.target.value)} rows={3} placeholder="短い説明文" />
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
              <select className="admin-input" value={form.course_id} onChange={e => handleChange('course_id', e.target.value)}>
                <option value="">選択してください</option>
                {courses.map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">順序</label>
              <input type="number" className="admin-input" value={form.order} onChange={e => handleChange('order', e.target.value)} min={0} placeholder="0" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">所要時間</label>
              <input type="text" className="admin-input" value={form.time} onChange={e => handleChange('time', e.target.value)} placeholder="例: 20 min" />
            </div>
          </div>
        </div>
        <div className="admin-form-actions">
          <Link href="/admin/lessons" className="admin-btn">キャンセル</Link>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? '保存中...' : (isEdit ? '更新する' : '作成する')}
          </button>
        </div>
      </form>
    </div>
  )
}
