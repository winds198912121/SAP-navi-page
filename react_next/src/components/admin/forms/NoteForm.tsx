'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { adminApi } from '@/lib/admin-api'
import { SAP_MODULES, DIFFICULTIES } from './shared'
import HtmlEditor from '../HtmlEditor'

export default function NoteForm() {
  const params = useParams(); const router = useRouter()
  const id = params?.id as string | undefined; const isEdit = !!id
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false); const [error, setError] = useState('')
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', module: '', difficulty: '' })

  useEffect(() => {
    if (!id) return; setLoading(true)
    adminApi.getNote(parseInt(id)).then(res => {
      if (res.success && res.data) { const n = res.data; setForm({ title: n.title || '', excerpt: n.excerpt || '', content: n.content || '', module: n.module?.slug || '', difficulty: n.difficulty?.slug || '' }) }
    }).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  const update = (key: string, val: any) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('タイトルは必須です'); return }
    setSaving(true); setError('')
    try {
      const res = isEdit ? await adminApi.updateNote(parseInt(id!), form) : await adminApi.createNote(form)
      if (res.success) router.push('/admin/notes')
      else setError(res.message || '保存に失敗しました')
    } catch (err: any) { setError(err?.message || '保存中にエラーが発生しました') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="admin-page"><div className="admin-loading">読み込み中...</div></div>

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <div className="admin-crumb"><Link href="/admin/notes">ノート管理</Link><span className="sep"> › </span><span>{isEdit ? '編集' : '新規作成'}</span></div>
          <h1>{isEdit ? 'ノートを編集' : '新規ノート作成'}</h1>
        </div>
      </div>
      {error && <div className="admin-error">{error}</div>}
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-card">
          <div className="admin-form-group">
            <label className="admin-label">タイトル <span className="admin-required">*</span></label>
            <input type="text" className="admin-input" value={form.title} onChange={e => update('title', e.target.value)} placeholder="记事タイトル" required />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">抜粋</label>
            <textarea className="admin-input admin-textarea" value={form.excerpt} onChange={e => update('excerpt', e.target.value)} rows={2} placeholder="記事の簡単な説明" />
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">モジュール</label>
              <select className="admin-input" value={form.module} onChange={e => update('module', e.target.value)}>
                <option value="">選択してください</option>
                {SAP_MODULES.map((m: any) => <option key={m.slug} value={m.slug}>{m.name_ja || m.name}</option>)}
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">難易度</label>
              <select className="admin-input" value={form.difficulty} onChange={e => update('difficulty', e.target.value)}>
                <option value="">選択してください</option>
                {DIFFICULTIES.map(d => <option key={d.slug} value={d.slug}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <div className="admin-form-group">
            <label className="admin-label">本文</label>
            <HtmlEditor value={form.content} onChange={v => update('content', v)} placeholder="记事内容を入力..." />
          </div>
        </div>
        <div className="admin-form-actions">
          <Link href="/admin/notes" className="admin-btn">キャンセル</Link>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? '保存中...' : (isEdit ? '更新する' : '作成する')}
          </button>
        </div>
      </form>
    </div>
  )
}
