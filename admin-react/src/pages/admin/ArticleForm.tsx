// ===========================================================
// ArticleForm — 記事作成/編集 /admin/articles/new, /admin/articles/:id/edit
// ===========================================================

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'
import { SAP_MODULES } from '../../types'
import HtmlEditor from '../../components/admin/HtmlEditor'

const DIFFICULTIES = [
  { slug: 'beginner', name: '初級' },
  { slug: 'intermediate', name: '中級' },
  { slug: 'advanced', name: '上級' },
]

const TOPICS = [
  { slug: 'basic', name: '基本概念' },
  { slug: 'master', name: 'マスタ' },
  { slug: 'transaction', name: 'トランザクション' },
  { slug: 'process', name: 'プロセス' },
  { slug: 'glossary', name: '用語集' },
  { slug: 'trends', name: 'SAPトレンド' },
  { slug: 'career-guide', name: '転職ガイド' },
]

export default function ArticleForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', excerpt: '', content: '',
    module: '', difficulty: '', topic: '', reading_time: 5,
  })

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.client.get(`/articles/${id}`).then(({ data }) => {
      if (data.success && data.data) {
        const a = data.data
        setForm({
          title: a.title || '',
          excerpt: a.excerpt || '',
          content: a.content || '',
          module: a.module?.slug || '',
          difficulty: a.difficulty?.slug || '',
          topic: a.topic?.slug || '',
          reading_time: a.reading_time || 5,
        })
      }
    }).catch(() => setError('取得に失敗')).finally(() => setLoading(false))
  }, [id])

  const handleChange = (field: string, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('タイトルは必須です。'); return }
    setSaving(true); setError('')
    try {
      if (isEdit) {
        const res = await api.client.put(`/articles/${id}`, form)
        if (res.data.success) navigate('/admin/articles')
        else setError(res.data.message || '更新失敗')
      } else {
        const res = await api.client.post('/articles', form)
        if (res.data.success) navigate('/admin/articles')
        else setError(res.data.message || '作成失敗')
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
            <Link to="/admin/articles">記事管理</Link>
            <span className="sep"> › </span><span>{isEdit ? '編集' : '新規作成'}</span>
          </div>
          <h1>{isEdit ? '記事を編集' : '新規記事作成'}</h1>
        </div>
      </div>
      {error && <div className="admin-error">{error}</div>}
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-card">
          <div className="admin-form-group">
            <label className="admin-label">タイトル <span className="admin-required">*</span></label>
            <input type="text" className="admin-input" value={form.title}
              onChange={e => handleChange('title', e.target.value)} placeholder="記事タイトル" required />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">摘録</label>
            <textarea className="admin-input admin-textarea" value={form.excerpt}
              onChange={e => handleChange('excerpt', e.target.value)} rows={3} placeholder="短い説明文" />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">内容</label>
            <HtmlEditor value={form.content} onChange={v => handleChange('content', v)} placeholder="記事内容を入力..." />
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
              <label className="admin-label">トピック</label>
              <select className="admin-input" value={form.topic} onChange={e => handleChange('topic', e.target.value)}>
                <option value="">選択なし</option>
                {TOPICS.map(t => <option key={t.slug} value={t.slug}>{t.name}</option>)}
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">読了時間 (分)</label>
              <input type="number" className="admin-input" value={form.reading_time}
                onChange={e => handleChange('reading_time', parseInt(e.target.value) || 5)} min={1} max={120} />
            </div>
          </div>
        </div>
        <div className="admin-form-actions">
          <Link to="/admin/articles" className="admin-btn">キャンセル</Link>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? '保存中...' : (isEdit ? '更新する' : '作成する')}
          </button>
        </div>
      </form>
    </div>
  )
}
