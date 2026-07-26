'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { adminApi } from '@/lib/admin-api'
import { SAP_MODULES, DIFFICULTIES } from './shared'
import HtmlEditor from '../HtmlEditor'

const KNOWLEDGE_TYPES = [
  { slug: 'concept', name: '概念' }, { slug: 'tcode', name: 'T-Code' },
  { slug: 'best_practice', name: 'ベストプラクティス' }, { slug: 'glossary', name: 'SAP用語集' },
  { slug: 'faq', name: 'SAP FAQ' }, { slug: 'tcode_dict', name: 'TCode辞典' },
  { slug: 'error_code', name: '錯誤コード庫' }, { slug: 'config_guide', name: '配置指南' },
  { slug: 'tutorial', name: '教程' }, { slug: 'interview', name: '面接題' },
  { slug: 'career', name: '転職指南' }, { slug: 'special', name: '專題分類' },
]

export default function KnowledgeForm() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string | undefined
  const isEdit = !!id
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', module: '', type: '', difficulty: '' })

  useEffect(() => {
    if (!id) return; setLoading(true)
    adminApi.getKnowledgeDetail(parseInt(id)).then(res => {
      if (res.success && res.data) { const k = res.data; setForm({ title: k.title || '', excerpt: k.excerpt || '', content: k.content || '', module: k.module?.slug || '', type: k.type || '', difficulty: k.difficulty?.slug || '' }) }
    }).catch(() => setError('ナレッジの取得に失敗しました。')).finally(() => setLoading(false))
  }, [id])

  const handleChange = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('タイトルは必須です。'); return }
    setSaving(true); setError('')
    try {
      const res = isEdit ? await adminApi.updateKnowledge(parseInt(id!), form) : await adminApi.createKnowledge(form)
      if (res.success) router.push('/admin/knowledge')
      else setError(res.message || (isEdit ? '更新失敗' : '作成失敗'))
    } catch { setError('サーバーエラー') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="admin-page"><div className="admin-loading">読み込み中...</div></div>

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <div className="admin-crumb"><Link href="/admin/knowledge">ナレッジ管理</Link><span className="sep"> › </span><span>{isEdit ? '編集' : '新規作成'}</span></div>
          <h1>{isEdit ? 'ナレッジを編集' : '新規ナレッジ作成'}</h1>
        </div>
      </div>
      {error && <div className="admin-error">{error}</div>}
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-card">
          <div className="admin-form-group">
            <label className="admin-label">タイトル <span className="admin-required">*</span></label>
            <input type="text" className="admin-input" value={form.title} onChange={e => handleChange('title', e.target.value)} placeholder="ナレッジタイトル" required />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">摘録</label>
            <textarea className="admin-input admin-textarea" value={form.excerpt} onChange={e => handleChange('excerpt', e.target.value)} rows={3} placeholder="短い説明文" />
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
              <select className="admin-input" value={form.module} onChange={e => handleChange('module', e.target.value)}>
                <option value="">選択なし</option>
                {SAP_MODULES.map(m => <option key={m.slug} value={m.slug}>{m.code} · {m.name_ja}</option>)}
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">タイプ</label>
              <select className="admin-input" value={form.type} onChange={e => handleChange('type', e.target.value)}>
                <option value="">選択なし</option>
                {KNOWLEDGE_TYPES.map(t => <option key={t.slug} value={t.slug}>{t.name}</option>)}
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">難易度</label>
              <select className="admin-input" value={form.difficulty} onChange={e => handleChange('difficulty', e.target.value)}>
                <option value="">選択なし</option>
                {DIFFICULTIES.map(d => <option key={d.slug} value={d.slug}>{d.name}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="admin-form-actions">
          <Link href="/admin/knowledge" className="admin-btn">キャンセル</Link>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? '保存中...' : (isEdit ? '更新する' : '作成する')}
          </button>
        </div>
      </form>
    </div>
  )
}
