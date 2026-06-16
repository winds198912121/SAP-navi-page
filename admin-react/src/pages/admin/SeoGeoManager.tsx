// ===========================================================
// SeoGeoManager — SEO & GEO 設定管理ダッシュボード
// SEO: サイトメタ情報、OG画像、GA4、robots.txt
// GEO: 組織スキーマ、FAQ構造化データ、AI最適化
// ===========================================================
import { useState, useEffect, useCallback } from 'react'
import api from '../../services/api'

type TabType = 'seo' | 'geo' | 'faq' | 'keywords'

export default function SeoGeoManager() {
  const [tab, setTab] = useState<TabType>('seo')
  const [settings, setSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [faqs, setFaqs] = useState<any[]>([])
  const [keywords, setKeywords] = useState<string[]>([])
  const [newKeyword, setNewKeyword] = useState('')
  const [faqForm, setFaqForm] = useState({ question: '', answer: '' })
  const [editingFaq, setEditingFaq] = useState<number | null>(null)

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000) }

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const { data: s } = await api.client.get('/admin/seo-settings')
      if (s.success) setSettings(s.data)
      const { data: f } = await api.client.get('/admin/faq-schemas')
      if (f.success) setFaqs(f.data || [])
      const { data: k } = await api.client.get('/admin/seo-keywords')
      if (k.success) setKeywords(k.data || [])
    } catch (err: any) {
      setError(err?.response?.data?.message || 'データの取得に失敗しました')
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const saveSettings = async () => {
    setSaving(true); setError('')
    try {
      const { data } = await api.client.put('/admin/seo-settings', settings)
      if (data.success) showSuccess('SEO設定を保存しました')
      else setError(data.message || '保存に失敗しました')
    } catch (err: any) {
      setError(err?.response?.data?.message || '保存に失敗しました')
    } finally { setSaving(false) }
  }

  const addKeyword = async () => {
    if (!newKeyword.trim()) return
    try {
      const { data } = await api.client.post('/admin/seo-keywords', { keyword: newKeyword.trim() })
      if (data.success) { setKeywords(data.data); setNewKeyword(''); showSuccess('キーワードを追加しました') }
    } catch { setError('追加に失敗しました') }
  }

  const deleteKeyword = async (kw: string) => {
    try {
      const { data } = await api.client.delete('/admin/seo-keywords', { data: { keyword: kw } })
      if (data.success) setKeywords(data.data)
    } catch { setError('削除に失敗しました') }
  }

  const saveFaq = async () => {
    if (!faqForm.question.trim() || !faqForm.answer.trim()) return
    setSaving(true)
    try {
      if (editingFaq !== null) {
        const { data } = await api.client.put(`/admin/faq-schemas/${editingFaq}`, faqForm)
        if (data.success) { setFaqs(prev => prev.map(f => f.id === editingFaq ? { ...f, ...faqForm } : f)); showSuccess('FAQを更新しました') }
      } else {
        const { data } = await api.client.post('/admin/faq-schemas', faqForm)
        if (data.success) { setFaqs(data.data); showSuccess('FAQを追加しました') }
      }
      setFaqForm({ question: '', answer: '' }); setEditingFaq(null)
    } catch { setError('FAQの保存に失敗しました') }
    finally { setSaving(false) }
  }

  const deleteFaq = async (id: number) => {
    try {
      const { data } = await api.client.delete(`/admin/faq-schemas/${id}`)
      if (data.success) { setFaqs(prev => prev.filter(f => f.id !== id)); showSuccess('FAQを削除しました') }
    } catch { setError('削除に失敗しました') }
  }

  const editFaq = (item: any) => {
    setFaqForm({ question: item.question, answer: item.answer })
    setEditingFaq(item.id)
  }

  const inputStyle = {
    width: '100%', padding: '9px 14px', border: '1.5px solid rgba(60,45,20,0.15)',
    borderRadius: 10, fontFamily: 'inherit', fontSize: 13.5, outline: 'none',
    boxSizing: 'border-box' as const, background: 'white', color: '#2a2317',
  }
  const textareaStyle = { ...inputStyle, minHeight: 80, resize: 'vertical' as const, fontFamily: "'JetBrains Mono',monospace" }
  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 700, color: '#4a4030', marginBottom: 6 }

  if (loading) return <div className="admin-loading">SEO/GEO設定を読み込み中...</div>

  const tabs: { key: TabType; label: string; icon: string }[] = [
    { key: 'seo', label: 'SEO設定', icon: '🔍' },
    { key: 'geo', label: 'GEO設定', icon: '🤖' },
    { key: 'faq', label: 'FAQ構造化', icon: '❓' },
    { key: 'keywords', label: 'キーワード', icon: '🏷️' },
  ]

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>SEO / GEO 設定</h1>
          <p className="admin-page-desc">検索エンジンと生成AI向けのサイト最適化を管理します</p>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}
      {successMsg && <div className="admin-success" style={{ background: '#d8ead9', border: '1px solid rgba(90,157,110,0.3)', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: '#3e7a52', marginBottom: 16 }}>{successMsg}</div>}

      {/* タブ */}
      <div className="admin-search-bar">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`admin-btn admin-btn-sm ${tab === t.key ? 'admin-btn-primary' : ''}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ============ TAB: SEO ============ */}
      {tab === 'seo' && (
        <div className="admin-form">
          <div className="admin-form-card">
            <h3>🔍 基本SEO設定</h3>
            <div className="admin-form-group">
              <label className="admin-label">サイト名</label>
              <input className="admin-input" style={{ width: '100%' }} value={settings.site_name || ''} onChange={e => setSettings({ ...settings, site_name: e.target.value })} />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">サイト説明文（meta description）</label>
              <textarea className="admin-input admin-textarea" style={{ width: '100%', minHeight: 60 }} value={settings.site_description || ''} onChange={e => setSettings({ ...settings, site_description: e.target.value })} />
              <span style={{ fontSize: 11, color: '#7a6e58' }}>推奨: 120〜160文字 / 現在 {(settings.site_description || '').length}文字</span>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">デフォルトキーワード（カンマ区切り）</label>
              <input className="admin-input" style={{ width: '100%' }} value={settings.default_keywords || ''} onChange={e => setSettings({ ...settings, default_keywords: e.target.value })} />
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-label">OG画像URL</label>
                <input className="admin-input" style={{ width: '100%' }} value={settings.og_image || ''} onChange={e => setSettings({ ...settings, og_image: e.target.value })} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Twitterハンドル</label>
                <input className="admin-input" style={{ width: '100%' }} value={settings.twitter_handle || ''} onChange={e => setSettings({ ...settings, twitter_handle: e.target.value })} />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Google Analytics ID</label>
              <input className="admin-input" style={{ width: '100%' }} value={settings.google_analytics_id || ''} placeholder="例: G-XXXXXXXXXX" onChange={e => setSettings({ ...settings, google_analytics_id: e.target.value })} />
            </div>
          </div>

          <div className="admin-form-card">
            <h3>📄 robots.txt</h3>
            <div className="admin-form-group">
              <textarea className="admin-input admin-textarea-lg" style={{ width: '100%', minHeight: 180 }} value={settings.robots_txt || ''} onChange={e => setSettings({ ...settings, robots_txt: e.target.value })} />
            </div>
          </div>

          <div className="admin-form-actions">
            <button className="admin-btn admin-btn-primary" onClick={saveSettings} disabled={saving}>
              {saving ? '保存中...' : 'SEO設定を保存'}
            </button>
          </div>
        </div>
      )}

      {/* ============ TAB: GEO ============ */}
      {tab === 'geo' && (
        <div className="admin-form">
          <div className="admin-form-card">
            <h3>🤖 生成AI最適化 (GEO) 設定</h3>
            <p style={{ fontSize: 12.5, color: '#7a6e58', margin: '-8px 0 16px', lineHeight: 1.7 }}>
              ChatGPT / Gemini / Perplexity 等の生成AI検索向けにサイト情報を最適化します。
              構造化データを強化することで、AIの回答に引用される可能性が高まります。
            </p>
            <div className="admin-form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={!!settings.geo_enabled} onChange={e => setSettings({ ...settings, geo_enabled: e.target.checked })} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>GEO最適化を有効にする</span>
              </label>
            </div>
            <div className="admin-form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={!!settings.ai_optimization} onChange={e => setSettings({ ...settings, ai_optimization: e.target.checked })} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>AIフレンドリーなHTML構造を出力（見出し・リストの最適化）</span>
              </label>
            </div>
          </div>

          <div className="admin-form-card">
            <h3>🏢 組織情報（Organization Schema）</h3>
            <div className="admin-form-group">
              <label className="admin-label">組織名</label>
              <input className="admin-input" style={{ width: '100%' }} value={settings.organization_name || ''} onChange={e => setSettings({ ...settings, organization_name: e.target.value })} />
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-label">ロゴURL</label>
                <input className="admin-input" style={{ width: '100%' }} value={settings.organization_logo || ''} onChange={e => setSettings({ ...settings, organization_logo: e.target.value })} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">サイトURL</label>
                <input className="admin-input" style={{ width: '100%' }} value={settings.organization_url || ''} onChange={e => setSettings({ ...settings, organization_url: e.target.value })} />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">SNSリンク（カンマ区切り）</label>
              <input className="admin-input" style={{ width: '100%' }} placeholder="https://twitter.com/...,https://youtube.com/..." value={Array.isArray(settings.social_links) ? settings.social_links.join(',') : ''} onChange={e => setSettings({ ...settings, social_links: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })} />
            </div>
          </div>

          <div className="admin-form-actions">
            <button className="admin-btn admin-btn-primary" onClick={saveSettings} disabled={saving}>
              {saving ? '保存中...' : 'GEO設定を保存'}
            </button>
          </div>
        </div>
      )}

      {/* ============ TAB: FAQ Schema ============ */}
      {tab === 'faq' && (
        <div className="admin-form">
          <div className="admin-form-card">
            <h3>{editingFaq ? '✏️ FAQを編集' : '➕ FAQを追加'}</h3>
            <div className="admin-form-group">
              <label className="admin-label">質問</label>
              <input className="admin-input" style={{ width: '100%' }} value={faqForm.question} onChange={e => setFaqForm({ ...faqForm, question: e.target.value })} placeholder="例: SAPとは何ですか？" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">回答</label>
              <textarea className="admin-input admin-textarea" style={{ width: '100%', minHeight: 80 }} value={faqForm.answer} onChange={e => setFaqForm({ ...faqForm, answer: e.target.value })} placeholder="回答を入力..." />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={saveFaq} disabled={saving}>
                {saving ? '保存中...' : editingFaq ? '更新する' : '追加する'}
              </button>
              {editingFaq && <button className="admin-btn admin-btn-sm" onClick={() => { setEditingFaq(null); setFaqForm({ question: '', answer: '' }) }}>キャンセル</button>}
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th style={{ width: 40 }}>ID</th><th>質問</th><th>回答（プレビュー）</th><th style={{ width: 120 }}>操作</th></tr></thead>
              <tbody>
                {faqs.length === 0 ? (
                  <tr><td colSpan={4}><div className="admin-empty" style={{ padding: 20 }}>FAQがありません。上部フォームから追加してください。</div></td></tr>
                ) : faqs.map(faq => (
                  <tr key={faq.id}>
                    <td className="admin-cell-id">{faq.id}</td>
                    <td style={{ fontWeight: 600 }}>{faq.question}</td>
                    <td style={{ fontSize: 12, color: '#7a6e58', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{faq.answer.replace(/<[^>]+>/g, '')}</td>
                    <td>
                      <div className="admin-actions">
                        <button className="admin-btn admin-btn-sm" onClick={() => editFaq(faq)}>編集</button>
                        <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => deleteFaq(faq.id)}>削除</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {faqs.length > 0 && (
            <div style={{ fontSize: 12, color: '#7a6e58', marginTop: 8 }}>
              全 {faqs.length} 件のFAQ — サイトに埋め込むと FAQPage 構造化データとして認識されます
            </div>
          )}
        </div>
      )}

      {/* ============ TAB: Keywords ============ */}
      {tab === 'keywords' && (
        <div className="admin-form">
          <div className="admin-form-card">
            <h3>🏷️ トラッキングキーワード</h3>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input className="admin-input" style={{ flex: 1 }} value={newKeyword} onChange={e => setNewKeyword(e.target.value)}
                placeholder="新規キーワードを入力..." onKeyDown={e => e.key === 'Enter' && addKeyword()} />
              <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={addKeyword} disabled={!newKeyword.trim()}>追加</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
              {keywords.length === 0 ? (
                <span style={{ fontSize: 13, color: '#7a6e58' }}>キーワードが登録されていません</span>
              ) : keywords.map(kw => (
                <span key={kw} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px',
                  borderRadius: 999, background: '#e8f0fb', color: '#3b82f6', fontSize: 12, fontWeight: 600,
                }}>
                  {kw}
                  <span onClick={() => deleteKeyword(kw)} style={{ cursor: 'pointer', opacity: 0.6, fontSize: 14 }}>×</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
