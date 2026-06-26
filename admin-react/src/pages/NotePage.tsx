// ===========================================================
// NotePage — 记事詳細画面 /note/:id/:slug
// SEO最適化 + 未ログインユーザーは一部のみ表示
// ===========================================================

import { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Seo from '../components/layout/Seo'
import SiteHeader from '../components/layout/Header'
import SiteFooter from '../components/layout/Footer'
import FloatingPanda from '../components/layout/FloatingPanda'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'
import { SAP_MODULES } from '../types'
import { scrollToHeading, throttle } from '../utils'

/** HTMLからh2/h3見出しを抽出 */
function extractToc(html: string): { id: string; label: string; level: number }[] {
  const toc: { id: string; label: string; level: number }[] = []
  const regex = /<h([23])(?:\s[^>]*)?>(.+?)<\/h\1>/gi
  let match: RegExpExecArray | null = null
  let index = 0
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1])
    const label = match[2].replace(/<[^>]+>/g, '').trim()
    if (label) {
      toc.push({ id: `note-heading-${index++}`, label, level })
    }
  }
  return toc
}

/** 本文の最初の30%を抽出 */
function truncateContent(html: string, pct = 30): string {
  const textLen = html.replace(/<[^>]+>/g, '').length
  if (textLen < 200) return html
  const blocks = html.split(/(?=<\/?(?:p|div|h[1-6]|section|ul|ol|table)[^>]*>)/i)
  let cumulative = 0
  const threshold = (textLen * pct) / 100
  const result: string[] = []
  for (const block of blocks) {
    const cleanLen = block.replace(/<[^>]+>/g, '').length
    cumulative += cleanLen
    if (cumulative > threshold) break
    result.push(block)
  }
  return result.join('')
}

/** JSON-LD */
function noteJsonLd(note: any): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: note.title,
    description: note.excerpt || `${note.title} — SAP Panda Academy 记事`,
    datePublished: note.created_at,
    author: { '@type': 'Person', name: note.author?.display_name || 'パンダ先生' },
    provider: { '@type': 'Organization', name: 'SAP Panda Academy' },
  })
}

export default function NotePage() {
  const { id, slug } = useParams()
  const navigate = useNavigate()
  const [note, setNote] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeToc, setActiveToc] = useState('')
  const { settings } = useTheme()
  const { user } = useAuth()
  const isLoggedIn = !!user
  const isAdmin = user?.roles?.includes('administrator')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.getNote(parseInt(id)).then(res => {
      if (res.success && res.data) {
        const n = res.data
        if (!slug && n.slug) {
          navigate(`/note/${id}/${n.slug}`, { replace: true })
        }
        setNote(n)
      }
    }).catch(() => {}).finally(() => setLoading(false))
  }, [id, slug, navigate])

  const fullContent = note?.content || ''
  const isRestricted = !isLoggedIn && !isAdmin
  const displayContent = isRestricted ? truncateContent(fullContent, 30) : fullContent
  const tocItems = useMemo(() => extractToc(fullContent), [fullContent])

  const contentWithIds = useMemo(() => {
    let idx = 0
    return displayContent.replace(/<h([23])(\s[^>]*)?>/gi, (_m: string, level: string, attrs: string) => {
      const id = `note-heading-${idx++}`
      return `<h${level}${attrs || ''} id="${id}">`
    })
  }, [displayContent])

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

  const activeModule = SAP_MODULES.find(m => m.slug === note?.module?.slug)
  const modColor = activeModule?.color || '#5a9d6e'
  const modName = note?.module?.name || activeModule?.name_ja || ''
  const modSlug = note?.module?.slug || ''
  const pageUrl = id && note?.slug ? `/note/${id}/${note.slug}` : `/note/${id}`

  if (loading) return (
    <><Seo title="记事を読み込み中" path={`/note/${id}`} /><div className="page-bg" /><SiteHeader />
    <main style={{ textAlign: 'center', padding: 80, color: 'var(--ink-3)' }}>読み込み中...</main>
    <SiteFooter /></>
  )

  if (!note) return (
    <><Seo title="记事が見つかりません" description="お探しの記事は存在しないか、削除されました。" path={`/note/${id}`} /><div className="page-bg" /><SiteHeader />
    <main style={{ textAlign: 'center', padding: 80 }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink-0)' }}>记事が見つかりません</h2>
      <p style={{ color: 'var(--ink-2)', margin: '12px 0 24px' }}>お探しの記事は存在しないか、移動した可能性があります。</p>
      <Link to="/" className="btn accent" style={{ textDecoration: 'none' }}>ホームに戻る</Link>
    </main>
    <SiteFooter /></>
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: noteJsonLd(note) }} />
      <Seo
        title={`${note.title} — SAP记事`}
        description={note.excerpt || `SAP 记事「${note.title}」。`}
        path={pageUrl}
        type="article"
        publishedTime={note.created_at}
        author={note.author?.display_name || 'パンダ先生'}
        breadcrumbs={[
          { name: 'ホーム', path: '/' },
          ...(modSlug ? [{ name: modName, path: `/category/${modSlug}` }] : []),
          { name: note.title, path: pageUrl },
        ]}
      />
      <div className="page-bg" /><SiteHeader />
      <main style={{ position: 'relative', zIndex: 2 }}>
        <section className="cat-hero">
          <div className="cat-hero-wrap" style={{ gridTemplateColumns: '1fr' }}>
            <div>
              <div className="crumb">
                <Link to="/">ホーム</Link>
                {modSlug && <><span className="sep">›</span>
                  <Link to={`/category/${modSlug}`} style={{ color: 'var(--ink-2)' }}>{modName}</Link></>}
                <span className="sep">›</span>
                <span className="now">{note.title}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, marginBottom: 6, flexWrap: 'wrap' }}>
                {modSlug && <span className={`tag-mod ${modSlug}`}>{modSlug.toUpperCase()}</span>}
                {note.difficulty && (
                  <span className={`tag-diff l${note.difficulty.slug === 'beginner' ? 1 : note.difficulty.slug === 'intermediate' ? 2 : 3}`}>
                    {note.difficulty.name || (note.difficulty.slug === 'beginner' ? '初級' : '中級')}
                  </span>
                )}
                <span style={{ color: 'var(--ink-3)' }}>📅 {new Date(note.created_at).toLocaleDateString('ja-JP')}</span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(24px, 2.5vw, 32px)', color: 'var(--ink-0)', margin: '0 0 8px' }}>{note.title}</h1>
              {note.excerpt && <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.8, maxWidth: 600 }}>{note.excerpt}</p>}
            </div>
          </div>
        </section>

        <div className="art-body-wrap" style={{ gridTemplateColumns: '1fr 220px' }}>
          <div className="art-content" style={{ minHeight: 200 }}>
            {displayContent ? (
              <div dangerouslySetInnerHTML={{ __html: contentWithIds }} />
            ) : (
              <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
                <p>コンテンツは準備中です。</p>
              </div>
            )}

            {isRestricted && (
              <div style={{
                marginTop: 32, padding: '32px 24px', textAlign: 'center',
                background: 'linear-gradient(135deg, var(--accent-soft) 0%, var(--bg-1) 100%)',
                borderRadius: 'var(--r-lg)', border: '1.5px solid var(--accent-line)',
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🐼</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink-0)', margin: '0 0 8px' }}>
                  続きを読むにはログインが必要です
                </h3>
                <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: '0 0 20px', lineHeight: 1.7 }}>
                  この記事の残り内容を表示するには、アカウントにログインしてください。
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <Link to="/login" className="btn accent" style={{ textDecoration: 'none' }}>ログイン</Link>
                  <Link to="/register" className="btn" style={{ textDecoration: 'none' }}>新規登録</Link>
                </div>
              </div>
            )}

            {/* References */}
            {note.references && note.references.length > 0 && (
              <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1.5px dashed var(--line-2)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--ink-0)', margin: '0 0 12px' }}>🔗 参考リンク</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {note.references.map((r: any, i: number) => (
                    <li key={i}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 'var(--r-md)', background: 'var(--bg-card)', border: '1px solid var(--line-1)', textDecoration: 'none', fontSize: 13, color: 'var(--accent-deep)' }}>
                        <span>🔗</span><span>{r.label || r.url}</span>
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
                <div>📅 {new Date(note.created_at).toLocaleDateString('ja-JP')}</div>
                {note.updated_at && <div>🔄 {new Date(note.updated_at).toLocaleDateString('ja-JP')}</div>}
                {note.author?.display_name && <div>✍️ {note.author.display_name}</div>}
              </div>
            </div>
            {isAdmin && (
              <div className="toc-card">
                <h5>⚙ 管理</h5>
                <Link to={`/admin/notes/${note.id}/edit`} className="btn sm" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', fontSize: 11.5 }}>
                  この記事を編集
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
