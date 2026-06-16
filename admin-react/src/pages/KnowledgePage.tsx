// ===========================================================
// KnowledgePage — ナレッジ詳細画面 /knowledge/:id
// ===========================================================

import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import Seo from '../components/layout/Seo'
import SiteHeader from '../components/layout/Header'
import SiteFooter from '../components/layout/Footer'
import FloatingPanda from '../components/layout/FloatingPanda'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'
import { SAP_MODULES } from '../types'
import type { SapKnowledge } from '../types'
import { scrollToHeading, throttle } from '../utils'

/** HTMLからh2/h3見出しを抽出して目次を生成 */
function extractToc(html: string): { id: string; label: string; level: number }[] {
  const toc: { id: string; label: string; level: number }[] = []
  const regex = /<h([23])(?:\s[^>]*)?>(.+?)<\/h\1>/gi
  let match: RegExpExecArray | null = null
  let index = 0
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1])
    const label = match[2].replace(/<[^>]+>/g, '').trim()
    if (label) {
      const id = `knowledge-heading-${index++}`
      toc.push({ id, label, level })
    }
  }
  return toc
}

export default function KnowledgePage() {
  const { id } = useParams()
  const [knowledge, setKnowledge] = useState<SapKnowledge | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeToc, setActiveToc] = useState('')
  const { settings } = useTheme()
  const { user } = useAuth()
  const isAdmin = user?.roles?.includes('administrator')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.getKnowledge(parseInt(id)).then(res => {
      if (res.success) setKnowledge(res.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  const htmlContent = knowledge?.content || ''
  const tocItems = useMemo(() => extractToc(htmlContent), [htmlContent])

  // inject id into h2/h3 tags in content
  const contentWithIds = useMemo(() => {
    let idx = 0
    return htmlContent.replace(/<h([23])(\s[^>]*)?>/gi, (_m: string, level: string, attrs: string) => {
      const id = `knowledge-heading-${idx++}`
      return `<h${level}${attrs || ''} id="${id}">`
    })
  }, [htmlContent])

  // scroll tracking for TOC（getBoundingClientRect で絶対位置を計算）
  useEffect(() => {
    if (tocItems.length === 0) return
    const onScroll = throttle(() => {
      const viewTop = window.scrollY + 160
      let active = tocItems[0].id
      for (const t of tocItems) {
        const el = document.getElementById(t.id)
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY
          if (top <= viewTop) active = t.id
        }
      }
      setActiveToc(active)
    }, 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [tocItems])

  const activeModule = SAP_MODULES.find(m => m.slug === knowledge?.module?.slug)
  const color = knowledge?.module?.slug
    ? (activeModule?.color || '#5a9d6e')
    : '#5a9d6e'
  const kTitle = knowledge?.title || ''
  const kExcerpt = knowledge?.excerpt || ''

  if (loading) return (
    <><Seo title="ナレッジ詳細" description="SAP ナレッジベースの記事を読み込み中。" path={`/knowledge/${id}`} /><div className="page-bg" /><SiteHeader />
    <main style={{ textAlign: 'center', padding: 80, color: 'var(--ink-3)' }}>読み込み中...</main>
    <SiteFooter /></>
  )

  if (!knowledge) return (
    <><Seo title="ナレッジが見つかりません" description="お探しのナレッジ記事は存在しないか、削除されました。" path={`/knowledge/${id}`} /><div className="page-bg" /><SiteHeader />
    <main style={{ textAlign: 'center', padding: 80 }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🎋</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink-0)' }}>ナレッジが見つかりません</h2>
      <Link to="/modules" className="btn" style={{ marginTop: 20, display: 'inline-flex', textDecoration: 'none' }}>モジュール一覧に戻る</Link>
    </main>
    <SiteFooter /></>
  )

  const modName = knowledge.module?.name || activeModule?.name_ja || ''
  const modSlug = knowledge.module?.slug || ''
  const typeLabel = knowledge.type === 'tips' ? '💡 TIPS'
    : knowledge.type === 'faq' ? '❓ FAQ'
    : knowledge.type === 'glossary' ? '📖 用語'
    : knowledge.type || ''

  return (
    <>
      <Seo
        title={`${kTitle} — SAPナレッジ`}
        description={kExcerpt || `SAP ナレッジ「${kTitle}」。${modName}分野の SAP 知識をわかりやすく解説。`}
        path={`/knowledge/${id}`}
        type="article"
        breadcrumbs={[
          { name: 'ホーム', path: '/' },
          { name: 'モジュール', path: '/modules' },
          ...(modSlug ? [{ name: modName, path: `/category/${modSlug}` }] : []),
          { name: kTitle, path: `/knowledge/${id}` },
        ]}
      />
      <div className="page-bg" /><SiteHeader />
      <main style={{ position: 'relative', zIndex: 2 }}>
        {/* Hero */}
        <section className="cat-hero">
          <div className="cat-hero-wrap">
            <div>
              <div className="crumb">
                <Link to="/">ホーム</Link>
                <span className="sep">›</span>
                <Link to="/modules">モジュール</Link>
                {modSlug && <><span className="sep">›</span>
                  <Link to={`/category/${modSlug}`} style={{ color: 'var(--ink-2)' }}>{modName}</Link></>}
                <span className="sep">›</span>
                <span className="now">{knowledge.title}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, marginBottom: 6, flexWrap: 'wrap' }}>
                {modSlug && <span className={`tag-mod ${modSlug}`}>{modSlug.toUpperCase()}</span>}
                {typeLabel && <span style={{ fontSize: 10.5, padding: '2px 7px', borderRadius: 4, background: 'var(--bg-tint)', color: 'var(--ink-2)', fontWeight: 600 }}>{typeLabel}</span>}
                {knowledge.difficulty && (
                  <span className={`tag-diff l${knowledge.difficulty.slug === 'beginner' ? 1 : knowledge.difficulty.slug === 'intermediate' ? 2 : 3}`}>
                    {knowledge.difficulty.name || (knowledge.difficulty.slug === 'beginner' ? '初級' : knowledge.difficulty.slug === 'intermediate' ? '中級' : '上級')}
                  </span>
                )}
                <span style={{ color: 'var(--ink-3)' }}>📅 {new Date(knowledge.created_at).toLocaleDateString('ja-JP')}</span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(26px, 3vw, 36px)', color: 'var(--ink-0)', margin: '0 0 8px' }}>{knowledge.title}</h1>
              {knowledge.excerpt && <p style={{ fontSize: 14.5, color: 'var(--ink-2)', lineHeight: 1.8, maxWidth: 600 }}>{knowledge.excerpt}</p>}
            </div>
            <div className="cat-mascot">
              <svg viewBox="-4 -8 108 128" width="180" height="200">
                <path d="M 22 40 L 50 24 L 78 40 L 50 56 Z" fill="#2a2317" />
                <path d="M 20 42 L 20 50 Q 50 66 80 50 L 80 42" fill="none" stroke="#2a2317" strokeWidth="2.5" />
                <rect x="44" y="55" width="12" height="8" rx="2" fill="#d97548" />
                <line x1="50" y1="63" x2="50" y2="70" stroke="#d97548" strokeWidth="2" strokeLinecap="round" />
                <circle cx="50" cy="52" r="46" fill="#fdfaf2" />
                <ellipse cx="22" cy="18" rx="13" ry="12" fill="#1a1612" />
                <ellipse cx="78" cy="18" rx="13" ry="12" fill="#1a1612" />
                <path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" />
                <path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" />
                <circle cx="30" cy="44" r="3.4" fill="#fff" /><circle cx="30" cy="44" r="2.4" fill="#0e0a05" />
                <circle cx="70" cy="44" r="3.4" fill="#fff" /><circle cx="70" cy="44" r="2.4" fill="#0e0a05" />
                <ellipse cx="18" cy="64" rx="5.5" ry="3" fill="#f4b8c4" opacity="0.7" />
                <ellipse cx="82" cy="64" rx="5.5" ry="3" fill="#f4b8c4" opacity="0.7" />
                <ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" />
                <path d="M 50 64 L 50 67" stroke="#1a1612" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M 43 70 Q 50 74 57 70" fill="none" stroke="#1a1612" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="art-body-wrap" style={{ gridTemplateColumns: '1fr 220px' }}>
          <div className="art-content" style={{ minHeight: 200 }}>
            {htmlContent ? (
              <div dangerouslySetInnerHTML={{ __html: contentWithIds }} />
            ) : (
              <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎋</div>
                <p>コンテンツは準備中です。</p>
              </div>
            )}

            {/* References */}
            {knowledge.references && knowledge.references.length > 0 && (
              <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1.5px dashed var(--line-2)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--ink-0)', margin: '0 0 12px' }}>🔗 参考リンク</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {knowledge.references.map((r: any, i: number) => (
                    <li key={i}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 'var(--r-md)', background: 'var(--bg-card)', border: '1px solid var(--line-1)', textDecoration: 'none', fontSize: 13, color: 'var(--accent-deep)', transition: 'background .12s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-soft)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-card)'}>
                        <span>🔗</span>
                        <span>{r.label || r.url}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <aside className="art-side">
            {tocItems.length > 0 && (
              <div className="toc-card">
                <h5>📖 目次</h5>
                <ul className="toc-list">
                  {tocItems.map(t => (
                    <li key={t.id}>
                      <a href={`#${t.id}`}
                        className={activeToc === t.id ? 'active' : ''}
                        style={{ paddingLeft: t.level === 3 ? 22 : 10 }}
                        onClick={(e) => { e.preventDefault(); scrollToHeading(t.id); setActiveToc(t.id) }}>
                        {t.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="toc-card">
              <h5>📌 詳細</h5>
              <div style={{ fontSize: 13, color: 'var(--ink-1)', lineHeight: 1.8 }}>
                <div>📅 {new Date(knowledge.created_at).toLocaleDateString('ja-JP')}</div>
                {knowledge.updated_at && <div>🔄 {new Date(knowledge.updated_at).toLocaleDateString('ja-JP')}</div>}
                {typeLabel && <div>🏷️ {typeLabel}</div>}
              </div>
            </div>
            {modSlug && <div className="toc-card">
              <h5>📂 モジュール</h5>
              <Link to={`/category/${modSlug}`} style={{ fontSize: 13, color: 'var(--accent-deep)', textDecoration: 'none', display: 'block', padding: '4px 0' }}>
                ← {modName}に戻る
              </Link>
            </div>}
            {isAdmin && (
              <div className="toc-card">
                <h5>⚙ 管理</h5>
                <Link to={`/admin/knowledge/${knowledge.id}/edit`} className="btn sm" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', fontSize: 11.5 }}>
                  このナレッジを編集
                </Link>
              </div>
            )}
          </aside>
        </div>
      </main>
      <SiteFooter />
      {settings.showFloatingPanda && <FloatingPanda />}
    </>
  )
}
