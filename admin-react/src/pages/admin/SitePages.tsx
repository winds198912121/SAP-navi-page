// ===========================================================
// SitePages — 固定ページ管理 /admin/pages
// ===========================================================

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import HtmlEditor from '../../components/admin/HtmlEditor'

interface SitePage {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  subtitle: string
  meta: string
  updated_at: string
}

const PAGE_SLUGS = ['about', 'team', 'privacy', 'terms']

export default function SitePages() {
  const [items, setItems] = useState<SitePage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editSubtitle, setEditSubtitle] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchPages = async () => {
    setLoading(true)
    const result: SitePage[] = []
    for (const slug of PAGE_SLUGS) {
      try {
        const { data } = await api.client.get('/pages', { params: { slug } })
        if (data.success && data.data) result.push(data.data)
      } catch {}
    }
    setItems(result)
    setLoading(false)
  }

  useEffect(() => { fetchPages() }, [])

  const openEditor = (p: SitePage) => {
    setEditSlug(p.slug)
    setEditTitle(p.title || p.slug)
    setEditContent(p.content || '')
    setEditSubtitle(p.subtitle || '')
  }

  const savePage = async () => {
    setSaving(true); setError('')
    try {
      const { data } = await api.client.post('/pages', {
        slug: editSlug, title: editTitle, content: editContent, subtitle: editSubtitle,
      })
      if (data.success) {
        // 新規作成の場合は items に追加、既存の場合は更新
        setItems(prev => {
          const exists = prev.find(p => p.slug === editSlug)
          if (exists) {
            return prev.map(p => p.slug === editSlug ? { ...p, title: editTitle, content: editContent, subtitle: editSubtitle, updated_at: new Date().toISOString() } : p)
          }
          // 新規追加
          return [...prev, { id: data.data?.id || 0, slug: editSlug, title: editTitle, content: editContent, excerpt: '', subtitle: editSubtitle, meta: '', updated_at: new Date().toISOString() }]
        })
        setEditSlug('')
      } else setError(data.message || '保存失敗')
    } catch { setError('保存失敗') }
    finally { setSaving(false) }
  }

  const pageLabels: Record<string, string> = {
    about: 'サイトについて', team: '執筆メンバー',
    privacy: 'プライバシーポリシー', terms: '利用規約',
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>固定ページ管理</h1>
          <p className="admin-page-desc">サイトの固定ページ内容を管理します</p>
        </div>
      </div>
      {error && <div className="admin-error">{error}</div>}

      {loading ? <div className="admin-loading">読み込み中...</div>
      : editSlug ? (
        <div className="admin-form">
          <div className="admin-form-card">
            <div className="admin-crumb" style={{ marginBottom: 12 }}>
              <span onClick={() => setEditSlug('')} style={{ cursor: 'pointer', color: 'var(--accent-deep)' }}>固定ページ管理</span>
              <span className="sep"> › </span><span>{pageLabels[editSlug] || editSlug}</span>
            </div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className="admin-btn" onClick={() => setEditSlug('')} style={{ fontSize: 12.5 }}>
                ← 一覧に戻る
              </button>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">タイトル</label>
              <input type="text" className="admin-input" value={editTitle} onChange={e => setEditTitle(e.target.value)} style={{ width: '100%' }} />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">サブタイトル</label>
              <input type="text" className="admin-input" value={editSubtitle} onChange={e => setEditSubtitle(e.target.value)} style={{ width: '100%' }} />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">本文</label>
              <HtmlEditor value={editContent} onChange={setEditContent} placeholder="ページ内容を入力..." />
            </div>
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn" onClick={() => setEditSlug('')}>キャンセル</button>
            <button className="admin-btn admin-btn-primary" onClick={savePage} disabled={saving}>
              {saving ? '保存中...' : '保存する'}
            </button>
          </div>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>スラッグ</th>
                <th>ページ名</th>
                <th>タイトル</th>
                <th>更新日</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {PAGE_SLUGS.map(slug => {
                const p = items.find(i => i.slug === slug)
                return (
                  <tr key={slug}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>/{slug}</td>
                    <td style={{ fontWeight: 600 }}>{pageLabels[slug] || slug}</td>
                    <td>{p?.title || '—'}</td>
                    <td className="admin-cell-date">{p?.updated_at ? new Date(p.updated_at).toLocaleDateString('ja-JP') : '未作成'}</td>
                    <td>
                      <button className="admin-btn admin-btn-sm" onClick={() => openEditor(p || { id: 0, slug, title: pageLabels[slug] || slug, content: '', excerpt: '', subtitle: '', meta: '', updated_at: '' })}>
                        編集
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
