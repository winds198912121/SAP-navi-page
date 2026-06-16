import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/layout/Seo'
import SiteHeader from '../components/layout/Header'
import SiteFooter from '../components/layout/Footer'
import FloatingPanda from '../components/layout/FloatingPanda'
import { useTheme } from '../hooks/useTheme'
import { SAP_MODULES, LEARNING_PATHS, ARTICLE_DATA, TOP10 } from '../types'
import CaseTicker from '../components/cases/CaseTicker'
import CasesSection from '../components/cases/CasesSection'
import FreelanceWorries from '../components/cases/FreelanceWorries'
import HeroScene from '../components/home/HeroScene'
import QuizCard from '../components/quiz/QuizCard'
import api from '../services/api'
import type { SapModule } from '../types'

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    if (!ref.current) { setShown(true); return }
    const safety = setTimeout(() => setShown(true), 200)
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { setTimeout(() => setShown(true), delay); obs.unobserve(e.target) } })
    }, { threshold: 0.08 })
    obs.observe(ref.current)
    return () => { clearTimeout(safety); obs.disconnect() }
  }, [delay])
  return <div ref={ref} className={`reveal${shown ? ' in' : ''}`}>{children}</div>
}

function Hero() {
  const [stats, setStats] = useState({ articles: 0, courses: 0, knowledge: 0, modules: 0, readers: '24,800' })

  useEffect(() => {
    Promise.all([
      api.client.get('/articles', { params: { per_page: 1 } }).then(({ data }) => {
        if (data.success && data.total) setStats(prev => ({ ...prev, articles: data.total }))
      }).catch(() => {}),
      api.getModules().then(res => {
        if (res.success && res.data) setStats(prev => ({ ...prev, modules: res.data.length }))
      }).catch(() => {}),
      api.client.get('/courses', { params: { per_page: 1 } }).then(({ data }) => {
        if (data.success && data.total) setStats(prev => ({ ...prev, courses: data.total }))
      }).catch(() => {}),
      api.client.get('/knowledge', { params: { per_page: 1 } }).then(({ data }) => {
        if (data.success && data.total) setStats(prev => ({ ...prev, knowledge: data.total }))
      }).catch(() => {}),
    ])
  }, [])

  return (
    <section className="hero">
      <div className="hero-text">
        <div className="hero-eyebrow">
          <span className="ico">P</span>
          パンダ先生 × たろうくんと、SAPを学ぼう
        </div>
        <h1>
          SAPの世界を、<br />
          <span className="wave-under">もっと身近に</span>。
        </h1>
        <p className="lead">
          財務・購買・販売・生産・人事 — むずかしい SAP のしくみを、
          パンダ先生がやさしく解説。たろうくん（24歳・SAP学習中）と一緒に、
          「わからない…！」から「なるほど！」へ。
        </p>
        <div className="hero-ctas">
          <Link to="/paths" className="btn primary" style={{ textDecoration: 'none' }}>
            学習パスを見る
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
          <Link to="/modules" className="btn" style={{ textDecoration: 'none' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            記事を探す
          </Link>
        </div>
        <div className="hero-stats">
          <div className="hero-stat"><div className="v">{stats.articles.toLocaleString()}<small>本</small></div><div className="l">公開記事</div></div>
          <div className="hero-stat"><div className="v">{stats.modules}<small>モジュール</small></div><div className="l">主要モジュール網羅</div></div>
          <div className="hero-stat"><div className="v">{stats.courses.toLocaleString()}<small>コース</small></div><div className="l">専門コース</div></div>
          <div className="hero-stat"><div className="v">{stats.readers}<small>+</small></div><div className="l">月間読者</div></div>
        </div>
      </div>
      <HeroScene />
    </section>
  )
}

function ModulesSection() {
  const [modules, setModules] = useState<SapModule[]>(SAP_MODULES)

  useEffect(() => {
    api.getModules().then(res => {
      if (res.success && res.data.length >= 9) setModules(res.data)
    }).catch(() => {})
  }, [])

  return (
    <section className="section" id="modules">
      <div className="section-head">
        <div>
          <div className="label">Modules Guide</div>
          <h2>モジュール別ガイド<span className="accent-mark">.</span></h2>
        </div>
        <div className="desc">
          SAP の世界は広い。<br />
          でも大丈夫、パンダ先生がモジュールごとに案内します。
        </div>
      </div>
      <div className="module-grid">
        {modules.map(m => (
          <Link key={m.slug} to={`/category/${m.slug}`} className="mod-card"
            style={{ '--card-color': m.color, '--card-bg': m.bg_color } as React.CSSProperties}>
            <div className="mod-top"><div className="mod-icon">{m.code}</div></div>
            <div className="mod-name-ja">{m.name_ja}</div>
            <div className="mod-code">{m.name_en} · {m.code}</div>
            <div className="mod-desc">{m.description}</div>
            <div className="mod-foot"><span className="count">{m.article_count}本</span><span>の記事</span>
              <div className="level-tags">{m.levels.map((lv: string, j: number) => (<span key={j} className={`level-pill l${j + 1}`}>{lv}</span>))}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function PathsSection() {
  const [paths, setPaths] = useState<any[]>(LEARNING_PATHS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getLearningPaths().then(res => {
      if (res.success && res.data.length >= 3) setPaths(res.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <section className="section" id="paths">
      <div className="section-head">
        <div>
          <div className="label">Learning Path</div>
          <h2>あなたに合わせた学習パス<span className="accent-mark">.</span></h2>
        </div>
        <div className="desc">
          バラバラの記事じゃなくて、目的別に組まれたコース。<br />
          順番に読めば、自然と SAP がわかってくる。
        </div>
      </div>
      <Reveal>
        <div className="path-grid">
          {paths.map((p: any, i: number) => (
            <div key={p.id || i} className={`path-card p${i + 1}`}
              style={{ '--accent-color': p.accent || (i === 0 ? '#5a9d6e' : i === 1 ? '#d97548' : '#d96570') } as React.CSSProperties}>
              <div className="num">{String(i + 1).padStart(2, '0')}</div>
              <div className="audience">{p.audience}</div>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <div className="path-steps">
                {(p.steps || []).slice(0, 4).map((s: any, j: number) => (
                  <Link key={j} to={s.id ? `/step/${s.id}` : `/learning/${p.id}`} className="path-step">
                    <span className="step-num">{j + 1}</span>
                    <span className="step-title">{s.title}</span>
                    <span className="step-time">{s.time}</span>
                  </Link>
                ))}
              </div>
              <div className="path-meta">
                <span>{p.duration}</span>
                <Link to={`/learning/${p.id}`} className="arrow" style={{ textDecoration: 'none' }}>パスを開始 →</Link>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

function ArticlesSection() {
  return (
    <section className="section" id="articles">
      <div className="section-head">
        <div>
          <div className="label">Latest Articles</div>
          <h2>新着記事<span className="accent-mark">.</span></h2>
        </div>
        <div className="desc">毎週更新。読むだけで SAP 力が上がる記事を厳選。</div>
      </div>
      <div className="articles-grid">
        <div className="article-list">
          {ARTICLE_DATA.slice(0, 3).map((a, i) => (
            <a key={i} href={`/article/${a.title.replace(/\s+/g, '-')}`} className="article-row" style={{ textDecoration: 'none', display: 'block' }}>
              <div className="article-thumb">
                <svg viewBox="0 0 120 88" style={{ width: '100%', height: '100%' }}>
                  <rect width="120" height="88" fill={a.cover === 'fi' ? '#d8ead9' : a.cover === 'abap' ? '#cfecec' : a.cover === 'mm' ? '#fde0c2' : a.cover === 's4' ? '#d1ecf9' : '#e4dffb'} />
                  <text x="60" y="48" fontSize="22" fontWeight="800" fill={a.cover === 'fi' ? '#2f6d44' : a.cover === 'abap' ? '#1f6f6f' : a.cover === 'mm' ? '#a25411' : a.cover === 's4' ? '#1864a3' : '#4828a8'} textAnchor="middle" fontFamily="monospace">{a.mod}</text>
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="article-meta-top">
                  <span className={`tag-mod ${a.cover}`}>{a.mod}</span>
                  <span className={`tag-diff l${a.diff}`}>{a.diffLabel}</span>
                </div>
                <h3>{a.title}</h3>
                <div className="excerpt">{a.excerpt}</div>
                <div className="article-meta-bot">
                  <span>{a.author}</span><span>·</span><span>{a.date}</span><span>·</span><span>{a.mins} min read</span>
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="top10">
          <div className="top10-head"><span className="badge">RANKING</span><h3>よく読まれている記事</h3></div>
          {TOP10.map((t, i) => (
            <a key={i} href="#" className="top10-item"><div className="rank-num">{String(i + 1).padStart(2, '0')}</div><div>{t}</div></a>
          ))}
        </div>
      </div>
    </section>
  )
}

function YouTubeSection() {
  const [videos, setVideos] = useState<any[]>([])
  useEffect(() => {
    api.getVideos({ per_page: 8 }).then(res => { if (res.success) setVideos(res.data) }).catch(() => {})
  }, [])
  if (!videos.length) return null
  return (
    <section className="section" id="video">
      <div className="section-head">
        <div><div className="label">YouTube</div><h2>パンダ先生の動画講座<span className="accent-mark">.</span></h2></div>
        <div className="desc">SAP の操作画面を動画で確認。通勤・隙間時間に。</div>
      </div>
      <div className="yt-grid">
        {videos.map(v => (
          <a key={v.id} href={v.youtube_id ? `https://youtube.com/watch?v=${v.youtube_id}` : '#'} target="_blank" rel="noopener noreferrer" className="yt-vid" style={{ textDecoration: 'none', cursor: 'pointer' }}>
            <div className="vid-thumb">
              {v.youtube_id ? <img src={`https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg`} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: 'var(--bg-tint)', display: 'grid', placeItems: 'center', color: 'var(--ink-3)', fontSize: 24 }}>📹</div>}
            </div>
            <div className="vid-info"><h4>{v.title}</h4><span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{v.duration || ''}</span></div>
          </a>
        ))}
      </div>
    </section>
  )
}

function NewsletterSection() {
  const [email, setEmail] = useState('')
  return (
    <section className="section">
      <Reveal>
        <div className="newsletter">
          <div className="nl-mascot">
            <svg width="80" height="80" viewBox="-4 -8 108 108">
              <circle cx="50" cy="52" r="46" fill="#e8f0fb" opacity="0.4" />
              <path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" />
              <g><path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" /><path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" /></g>
              <circle cx="30" cy="44" r="3.4" fill="#fff" /><circle cx="30" cy="44" r="2.4" fill="#0e0a05" />
              <circle cx="70" cy="44" r="3.4" fill="#fff" /><circle cx="70" cy="44" r="2.4" fill="#0e0a05" />
              <ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" />
              <path d="M 42 68 Q 50 78 58 68" fill="#1a1612" />
            </svg>
          </div>
          <div className="nl-text">
            <h3>週末のニュースレター 🎋</h3>
            <p>一週間の SAP ニュース、新着記事、パンダ先生の独り言を、土曜の朝にお届け。</p>
          </div>
          <form className="nl-form" onSubmit={(e) => { e.preventDefault(); alert('登録ありがとう！🎋'); setEmail('') }}>
            <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            <button className="btn primary" type="submit">登録</button>
          </form>
        </div>
      </Reveal>
    </section>
  )
}

function TweaksPanel({ settings, updateSetting }: {
  settings: ReturnType<typeof useTheme>['settings']
  updateSetting: ReturnType<typeof useTheme>['updateSetting']
}) {
  return (
    <div className="tweaks-panel">
      <div className="tweak-section">
        <div className="tweak-label">カラーテーマ</div>
        <div className="tweak-radio">
          {(['bamboo', 'warm', 'fresh'] as const).map(p => (
            <button key={p} className={settings.palette === p ? 'active' : ''}
              onClick={() => updateSetting('palette', p)}>
              {p === 'bamboo' ? '竹林' : p === 'warm' ? '温暖' : '清新'}
            </button>
          ))}
        </div>
      </div>
      <div className="tweak-section">
        <div className="tweak-label">アニメ強度</div>
        <div className="tweak-radio">
          {(['off', 'light', 'medium'] as const).map(v => (
            <button key={v} className={settings.intensity === v ? 'active' : ''}
              onClick={() => updateSetting('intensity', v)}>
              {v === 'off' ? 'OFF' : v === 'light' ? '弱' : '中'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { settings, updateSetting } = useTheme()
  const [showTweaks, setShowTweaks] = useState(false)

  return (
    <>
      <Seo
        title="SAP学習プラットフォーム"
        description="SAP のしくみを、パンダ先生がやさしく解説。財務会計(FI)・管理会計(CO)・購買(MM)・販売(SD)・生産(PP)・ABAP — 初心者から SAP コンサルまで、無料で学べる SAP 知識サイト。"
        path="/"
      />
      <div className="page-bg" />
      <SiteHeader active="home" />
      <main style={{ position: 'relative', zIndex: 2 }}>
        <Hero />
        <CaseTicker />
        <CasesSection />
        <FreelanceWorries />
        <ModulesSection />
        <PathsSection />
        <ArticlesSection />
        <QuizCard />
        <YouTubeSection />
        <NewsletterSection />
      </main>
      <SiteFooter />
      {settings.showFloatingPanda && <FloatingPanda />}
      <div className="tweaks-btn">
        <button className="btn sm" onClick={() => setShowTweaks(!showTweaks)}>
          🎨 {showTweaks ? '✕' : 'テーマ'}
        </button>
      </div>
      {showTweaks && <TweaksPanel settings={settings} updateSetting={updateSetting} />}
    </>
  )
}
