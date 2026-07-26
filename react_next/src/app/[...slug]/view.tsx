'use client'
// ===========================================================
// TopicPage — トピック別記事一覧 /glossary /trends /career
// 記事に紐づいた topic タクソノミーでフィルタ、カード表示
// ===========================================================
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ContactForm from '@/app/contact-form'

const PUBLIC_API = '/wp-json/sap/v1'

const TOPIC_META: Record<string, { label: string; icon: string; desc: string; color: string; bg: string }> = {
  glossary: { label: '用語集', icon: '📚', desc: 'SAP関連の専門用語をわかりやすく解説。', color: '#2f6d44', bg: '#d8ead9' },
  trends: { label: 'SAPトレンド', icon: '📈', desc: 'SAP業界の最新動向・トピックス。', color: '#2641a1', bg: '#dde4fc' },
  career: { label: '転職ガイド', icon: '🎯', desc: 'SAPコンサルタントへの転職・キャリア情報。', color: '#8a6212', bg: '#fee9b3' },
}

/** 固定ページのフォールバックデータ（API が使えない場合） */
const FALLBACK_PAGE: Record<string, { title: string; content: string }> = {
  about: { title: 'このサイトについて', content: '<p>SAP パンダ先生 NAVI は、SAP学習者のための総合プラットフォームです。</p>' },
  team: { title: 'チーム', content: '<p>SAP パンダ先生 NAVI は、現役SAPコンサルタントとエンジニアが立ち上げたプロジェクトです。</p>' },
  privacy: { title: 'プライバシーポリシー', content: '<p>当サイトは、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。</p>' },
  terms: { title: '利用規約', content: '<p>本規約は、SAP パンダ先生 NAVI の利用条件を定めるものです。</p>' },
}

function fmtDate(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`
}

export default function TopicPage() {
  const params = useParams()
  const slugs = params?.slug as string[] | undefined
  const topic = slugs?.[0] || 'glossary'
  const meta = TOPIC_META[topic]
  const topicTitle = meta?.label || 'トピック'
  const icon = meta?.icon || '📄'
  const desc = meta?.desc || ''
  const color = meta?.color || '#5a9d6e'
  const bg = meta?.bg || '#d8ead9'

  // === Static pages (about / team / privacy / terms) from API ===
  const isStaticPage = !meta && topic !== 'contact'
  const [pageData, setPageData] = useState<{ title: string; content: string } | null>(null)
  const [pageLoading, setPageLoading] = useState(isStaticPage)
  const [pageErr, setPageErr] = useState(false)

  useEffect(() => {
    if (!isStaticPage) return
    setPageLoading(true); setPageErr(false)
    fetch(`${PUBLIC_API}/pages?slug=${topic}`)
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          setPageData({ title: d.data.title, content: d.data.content || '' })
        } else {
          const fallback = FALLBACK_PAGE[topic]
          if (fallback) setPageData(fallback)
          else setPageErr(true)
        }
      })
      .catch(() => {
        const fallback = FALLBACK_PAGE[topic]
        if (fallback) setPageData(fallback)
        else setPageErr(true)
      })
      .finally(() => setPageLoading(false))
  }, [topic, isStaticPage])

  // Static page rendering
  if (isStaticPage) {
    return (
      <>
        <div className="page-bg" />
        <div className="section" style={{ maxWidth: 880 }}>
          <div className="crumb"><Link href="/">ホーム</Link><span className="sep">›</span><span>{pageLoading ? '読み込み中...' : pageData?.title || topic}</span></div>
          {pageLoading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)' }}>読み込み中...</div>
          ) : pageErr || !pageData ? (
            <>
              <h1>ページが見つかりません</h1>
              <p style={{ color: 'var(--ink-2)' }}>お探しのページは存在しません。</p>
              <Link href="/" className="btn" style={{ marginTop: 16, textDecoration: 'none' }}>トップページへ</Link>
            </>
          ) : (
            <>
              <h1>{pageData.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
            </>
          )}
        </div>
      </>
    )
  }

  // Contact page
  if (topic === 'contact') {
    return (
      <div className="section" style={{ maxWidth: 880 }}>
        <div className="crumb"><Link href="/">ホーム</Link><span className="sep">›</span><span>お問い合わせ</span></div>
        <h1>お問い合わせ</h1>
        <ContactForm />
      </div>
    )
  }

  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!topic) return
    setLoading(true)
    fetch(`${PUBLIC_API}/articles?topic=${topic}&per_page=50`)
      .then(r => r.json()).then(d => {
        if (d.success && d.data) setArticles(d.data)
        else setArticles([])
      }).catch(() => setArticles([]))
      .finally(() => setLoading(false))
  }, [topic])

  return (
    <>
      <div className="page-bg" />

      <section className="cat-hero" style={{ padding: '24px 28px 20px' }}>
        <div className="cat-hero-wrap" style={{ gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
          <div>
            <div className="crumb" style={{ marginBottom: 6, fontSize: 12 }}>
              <Link href="/">ホーム</Link>
              <span className="sep">›</span>
              <span className="now">{topicTitle}</span>
            </div>
            <div className="cat-title-row" style={{ gap: 12, marginBottom: 4 }}>
              <div className="cat-big-icon" style={{ background: bg, fontSize: 22, width: 52, height: 52 }}>{icon}</div>
              <h1 style={{ fontSize: 26, margin: 0 }}>{topicTitle}</h1>
            </div>
            {desc && <p className="cat-desc" style={{ fontSize: 13.5, maxWidth: 560, lineHeight: 1.7, marginBottom: 6 }}>{desc}</p>}
          </div>
          <div className="cat-stats" style={{ gap: 12, textAlign: 'right', flexDirection: 'column' }}>
            <div className="stat"><div className="v" style={{ fontSize: 32 }}>{articles.length}</div><div className="l" style={{ fontSize: 11 }}>記事</div></div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 32 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>読み込み中...</div>
        ) : articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
            <p style={{ fontSize: 16, lineHeight: 1.8 }}>ただいま記事を準備中です。<br />公開までしばらくお待ちください。</p>
            <Link href="/" className="btn" style={{ marginTop: 20, textDecoration: 'none' }}>トップページに戻る</Link>
          </div>
        ) : (
          <>
            <div className="section-head" style={{ marginBottom: 20 }}>
              <div>
                <div className="label">{topic === 'glossary' ? 'Glossary' : topic === 'trends' ? 'Trends' : 'Career'}</div>
                <h2>{topicTitle}<span className="accent-mark">.</span></h2>
              </div>
              <div className="desc">{articles.length} 件の記事</div>
            </div>
            <div className="module-grid">
              {articles.map((a: any) => {
                const modSlug = a.module?.slug || a.modules?.[0]?.slug || ''
                return (
                  <Link key={a.id} href={`/article/${a.id}/${a.slug || ''}`}
                    className="mod-card"
                    style={{ '--card-color': color, '--card-bg': bg } as React.CSSProperties}>
                    <div className="mod-top">
                      <div className="mod-icon">{modSlug?.toUpperCase() || icon}</div>
                      <span style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: '"JetBrains Mono", monospace' }}>
                        {a.reading_time || a.readingTime || 5}分
                      </span>
                    </div>
                    <div className="mod-name-ja" style={{ fontSize: 15, marginTop: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {a.title}
                    </div>
                    {a.excerpt && (
                      <div className="mod-desc" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {a.excerpt.replace(/<[^>]*>/g, '')}
                      </div>
                    )}
                    <div className="mod-foot" style={{ marginTop: 'auto' }}>
                      {a.difficulty && (
                        <span className={`level-pill l${a.difficulty.slug === 'beginner' ? 1 : a.difficulty.slug === 'intermediate' ? 2 : 3}`}>
                          {a.difficulty.slug === 'beginner' ? '初級' : a.difficulty.slug === 'intermediate' ? '中級' : '上級'}
                        </span>
                      )}
                      <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--ink-3)' }}>
                        {fmtDate(a.created_at || a.createdAt || '')}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </section>
    </>
  )
}
