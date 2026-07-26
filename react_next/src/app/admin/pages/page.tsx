'use client'
import { useState, useEffect } from 'react'
import { adminApi } from '@/lib/admin-api'
import HtmlEditor from '@/components/admin/HtmlEditor'

export default function AdminSitePages() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Modal state: create / edit
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchPages = () => {
    setLoading(true); setError('')
    adminApi.getPages().then(r => {
      if (r.success) setItems(r.data || [])
      else setError(r.message || 'データの取得に失敗しました')
    }).catch(() => setError('ネットワークエラー')).finally(() => setLoading(false))
  }

  useEffect(() => { fetchPages() }, [])

  // モーダルを開く（新規）
  const openCreate = () => {
    setEditId(null); setSlug(''); setTitle(''); setContent(''); setSubtitle('')
    setSaveError(''); setSaveSuccess(''); setShowModal(true)
  }

  // モーダルを開く（編集）
  const openEdit = (p: any) => {
    setEditId(p.id); setSlug(p.slug || ''); setTitle(p.title || '')
    setContent(p.content || '')
    setSubtitle(p.subtitle || '')
    setSaveError(''); setSaveSuccess(''); setShowModal(true)
  }

  const closeModal = () => { setShowModal(false); setEditId(null) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !slug) { setSaveError('タイトルとスラッグは必須です'); return }
    setSaving(true); setSaveError(''); setSaveSuccess('')
    try {
      let res
      if (editId) {
        res = await adminApi.updatePage(editId, { title, slug, content, subtitle })
      } else {
        res = await adminApi.createPage({ title, slug, content, subtitle })
      }
      if (res.success) {
        setSaveSuccess(editId ? '保存しました' : '作成しました')
        fetchPages()
        setTimeout(() => closeModal(), 800)
      } else {
        setSaveError(res.message || '保存に失敗しました')
      }
    } catch {
      setSaveError('保存に失敗しました')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    const res = await adminApi.deletePage(deleteTarget.id)
    setDeleting(false)
    if (res.success) {
      setDeleteTarget(null)
      fetchPages()
    } else {
      alert(res.message || '削除に失敗しました')
    }
  }

  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '')

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>📄 固定ページ管理</h1>
          <p className="admin-page-desc">全 {items.length} 件</p>
        </div>
        <button className="btn sm accent" onClick={openCreate}
          style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
          ＋ 新規作成
        </button>
      </div>

      {/* Loading / Error / Empty */}
      {loading ? (
        <div className="admin-loading">読み込み中...</div>
      ) : error ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">⚠️</div>
          <p>{error}</p>
          <button className="btn sm" onClick={fetchPages}>再読み込み</button>
        </div>
      ) : items.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">📄</div>
          <p>固定ページがありません</p>
          <button className="btn sm accent" onClick={openCreate}>新規作成</button>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>タイトル</th>
                <th>スラッグ</th>
                <th>内容</th>
                <th>更新日</th>
                <th style={{ width: 120 }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p: any, i: number) => (
                <tr key={p.id || p.slug || i}>
                  <td className="admin-cell-title">{p.title || '—'}</td>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--ink-2)' }}>{p.slug || '—'}</td>
                  <td style={{ fontSize: 12, color: 'var(--ink-3)', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {stripHtml(p.excerpt || p.content || '').substring(0, 60)}
                  </td>
                  <td className="admin-cell-date">{p.updated_at?.slice(0, 10) || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn sm ghost" onClick={() => openEdit(p)}
                        style={{ fontSize: 11, padding: '4px 10px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', background: 'var(--bg-tint)', borderRadius: 'var(--r-sm)', color: 'var(--ink-0)' }}>
                        編集
                      </button>
                      <button className="btn sm ghost" onClick={() => setDeleteTarget(p)}
                        style={{ fontSize: 11, padding: '4px 10px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', background: 'var(--rose-soft)', borderRadius: 'var(--r-sm)', color: 'var(--rose)' }}>
                        削除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="case-modal-overlay" onClick={closeModal}>
          <div className="case-modal" style={{ maxWidth: 600, padding: 0, overflow: 'hidden' }}
            onClick={e => e.stopPropagation()}>
            <button className="case-modal-x" onClick={closeModal}
              style={{ position: 'absolute', top: 16, right: 20, fontSize: 28, background: 'none', border: 'none', color: 'var(--ink-3)', cursor: 'pointer', lineHeight: 1, zIndex: 10 }}>×</button>
            <div style={{ padding: '28px 32px', maxHeight: '80vh', overflowY: 'auto' }}>
              <h2 style={{ fontFamily: "'Zen Maru Gothic', system-ui, sans-serif", fontSize: 20, color: 'var(--ink-0)', margin: '0 0 20px' }}>
                {editId ? '固定ページを編集' : '新規固定ページ'}
              </h2>

              {saveError && (
                <div style={{ background: 'var(--rose-soft)', color: 'var(--rose)', padding: '10px 14px', borderRadius: 'var(--r-md)', fontSize: 13, marginBottom: 16 }}>{saveError}</div>
              )}
              {saveSuccess && (
                <div style={{ background: 'var(--accent-soft)', color: 'var(--accent-deep)', padding: '10px 14px', borderRadius: 'var(--r-md)', fontSize: 13, marginBottom: 16 }}>{saveSuccess}</div>
              )}

              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-0)' }}>タイトル *</span>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                    placeholder="ページタイトル" style={{
                      padding: '10px 14px', border: '1.5px solid var(--line-2)', borderRadius: 'var(--r-md)', fontSize: 14, outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box'
                    }} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-0)' }}>スラッグ *</span>
                  <input type="text" value={slug} onChange={e => setSlug(e.target.value)}
                    placeholder="page-slug" style={{
                      padding: '10px 14px', border: '1.5px solid var(--line-2)', borderRadius: 'var(--r-md)', fontSize: 14, outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box'
                    }} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-0)' }}>サブタイトル</span>
                  <input type="text" value={subtitle} onChange={e => setSubtitle(e.target.value)}
                    placeholder="ページのサブタイトル（省略可）" style={{
                      padding: '10px 14px', border: '1.5px solid var(--line-2)', borderRadius: 'var(--r-md)', fontSize: 14, outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box'
                    }} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-0)' }}>本文</span>
                  <HtmlEditor value={content} onChange={setContent} placeholder="固定ページの内容を入力..." />
                </label>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                  <button type="button" className="btn sm ghost" onClick={closeModal}>キャンセル</button>
                  <button type="submit" className="btn sm accent" disabled={saving}
                    style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                    {saving ? '保存中...' : editId ? '更新する' : '作成する'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="case-modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="case-modal" style={{ maxWidth: 420, padding: '28px 32px' }}
            onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "'Zen Maru Gothic', system-ui, sans-serif", fontSize: 18, color: 'var(--ink-0)', margin: '0 0 8px' }}>削除の確認</h3>
            <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: '0 0 20px', lineHeight: 1.6 }}>
              固定ページ「<strong>{deleteTarget.title}</strong>」を削除しますか？
              <br />この操作は元に戻せません。
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn sm ghost" onClick={() => setDeleteTarget(null)}>キャンセル</button>
              <button className="btn sm" disabled={deleting}
                onClick={handleDelete}
                style={{ background: 'var(--rose)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 'var(--r-pill)', padding: '7px 18px', fontSize: 12.5, fontWeight: 600 }}>
                {deleting ? '削除中...' : '削除する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
