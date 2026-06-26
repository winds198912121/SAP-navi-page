// ===========================================================
// 学習パス専用ページ /paths
// 3列カードグリッド、ステップ一覧表示、詳細画面へリンク
// ===========================================================

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/layout/Seo'
import SiteHeader from '../components/layout/Header'
import SiteFooter from '../components/layout/Footer'
import FloatingPanda from '../components/layout/FloatingPanda'
import { useTheme } from '../hooks/useTheme'
import api from '../services/api'
import type { SapModule } from '../types'

interface StepItem {
  id?: number; title: string; time: string
  courses?: any[]; knowledge?: any[]; articles?: any[]; notes?: any[]
}

interface LearningPath {
  id: number; title: string; audience: string; description: string
  steps: StepItem[]; duration: string; accent: string
  article_count: number; cta_url: string; created_at: string; related_articles?: any[]
}

const MAX_STEPS = 6
const ACCENTS = ['#5a9d6e', '#d97548', '#d96570', '#3b82f6', '#8b5cf6', '#ec4899']

function PathHero({ paths }: { paths: LearningPath[] }) {
  const total = paths.length
  return (
    <section style={{ background: 'linear-gradient(135deg, var(--accent-soft) 0%, var(--bg-1) 100%)', padding: '48px 28px 40px', borderBottom: '1px solid var(--line-1)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="crumb" style={{ marginBottom: 16 }}>
          <Link to="/" style={{ color: 'var(--ink-2)' }}>ホーム</Link><span className="sep"> › </span>
          <span style={{ color: 'var(--ink-0)', fontWeight: 600 }}>学習パス</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(28px, 3.5vw, 42px)', color: 'var(--ink-0)', margin: '0 0 8px' }}>あなたに合わせた学習パス<span className="accent-mark">.</span></h1>
        <p style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.8, maxWidth: 560 }}>目的別コースで順番に学べば自然と SAP がわかる。</p>
        <div style={{ display: 'flex', gap: 28, marginTop: 20 }}>
          <div><span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: 'var(--accent-deep)' }}>{total}</span><span style={{ fontSize: 12, color: 'var(--ink-2)', marginLeft: 4 }}>パス</span></div>
          <div><span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: 'var(--accent-deep)' }}>{paths.reduce((s, p) => s + (p.steps?.length || 0), 0)}</span><span style={{ fontSize: 12, color: 'var(--ink-2)', marginLeft: 4 }}>ステップ</span></div>
        </div>
      </div>
    </section>
  )
}

function StepRow({ step, accent, index }: { step: StepItem; accent: string; index: number }) {
  const itemCount = (step.courses?.length || 0) + (step.knowledge?.length || 0) + (step.articles?.length || 0)
  return (
    <Link to={step.id ? `/step/${step.id}` : '#'} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
        borderRadius: 'var(--r-md)', transition: 'all .12s',
        background: 'var(--bg-1)', border: '1px solid var(--line-1)',
        cursor: 'pointer',
      }}
        onMouseEnter={e => e.currentTarget.style.borderColor = accent}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--line-1)'}>
        <span style={{
          width: 24, height: 24, borderRadius: '50%', background: accent, color: 'white',
          fontSize: 10, fontWeight: 700, display: 'grid', placeItems: 'center', flexShrink: 0,
        }}>{index + 1}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-0)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{step.title}</div>
          {itemCount > 0 && (
            <div style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 1 }}>
              📚{(step.courses?.length || 0)} 📖{(step.knowledge?.length || 0)} 📰{(step.articles?.length || 0)}
            </div>
          )}
        </div>
        {step.time && <span style={{ fontSize: 10.5, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{step.time}</span>}
        <span style={{ fontSize: 14, color: accent, flexShrink: 0 }}>→</span>
      </div>
    </Link>
  )
}

function PathCard({ path, index }: { path: LearningPath; index: number }) {
  const accent = path.accent || ACCENTS[index % ACCENTS.length]
  const steps = (path.steps || []).slice(0, MAX_STEPS)
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-xl)', overflow: 'hidden', boxShadow: 'var(--sh-1)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 4, background: `linear-gradient(90deg, ${accent}, ${accent}88)` }} />
      <div style={{ padding: '22px 22px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: accent }}>{path.audience}</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--ink-0)', margin: '4px 0 0', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{path.title}</h2>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 40, lineHeight: 0.85, color: 'transparent', WebkitTextStroke: `2px ${accent}`, whiteSpace: 'nowrap', flexShrink: 0 }}>{String(index + 1).padStart(2, '0')}</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.7, margin: '10px 0 14px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', wordBreak: 'break-word' }}>{path.description}</p>
        {/* 6 steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14, flex: 1 }}>
          {steps.map((s, j) => (
            <StepRow key={j} step={s} accent={accent} index={j} />
          ))}
          {(path.steps || []).length > MAX_STEPS && (
            <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--ink-3)', padding: 4 }}>
              + {(path.steps || []).length - MAX_STEPS} ステップ
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', paddingTop: 12, borderTop: '1px dashed var(--line-2)', marginTop: 'auto' }}>
          <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>⏱ {path.duration}</span>
          <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>🎯 {(path.steps || []).length}ステップ</span>
          <Link to={`/learning/${path.id}`} style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 14px', borderRadius: 'var(--r-pill)', background: accent, color: 'white', fontSize: 12, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            開始 →
          </Link>
        </div>
      </div>
    </div>
  )
}

function ModuleGrid() {
  const [modules, setModules] = useState<SapModule[]>([])
  useEffect(() => { api.getModules().then(r => { if (r.success) setModules(r.data) }).catch(() => {}) }, [])
  if (!modules.length) return null
  return (
    <section className="section">
      <div className="section-head" style={{ marginBottom: 20 }}><div><div className="label">Module Paths</div><h2>モジュールから探す<span className="accent-mark">.</span></h2></div><div className="desc">気になるモジュールの記事一覧へ</div></div>
      <div className="module-grid">{modules.slice(0, 9).map(m => (
        <Link key={m.slug} to={`/category/${m.slug}`} className="mod-card" style={{ '--card-color': m.color, '--card-bg': m.bg_color } as React.CSSProperties}>
          <div className="mod-top"><div className="mod-icon">{m.code}</div></div>
          <div className="mod-name-ja">{m.name_ja}</div>
          <div className="mod-code">{m.name_en}</div>
          <div className="mod-desc">{m.description}</div>
          <div className="mod-foot"><span className="count">{m.article_count}本</span><span>の記事</span><div className="level-tags">{m.levels.map((lv: string, j: number) => (<span key={j} className={`level-pill l${j + 1}`}>{lv}</span>))}</div></div>
        </Link>
      ))}</div>
    </section>
  )
}

export default function PathsPage() {
  const [paths, setPaths] = useState<LearningPath[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const { settings } = useTheme()

  useEffect(() => {
    api.getLearningPaths().then(res => {
      if (res.success && res.data) {
        const valid = res.data.filter((p: LearningPath) => p.steps?.length > 0)
        setPaths(valid.length > 0 ? valid : res.data.slice(-6))
      }
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const audiences = ['all', ...new Set(paths.map(p => p.audience).filter(Boolean))]
  const filtered = activeFilter === 'all' ? paths : paths.filter(p => p.audience === activeFilter)

  return (
    <>
      <div className="page-bg" />
      <Seo
        title="SAP 学習パス一覧"
        description="目的別に組まれた SAP 学習パス。新人向け入門コース、コンサル中級向け設計力、ABAP/S/4HANA モダン開発 — あなたに合わせた学習ロードマップで SAP をマスター。"
        path="/paths"
        breadcrumbs={[{ name: 'ホーム', path: '/' }, { name: '学習パス', path: '/paths' }]}
      />
<SiteHeader active="paths" />
      <main style={{ position: 'relative', zIndex: 2 }}>
        <PathHero paths={paths} />
        <section className="section" style={{ paddingTop: 28, paddingBottom: 0 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
            {audiences.map(a => (
              <button key={a} onClick={() => setActiveFilter(a)} style={{ padding: '7px 18px', borderRadius: 'var(--r-pill)', border: '1.5px solid', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, borderColor: activeFilter === a ? 'var(--accent)' : 'var(--line-2)', background: activeFilter === a ? 'var(--accent-soft)' : 'var(--bg-card)', color: activeFilter === a ? 'var(--accent-deep)' : 'var(--ink-1)' }}>
                {a === 'all' ? 'すべて' : a}
              </button>
            ))}
          </div>
        </section>
        <section className="section" style={{ paddingTop: 0 }}>
          {loading ? <div style={{ textAlign: 'center', padding: 80, color: 'var(--ink-3)' }}>読み込み中...</div>
          : filtered.length === 0 ? <div style={{ textAlign: 'center', padding: 80, color: 'var(--ink-3)' }}><div style={{ fontSize: 48, marginBottom: 12 }}>🎋</div><div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-0)', marginBottom: 6 }}>まだ学習パスがありません</div><div style={{ fontSize: 13 }}>準備中です。お楽しみに！</div></div>
          : <div className="path-grid" style={{ alignItems: 'start' }}>
              {filtered.map((p, i) => <PathCard key={p.id} path={p} index={i} />)}
            </div>}
        </section>
        <ModuleGrid />
      </main>
      <SiteFooter />
      {settings.showFloatingPanda && <FloatingPanda />}
    </>
  )
}
