// ===========================================================
// LearningPage — 学習パス詳細画面 /learning/:id
// ステップ一覧 → 各ステップ詳細ページ /step/:id へリンク
// ===========================================================

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Seo from '../components/layout/Seo'
import SiteHeader from '../components/layout/Header'
import SiteFooter from '../components/layout/Footer'
import FloatingPanda from '../components/layout/FloatingPanda'
import { useTheme } from '../hooks/useTheme'
import api from '../services/api'

interface Step {
  id?: number; title: string; time: string; content?: string
}
interface RelatedArticle { id: number; title: string; slug: string }
interface PathData {
  id: number; title: string; audience: string; description: string
  steps: Step[]; duration: string; accent: string
  article_count: number; related_articles: RelatedArticle[]
  created_at: string
}

export default function LearningPage() {
  const { id } = useParams()
  const [path, setPath] = useState<PathData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const { settings } = useTheme()

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.getLearningPath(parseInt(id)).then(res => {
      if (res.success) setPath(res.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <><Seo title="学習パスを読み込み中" description="SAP 学習パスの詳細を読み込み中です。" path={`/learning/${id}`} /><div className="page-bg" /><SiteHeader />
    <main style={{ textAlign: 'center', padding: 80, color: 'var(--ink-3)' }}>読み込み中...</main>
    <SiteFooter /></>
  )

  if (!path) return (
    <><Seo title="学習パスが見つかりません" description="お探しの学習パスは存在しないか、削除されました。" path={"/learning/"+String(id)} /><div className="page-bg" /><SiteHeader />
    <main style={{ textAlign: 'center', padding: 80 }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🎋</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink-0)' }}>学習パスが見つかりません</h2>
      <Link to="/paths" className="btn" style={{ marginTop: 20, display: 'inline-flex', textDecoration: 'none' }}>一覧に戻る</Link>
    </main>
    <SiteFooter /></>
  )

  const accent = path.accent || '#5a9d6e'
  const pathTitle = path?.title || ''
  const pathDesc = path?.description || ''

  return (
    <>
      <Seo
        title={`${pathTitle} — SAP学習パス`}
        description={pathDesc || `SAP 学習パス「${pathTitle}」。${path.duration || ''}・${(path.steps || []).length}ステップ。`}
        path={"/learning/"+String(id)}
        breadcrumbs={[
          { name: 'ホーム', path: '/' },
          { name: '学習パス', path: '/paths' },
          { name: pathTitle, path: "/learning/"+String(id) },
        ]}
      />
      <div className="page-bg" /><SiteHeader />
      <main style={{ position: 'relative', zIndex: 2 }}>
        {/* Hero */}
        <section style={{ background: `linear-gradient(135deg, ${accent}22, var(--bg-1) 60%)`, padding: '40px 28px', borderBottom: '1px solid var(--line-1)' }}>
          <div style={{ maxWidth: 880, margin: '0 auto' }}>
            <div className="crumb" style={{ marginBottom: 12 }}>
              <Link to="/" style={{ color: 'var(--ink-2)' }}>ホーム</Link><span className="sep"> › </span>
              <Link to="/paths" style={{ color: 'var(--ink-2)' }}>学習パス</Link><span className="sep"> › </span>
              <span style={{ color: 'var(--ink-0)', fontWeight: 600 }}>{path.title}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: accent }}>{path.audience}</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(26px, 3vw, 36px)', color: 'var(--ink-0)', margin: '0 0 8px' }}>{path.title}</h1>
            <p style={{ fontSize: 14.5, color: 'var(--ink-2)', lineHeight: 1.8, maxWidth: 600 }}>{path.description}</p>
            <div style={{ display: 'flex', gap: 20, marginTop: 16 }}>
              <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>⏱ {path.duration}</span>
              <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>📄 {path.article_count}記事</span>
              <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>🎯 {(path.steps || []).length}ステップ</span>
            </div>
          </div>
        </section>

        <div style={{ maxWidth: 880, margin: '0 auto', padding: '32px 28px 64px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: 40 }}>
          {/* Steps list */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--ink-0)', margin: '0 0 20px' }}>
              学習ステップ <span style={{ fontSize: 14, color: 'var(--ink-3)', fontWeight: 500 }}>全{(path.steps || []).length}ステップ</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(path.steps || []).map((s, i) => (
                <Link key={i} to={`/step/${s.id}`} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 18px', borderRadius: 'var(--r-lg)',
                  border: `1.5px solid ${i === currentStep ? accent : 'var(--line-1)'}`,
                  background: i === currentStep ? `${accent}0a` : 'var(--bg-card)',
                  cursor: 'pointer', transition: 'all .15s', textDecoration: 'none',
                }}
                  onMouseEnter={e => { if (i !== currentStep) e.currentTarget.style.borderColor = accent }}
                  onMouseLeave={e => { if (i !== currentStep) e.currentTarget.style.borderColor = 'var(--line-1)' }}
                >
                  <span style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: i === currentStep ? accent : 'var(--bg-tint)',
                    color: i === currentStep ? 'white' : 'var(--ink-2)',
                    fontSize: 13, fontWeight: 700, display: 'grid', placeItems: 'center', flexShrink: 0,
                  }}>{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink-0)' }}>{s.title}</div>
                    {i === currentStep && s.time && <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>所要時間: {s.time}</div>}
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>{s.time}</span>
                  <span style={{ fontSize: 18, color: 'var(--accent)' }}>→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside style={{ position: 'sticky', top: 80, alignSelf: 'start' }}>
            <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line-1)', padding: '18px 20px', marginBottom: 14 }}>
              <h5 style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: accent, margin: '0 0 12px' }}>📚 関連記事</h5>
              {!path.related_articles || path.related_articles.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>関連記事がまだ設定されていません。</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {path.related_articles.map((a: RelatedArticle) => (
                    <li key={a.id}>
                      <Link to={`/article/${a.slug}`} style={{ fontSize: 13, color: 'var(--ink-1)', textDecoration: 'none', lineHeight: 1.5, display: 'block', padding: '6px 10px', borderRadius: 'var(--r-sm)', background: 'var(--bg-1)' }}>
                        {a.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line-1)', padding: '18px 20px', marginBottom: 14 }}>
              <h5 style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700, color: 'var(--ink-0)', margin: '0 0 10px' }}>🎯 学習状況</h5>
              <div style={{ height: 6, background: 'var(--bg-tint)', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
                <div style={{ height: '100%', background: accent, borderRadius: 3, width: '0%' }} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>{(path.steps || []).length} ステップ</div>
            </div>
            <Link to="/paths" className="btn sm" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
              ← 一覧に戻る
            </Link>
          </aside>
        </div>
      </main>
      <SiteFooter />
      {settings.showFloatingPanda && <FloatingPanda />}
    </>
  )
}
