'use client'
// ===========================================================
// ArticlePage — 記事詳細 /article/:id/:slug
// ===========================================================
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

const PUBLIC_API = '/wp-json/sap/v1'

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
  if (ids.length === 0) {
    const h2re = /<h2[^>]*>([^<]+)<\/h2>/gi
    let i = 0
    while ((m = h2re.exec(content)) !== null) {
      ids.push({ id: `s${++i}`, label: m[1].replace(/&\w+;/g, '') })
    }
  }
  return ids
}

function fmtDate(dateStr: string): string {
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
  const params = useParams()
  const id = params?.id as string | undefined
  const slug = params?.slug as string | undefined

  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeToc, setActiveToc] = useState('')

  useEffect(() => {
    if (!id || !/^\d+$/.test(id)) { setNotFound(true); setLoading(false); return }
    setLoading(true); setNotFound(false)
    fetch(`${PUBLIC_API}/articles/${parseInt(id, 10)}`).then(r => r.json()).then(d => {
      if (d.success && d.data) setArticle(d.data)
      else loadFallback()
    }).catch(() => loadFallback()).finally(() => setLoading(false))
  }, [id])

  function loadFallback() {
    const i = parseInt(id || '0')
    const demos: Record<number, any> = {
      1: {
        id: 1, title: '【保存版】SAP用語集 — はじめての100単語',
        excerpt: 'SAPに出てくる専門用語を100個厳選して解説。初心者から中級者まで、これ一冊でSAP用語はOK。',
        content: '<h2 id="s1">SAPとは</h2><p>SAP（エス・エー・ピー）とは、ドイツに本社を置くSAP SEが開発した統合基幹業務システム（ERP）です。世界で最も多くの企業に導入されているERPシステムとして知られています。</p><h2 id="s2">基本用語</h2><p><strong>ERP</strong>：Enterprise Resource Planning（統合基幹業務システム）の略。企業の経営資源を統合的に管理するシステム。</p><p><strong>モジュール</strong>：SAPは機能ごとに「モジュール」と呼ばれる単位で構成されています。FI（財務会計）、CO（管理会計）、MM（購買管理）、SD（販売管理）など。</p><h2 id="s3">GUIとT-Code</h2><p>SAPの操作は基本的に「SAP GUI」と呼ばれる専用クライアントソフトを使って行います。操作の多くは「T-Code」（トランザクションコード）と呼ばれるショートカットを使って効率的に行います。</p>',
        module: { slug: 'fi', name: '財務会計' },
        modules: [{ slug: 'fi', name: '財務会計' }],
        difficulty: { slug: 'beginner', name: '初級' },
        topic: { slug: 'glossary', name: '用語集' },
        reading_time: 15, views: 12500,
        author: { display_name: 'パンダ先生' },
        created_at: new Date().toISOString(),
        related_articles: [
          { id: 2, title: 'BAPI とは何か、なぜ使うのか — 5分で理解', slug: 'bapi-intro' },
          { id: 3, title: 'Fiori vs SAP GUI — 結局どう使い分ける？', slug: 'fiori-vs-gui' },
        ],
      },
      2: {
        id: 2, title: 'BAPI とは何か、なぜ使うのか — 5分で理解',
        excerpt: 'SAPの拡張開発でよく聞く「BAPI」。その正体と使い方を5分で解説します。',
        content: '<h2 id="s1">BAPIとは</h2><p>BAPI（Business Application Programming Interface）とは、SAPシステムのビジネス機能を外部から呼び出すための標準インターフェースです。</p>',
        module: { slug: 'abap', name: '開発言語' },
        modules: [{ slug: 'abap', name: '開発言語' }],
        difficulty: { slug: 'intermediate', name: '中級' },
        reading_time: 5, views: 8200,
        author: { display_name: 'パンダ先生' },
        created_at: new Date().toISOString(),
      },
      3: {
        id: 3, title: 'MMの移動タイプ、覚えるならこの10個',
        excerpt: '在庫移動で使う移動タイプを厳選して解説。実務で頻出の10個をマスターしよう。',
        content: '<h2 id="s1">移動タイプとは</h2><p>SAP MM（在庫管理）において「移動タイプ（Movement Type）」は、在庫の増減を管理するための3桁のコードです。</p>',
        module: { slug: 'mm', name: '購買・在庫' },
        modules: [{ slug: 'mm', name: '購買・在庫' }],
        difficulty: { slug: 'beginner', name: '初級' },
        reading_time: 8, views: 6100,
        author: { display_name: 'パンダ先生' },
        created_at: new Date().toISOString(),
      },
    }
    setArticle(demos[i] || demos[1])
  }

  const content = article?.content || ''
  const TOC = useMemo(() => buildTOC(content), [content])
  const readingTime = article?.reading_time || estimateReadingTime(content)
  const modSlug = article?.modules?.[0]?.slug || article?.module?.slug || 'fi'
  const modColor = MODULE_COLORS[modSlug] || '#5a9d6e'
  const topicLabel = article?.topic?.name || ''
  const diffLabel = article?.difficulty?.slug === 'beginner' ? '初級'
    : article?.difficulty?.slug === 'intermediate' ? '中級'
    : article?.difficulty?.slug === 'advanced' ? '上級' : ''
  const diffLevel = article?.difficulty?.slug === 'beginner' ? 1
    : article?.difficulty?.slug === 'intermediate' ? 2
    : article?.difficulty?.slug === 'advanced' ? 3 : 0

  const scrollToHeading = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  useEffect(() => {
    if (TOC.length === 0) return
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const viewTop = window.scrollY + 160
          let active = TOC[0]?.id || ''
          for (const t of TOC) {
            const el = document.getElementById(t.id)
            if (el) { const top = el.getBoundingClientRect().top + window.scrollY; if (top <= viewTop) active = t.id }
          }
          setActiveToc(active)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [TOC])

  if (loading) {
    return (
      <>
        <div className="page-bg" />
        <div style={{ textAlign: 'center', padding: '120px 20px', color: 'var(--ink-3)' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🐼</div>
          <div>読み込み中...</div>
        </div>
      </>
    )
  }

  if (notFound || !article) {
    return (
      <>
        <div className="page-bg" />
        <div style={{ textAlign: 'center', padding: '120px 20px' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
          <h2 style={{ fontFamily: "'Zen Maru Gothic', system-ui, sans-serif", color: 'var(--ink-0)' }}>記事が見つかりませんでした</h2>
          <p style={{ color: 'var(--ink-2)', margin: '12px 0 24px' }}>お探しの記事は存在しないか、移動した可能性があります。</p>
          <Link href="/" className="btn accent" style={{ textDecoration: 'none' }}>ホームに戻る</Link>
        </div>
      </>
    )
  }

  const articleTitle = article.title || ''
  const articleDate = fmtDate(article.created_at || article.createdAt || '')
  const modName = MODULE_NAMES[modSlug] || article?.modules?.[0]?.name || article?.module?.name || ''
  const authorName = article.author?.display_name || article.author?.displayName || 'パンダ先生'

  return (
    <>
      <div className="page-bg" />

      <article>
        <div className="art-hero">
          <div className="crumb">
            <Link href="/">ホーム</Link>
            <span className="sep">›</span>
            <Link href={`/category/${modSlug}`}>{modName}</Link>
            <span className="sep">›</span>
            <span className="now">{articleTitle}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontSize: 12.5, marginBottom: 16 }}>
            <span className={`tag-mod ${modSlug}`}>{modSlug.toUpperCase()}</span>
            {diffLevel > 0 && <span className={`tag-diff l${diffLevel}`}>{diffLabel}</span>}
            {topicLabel && <span style={{ color: 'var(--ink-3)' }}>· {topicLabel}</span>}
            {articleDate && <span style={{ color: 'var(--ink-3)' }}>· {articleDate}</span>}
            <span style={{ color: 'var(--ink-3)' }}>· {readingTime} min read</span>
          </div>
          <h1>{articleTitle}</h1>
          {article.excerpt && <p className="lead">{article.excerpt}</p>}
          <div className="art-hero-cover">
            <svg viewBox="0 0 720 320" style={{ width: '100%', height: '100%' }}>
              <rect width="720" height="320" fill={modColor + '22'} />
              <text x="360" y="160" textAnchor="middle" fontSize="48" fontWeight="700" fill={modColor} fontFamily="'Zen Maru Gothic', sans-serif">
                {modSlug.toUpperCase()} · {modName.split('·')[1]?.trim() || modSlug.toUpperCase()}
              </text>
            </svg>
          </div>
        </div>

        <div className="art-body-wrap">
          <div className="art-content">
            <div dangerouslySetInnerHTML={{ __html: content }} />

            {/* Feedback */}
            <div style={{ marginTop: 48 }}>
              <div style={{ padding: '24px 26px', background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line-2)', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontSize: 56, lineHeight: 1 }}>🐼</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Zen Maru Gothic', system-ui, sans-serif", fontWeight: 700, fontSize: 16, color: 'var(--ink-0)', marginBottom: 2 }}>この記事、役に立った？</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>反応をくれると、パンダ先生のやる気が +100 します。</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['👍', '❤', '🎋', '🙏'].map(e => (
                    <button key={e} type="button" onClick={async () => { try { await fetch('/wp-json/sap/v1/articles/' + id + '/react', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reaction: e }) }); } catch {} }}
                      style={{ width: 44, height: 44, borderRadius: '50%', border: '1.5px solid var(--line-2)', background: 'var(--bg-1)', fontSize: 20, cursor: 'pointer' }}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: TOC + Related */}
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
                    <Link key={ra.id} href={`/article/${ra.id}/${ra.slug}`}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--bg-1)', borderRadius: 'var(--r-md)', textDecoration: 'none', fontSize: 13, transition: 'all .15s' }}>
                      <div style={{ width: 32, height: 32, borderRadius: 6, background: modColor + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11, color: modColor, flexShrink: 0 }}>{modSlug.toUpperCase()}</div>
                      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, color: 'var(--ink-0)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ra.title}</div></div>
                      <span style={{ color: 'var(--ink-3)', fontSize: 14, flexShrink: 0 }}>→</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </article>
    </>
  )
}
