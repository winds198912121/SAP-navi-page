// ===========================================================
// TopicPage — トピック別記事一覧 /glossary /trends /career
// 記事に紐づいた topic タクソノミーでフィルタ、4列カード表示
// ===========================================================

import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Seo from '../components/layout/Seo'
import SiteHeader from '../components/layout/Header'
import SiteFooter from '../components/layout/Footer'
import FloatingPanda from '../components/layout/FloatingPanda'
import { useTheme } from '../hooks/useTheme'
import api from '../services/api'
import type { Article } from '../types'
import { formatDate } from '../utils'

const TOPIC_META: Record<string, { label: string; icon: string; desc: string; color: string; bg: string }> = {
  'glossary':    { label: '用語集',    icon: '📚', desc: 'SAP関連の専門用語をわかりやすく解説。', color: '#2f6d44', bg: '#d8ead9' },
  'trends':      { label: 'SAPトレンド', icon: '📈', desc: 'SAP業界の最新動向・トピックス。',        color: '#2641a1', bg: '#dde4fc' },
  'career-guide': { label: '転職ガイド', icon: '🎯', desc: 'SAPコンサルタントへの転職・キャリア情報。', color: '#8a6212', bg: '#fee9b3' },
}

export default function TopicPage() {
  const location = useLocation()
  const topic = useMemo(() => location.pathname.replace(/\/+$/, '').split('/').pop() || 'glossary', [location.pathname])
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const { settings } = useTheme()

  const meta = topic ? TOPIC_META[topic] : null
  const title = meta ? meta.label : (topic || 'トピック')
  const icon = meta ? meta.icon : '📄'
  const desc = meta ? meta.desc : ''
  const color = meta ? meta.color : '#5a9d6e'
  const bg = meta ? meta.bg : '#d8ead9'

  useEffect(() => {
    if (!topic) return
    setLoading(true)
    api.getArticles({ topic, per_page: 50 })
      .then(res => {
        if (res.success && res.data) setArticles(res.data)
        else setArticles([])
      })
      .catch(() => setArticles([]))
      .finally(() => setLoading(false))
  }, [topic])

  return (
    <>
      <Seo title={`${title} — SAPパンダ先生`} description={desc || `${title}に関する記事一覧`} path={`/${topic}`} />
      <div className="page-bg" />
      <SiteHeader active="" />
      <main style={{ position: 'relative', zIndex: 2 }}>
        {/* Hero */}
        <section className="cat-hero" style={{ padding: '24px 28px 20px' }}>
          <div className="cat-hero-wrap" style={{ gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
            <div>
              <div className="crumb" style={{ marginBottom: 6, fontSize: 12 }}>
                <Link to="/">ホーム</Link>
                <span className="sep">›</span>
                <span className="now">{title}</span>
              </div>
              <div className="cat-title-row" style={{ gap: 12, marginBottom: 4 }}>
                <div className="cat-big-icon" style={{ background: bg, fontSize: 22, width: 52, height: 52 }}>{icon}</div>
                <h1 style={{ fontSize: 26, margin: 0 }}>{title}</h1>
              </div>
              {desc && <p className="cat-desc" style={{ fontSize: 13.5, color: 'var(--ink-1)', maxWidth: 560, lineHeight: 1.7, marginBottom: 6 }}>{desc}</p>}
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
              <Link to="/" className="btn" style={{ marginTop: 20, textDecoration: 'none' }}>トップページに戻る</Link>
            </div>
          ) : (
            <>
              <div className="section-head" style={{ marginBottom: 20 }}>
                <div>
                  <div className="label">{topic === 'glossary' ? 'Glossary' : topic === 'trends' ? 'Trends' : 'Career'}</div>
                  <h2>{title}<span className="accent-mark">.</span></h2>
                </div>
                <div className="desc">
                  {articles.length} 件の記事
                </div>
              </div>
              <div className="module-grid">
                {articles.map((a, idx) => (
                  <Link key={a.id} to={`/article/${a.id}/${a.slug}`}
                    className="mod-card"
                    style={{ '--card-color': color, '--card-bg': bg } as React.CSSProperties}>
                    <div className="mod-top">
                      <div className="mod-icon">{a.modules[0]?.slug?.toUpperCase() || icon}</div>
                      <span style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>
                        {a.readingTime}分
                      </span>
                    </div>
                    <div className="mod-name-ja" style={{
                      fontSize: 15, marginTop: 12,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {a.title}
                    </div>
                    {a.excerpt && (
                      <div className="mod-desc" style={{
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
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
                        {formatDate(a)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
      <SiteFooter />
      {settings.showFloatingPanda && <FloatingPanda />}
    </>
  )
}
