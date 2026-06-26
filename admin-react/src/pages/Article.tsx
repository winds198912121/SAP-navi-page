import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import Seo from '../components/layout/Seo'
import SiteHeader from '../components/layout/Header'
import SiteFooter from '../components/layout/Footer'
import FloatingPanda from '../components/layout/FloatingPanda'
import { useTheme } from '../hooks/useTheme'
import { scrollToHeading, throttle } from '../utils'
import api from '../services/api'

const MODULE_COLORS: Record<string, string> = {
  fi: '#2f6d44', co: '#2641a1', mm: '#a25411', sd: '#b62a4a',
  pp: '#4828a8', hr: '#8a6212', abap: '#1f6f6f', basis: '#4a432d', s4: '#1864a3',
}

const MODULE_NAMES: Record<string, string> = {
  fi: 'FI · 財務会計', co: 'CO · 管理会計', mm: 'MM · 購買・在庫',
  sd: 'SD · 販売管理', pp: 'PP · 生産計画', hr: 'HR · 人事管理',
  abap: 'ABAP · 開発言語', basis: 'Basis · 基盤管理', s4: 'S/4 · S/4HANA',
}

function buildTOC(content: string): { id: string; label: string }[] {
  const ids: { id: string; label: string }[] = []
  const re = /<h([23])[^>]*id=["']([^"']+)["'][^>]*>([^<]+)<\/h[23]>/gi
  let m
  while ((m = re.exec(content)) !== null) {
    ids.push({ id: m[2], label: m[3].replace(/&\w+;/g, '') })
  }
  // Fallback: auto-generate from h2-only
  if (ids.length === 0) {
    const h2re = /<h2[^>]*>([^<]+)<\/h2>/gi
    let i = 0
    while ((m = h2re.exec(content)) !== null) {
      ids.push({ id: `s${++i}`, label: m[1].replace(/&\w+;/g, '') })
    }
  }
  return ids
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

function estimateReadingTime(content: string): number {
  const text = content.replace(/<[^>]+>/g, '').trim()
  const jp = (text.match(/[぀-ゟ゠-ヿ一-鿿]/g) || []).length
  const other = text.replace(/[぀-ゟ゠-ヿ一-鿿\s]/g, '').length
  return Math.max(1, Math.round((jp / 500 + other / 200)))
}

export default function ArticlePage() {
  const { id, slug } = useParams()
  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeToc, setActiveToc] = useState('')
  const { settings } = useTheme()
  const [showTweaks, setShowTweaks] = useState(false)

  // Fetch article by ID
  useEffect(() => {
    if (!id || !/^\d+$/.test(id)) {
      setNotFound(true)
      setLoading(false)
      return
    }
    setLoading(true)
    setNotFound(false)
    api.getArticle(parseInt(id, 10)).then(res => {
      if (res.success && res.data) {
        setArticle(res.data)
      } else {
        setNotFound(true)
      }
    }).catch(() => {
      setNotFound(true)
    }).finally(() => setLoading(false))
  }, [id])

  const content = article?.content || ''
  const TOC = useMemo(() => buildTOC(content), [content])
  const readingTime = article?.reading_time || estimateReadingTime(content)
  const modSlug = article?.modules?.[0]?.slug || 'fi'
  const modColor = MODULE_COLORS[modSlug] || '#5a9d6e'
  const topicLabel = article?.topic?.name || ''
  const diffLabel = article?.difficulty?.slug === 'beginner' ? '初級'
    : article?.difficulty?.slug === 'intermediate' ? '中級'
    : article?.difficulty?.slug === 'advanced' ? '上級' : ''
  const diffLevel = article?.difficulty?.slug === 'beginner' ? 1
    : article?.difficulty?.slug === 'intermediate' ? 2
    : article?.difficulty?.slug === 'advanced' ? 3 : 0

  // Scroll-spy for TOC
  useEffect(() => {
    if (TOC.length === 0) return
    const onScroll = throttle(() => {
      const viewTop = window.scrollY + 160
      let active = TOC[0]?.id || ''
      for (const t of TOC) {
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
  }, [TOC])

  // Loading state
  if (loading) {
    return (
      <>
        <div className="page-bg" />
        <SiteHeader active="modules" />
        <div style={{ textAlign: 'center', padding: '120px 20px', color: 'var(--ink-3)' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🐼</div>
          <div>読み込み中...</div>
        </div>
        <SiteFooter />
        {settings.showFloatingPanda && <FloatingPanda />}
      </>
    )
  }

  // Not found state
  if (notFound || !article) {
    return (
      <>
        <div className="page-bg" />
        <SiteHeader active="modules" />
        <div style={{ textAlign: 'center', padding: '120px 20px' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-0)' }}>記事が見つかりませんでした</h2>
          <p style={{ color: 'var(--ink-2)', margin: '12px 0 24px' }}>
            お探しの記事は存在しないか、移動した可能性があります。
          </p>
          <Link to="/" className="btn accent" style={{ textDecoration: 'none' }}>
            ホームに戻る
          </Link>
        </div>
        <SiteFooter />
        {settings.showFloatingPanda && <FloatingPanda />}
      </>
    )
  }

  const articleTitle = article.title || ''
  const articleExcerpt = article.excerpt || ''
  const articleDate = formatDate(article.created_at || article.createdAt || '')
  const modName = MODULE_NAMES[modSlug] || article?.modules?.[0]?.name || ''
  const authorName = article.author?.display_name || article.author?.displayName || 'パンダ先生'

  return (
    <>
      <Seo
        title={articleTitle}
        description={articleExcerpt || articleTitle}
        path={id && slug ? `/article/${id}/${slug}` : '/article'}
        type="article"
        publishedTime={article.created_at || article.createdAt}
        author={authorName}
        breadcrumbs={[
          { name: 'ホーム', path: '/' },
          { name: modName || 'モジュール', path: `/category/${modSlug}` },
          { name: articleTitle, path: id && slug ? `/article/${id}/${slug}` : '/article' },
        ]}
      />
      <div className="page-bg" />
      <SiteHeader active="modules" />

      <article className="art-hero">
        <div className="crumb">
          <Link to="/">ホーム</Link>
          <span className="sep">›</span>
          <Link to={`/category/${modSlug}`}>{modName}</Link>
          <span className="sep">›</span>
          <span className="now">{articleTitle}</span>
        </div>
        <div className="meta-top" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontSize: 12.5, marginBottom: 16 }}>
          <span className={`tag-mod ${modSlug}`}>{modSlug.toUpperCase()}</span>
          {diffLevel > 0 && <span className={`tag-diff l${diffLevel}`}>{diffLabel}</span>}
          {topicLabel && <span style={{ color: 'var(--ink-3)' }}>· {topicLabel}</span>}
          {articleDate && <span style={{ color: 'var(--ink-3)' }}>· {articleDate}</span>}
          <span style={{ color: 'var(--ink-3)' }}>· {readingTime} min read</span>
        </div>
        <h1>{articleTitle}</h1>
        {articleExcerpt && <p className="lead">{articleExcerpt}</p>}
        <div className="art-hero-cover">
          <svg viewBox="0 0 720 320" style={{ width: '100%', height: '100%' }}>
            <rect width="720" height="320" fill={modColor + '22'} />
            <text x="360" y="160" textAnchor="middle" fontSize="48" fontWeight="700" fill={modColor} fontFamily="Zen Maru Gothic">
              {modSlug.toUpperCase()} · {modName.split('·')[1]?.trim() || modName}
            </text>
          </svg>
        </div>
      </article>

      <div className="art-body-wrap">
        <div className="art-content">
          <div dangerouslySetInnerHTML={{ __html: content }} />

          {/* Feedback */}
          <div style={{ marginTop: 48 }}>
            <div style={{
              padding: '24px 26px', background: 'var(--bg-card)',
              borderRadius: 'var(--r-lg)', border: '1px solid var(--line-2)',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <svg width="56" height="56" viewBox="-4 -8 108 108">
                <circle cx="50" cy="52" r="46" fill="#e8f0fb" opacity="0.4" />
                <path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" />
                <g>
                  <path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" />
                  <path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" />
                </g>
                <circle cx="30" cy="44" r="3.4" fill="#fff" /><circle cx="30" cy="44" r="2.4" fill="#0e0a05" />
                <circle cx="70" cy="44" r="3.4" fill="#fff" /><circle cx="70" cy="44" r="2.4" fill="#0e0a05" />
                <ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" />
                <path d="M 42 68 Q 50 78 58 68" fill="#1a1612" />
              </svg>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--ink-0)', marginBottom: 2 }}>この記事、役に立った？</div>
                <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>反応をくれると、パンダ先生のやる気が +100 します。</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {['👍', '❤', '🎋', '🙏'].map(e => (
                  <button key={e} type="button"
                    style={{ width: 44, height: 44, borderRadius: '50%', border: '1.5px solid var(--line-2)', background: 'var(--bg-1)', fontSize: 20, cursor: 'pointer' }}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: 目次 + 関連記事 */}
        <aside className="art-side">
          {TOC.length > 0 && (
            <div className="toc-card">
              <h5>目次</h5>
              <ul className="toc-list">
                {TOC.map(t => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className={activeToc === t.id ? 'active' : ''}
                      onClick={(e) => { e.preventDefault(); scrollToHeading(t.id) }}>
                      {t.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {article.related_articles && article.related_articles.length > 0 && (
            <div className="toc-card">
              <h5>📚 関連記事</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {article.related_articles.slice(0, 4).map((ra: any) => (
                  <Link key={ra.id} to={`/article/${ra.id}/${ra.slug}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                      background: 'var(--bg-1)', borderRadius: 'var(--r-md)',
                      textDecoration: 'none', fontSize: 13,
                      transition: 'all .15s',
                    }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 6, background: modColor + '22',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 11, color: modColor, flexShrink: 0,
                    }}>
                      {modSlug.toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: 'var(--ink-0)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ra.title}
                      </div>
                    </div>
                    <span style={{ color: 'var(--ink-3)', fontSize: 14, flexShrink: 0 }}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      <SiteFooter />
      {settings.showFloatingPanda && <FloatingPanda />}
    </>
  )
}
