// ===========================================================
// KnowledgeForm — ナレッジ作成/編集 /admin/knowledge/new, /admin/knowledge/:id/edit
// ===========================================================

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'
import HtmlEditor from '../../components/admin/HtmlEditor'
import { SAP_MODULES } from '../../types'

const KNOWLEDGE_TYPES = [
  { slug: 'concept', name: '概念' },
  { slug: 'tcode', name: 'T-Code' },
  { slug: 'best_practice', name: 'ベストプラクティス' },
  { slug: 'glossary', name: 'SAP用語集' },
  { slug: 'faq', name: 'SAP FAQ' },
  { slug: 'tcode_dict', name: 'TCode辞典' },
  { slug: 'error_code', name: '錯誤コード庫' },
  { slug: 'config_guide', name: '配置指南' },
  { slug: 'tutorial', name: '教程' },
  { slug: 'interview', name: '面接題' },
  { slug: 'career', name: '転職指南' },
  { slug: 'special', name: '專題分類' },
]

const DIFFICULTIES = [
  { slug: 'beginner', name: '初級' },
  { slug: 'intermediate', name: '中級' },
  { slug: 'advanced', name: '上級' },
]

export default function KnowledgeForm() {
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
    type: '',
    difficulty: '',
  })

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.getKnowledge(parseInt(id)).then(res => {
      if (res.success && res.data) {
        const k = res.data
        setForm({
          title: k.title || '',
          excerpt: k.excerpt || '',
          content: k.content || '',
          module: k.module?.slug || '',
          type: k.type || '',
          difficulty: k.difficulty?.slug || '',
        })
      }
    }).catch(() => setError('ナレッジの取得に失敗しました。'))
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
    try {
      if (isEdit) {
        const res = await api.updateKnowledge(parseInt(id!), form)
        if (res.success) navigate('/admin/knowledge')
        else setError(res.message || '更新に失敗しました。')
      } else {
        const res = await api.createKnowledge(form)
        if (res.success) navigate('/admin/knowledge')
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
            <Link to="/admin/knowledge">ナレッジ管理</Link>
            <span className="sep"> › </span>
            <span>{isEdit ? '編集' : '新規作成'}</span>
          </div>
          <h1>{isEdit ? 'ナレッジを編集' : '新規ナレッジ作成'}</h1>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-card">
          <div className="admin-form-group">
            <label className="admin-label">タイトル <span className="admin-required">*</span></label>
            <input type="text" className="admin-input" value={form.title}
              onChange={e => handleChange('title', e.target.value)} placeholder="ナレッジタイトル" required />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">摘録</label>
            <textarea className="admin-input admin-textarea" value={form.excerpt}
              onChange={e => handleChange('excerpt', e.target.value)} placeholder="短い説明文" rows={3} />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">内容</label>
            <HtmlEditor value={form.content} onChange={v => handleChange('content', v)} placeholder="ナレッジ内容を入力..." />
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
              <label className="admin-label">タイプ</label>
              <select className="admin-input" value={form.type}
                onChange={e => handleChange('type', e.target.value)}>
                <option value="">選択なし</option>
                {KNOWLEDGE_TYPES.map(t => (
                  <option key={t.slug} value={t.slug}>{t.name}</option>
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
        </div>

        <div className="admin-form-actions">
          <Link to="/admin/knowledge" className="admin-btn">キャンセル</Link>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? '保存中...' : (isEdit ? '更新する' : '作成する')}
          </button>
        </div>
      </form>
    </div>
  )
}
