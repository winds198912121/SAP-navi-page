'use client'
// ===========================================================
// LearningPage — 学習パス詳細画面 /learning/:id
// ステップ一覧 → 各ステップ詳細ページ /step/:id へリンク
// ===========================================================
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

const PUBLIC_API = '/wp-json/sap/v1'

export default function LearningPage() {
  const params = useParams()
  const id = params?.id as string | undefined

  const [path, setPath] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`${PUBLIC_API}/learning-paths/${parseInt(id)}`).then(r => r.json()).then(d => {
      if (d.success && d.data) setPath(d.data)
      else loadFallback()
    }).catch(() => loadFallback()).finally(() => setLoading(false))
  }, [id])

  function loadFallback() {
    setPath({
      id: parseInt(id || '0'),
      title: 'SAPって何？からはじめる入門コース',
      audience: '新人さん向け',
      description: '初日からつまずきがちな用語と基本フローをやさしく整理。3週間で全体像をつかむ。',
      duration: '約 3 週間 · 12 本',
      accent: '#5a9d6e',
      steps: [
        { id: 1, title: 'SAPの世界観を知る', time: '20 min', courses: [], knowledge: [], articles: [] },
        { id: 2, title: 'GUI 操作の基本', time: '30 min' },
        { id: 3, title: 'マスタとトランザクション', time: '40 min' },
        { id: 4, title: 'はじめての仕訳入力', time: '45 min' },
      ],
      related_articles: [],
    })
  }

  if (loading) return (
    <><div className="page-bg" /><div style={{ textAlign: 'center', padding: 80, color: 'var(--ink-3)' }}>読み込み中...</div></>
  )

  if (!path) return (
    <><div className="page-bg" />
    <div style={{ textAlign: 'center', padding: 80 }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🎋</div>
      <h2 style={{ fontFamily: "'Zen Maru Gothic', system-ui, sans-serif", fontSize: 22, color: 'var(--ink-0)' }}>学習パスが見つかりません</h2>
      <Link href="/paths" className="btn" style={{ marginTop: 20, display: 'inline-flex', textDecoration: 'none' }}>一覧に戻る</Link>
    </div></>
  )

  const accent = path.accent || '#5a9d6e'
  const pathTitle = path?.title || ''
  const pathDesc = path?.description || ''

  return (
    <>
      <div className="page-bg" />

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${accent}22, var(--bg-1) 60%)`, padding: '40px 28px', borderBottom: '1px solid var(--line-1)' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <div className="crumb" style={{ marginBottom: 12 }}>
            <Link href="/" style={{ color: 'var(--ink-2)' }}>ホーム</Link><span className="sep"> › </span>
            <Link href="/paths" style={{ color: 'var(--ink-2)' }}>学習パス</Link><span className="sep"> › </span>
            <span style={{ color: 'var(--ink-0)', fontWeight: 600 }}>{path.title}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: accent }}>{path.audience}</span>
          </div>
          <h1 style={{ fontFamily: "'Zen Maru Gothic', system-ui, sans-serif", fontWeight: 700, fontSize: 'clamp(26px, 3vw, 36px)', color: 'var(--ink-0)', margin: '0 0 8px' }}>{path.title}</h1>
          <p style={{ fontSize: 14.5, color: 'var(--ink-2)', lineHeight: 1.8, maxWidth: 600 }}>{path.description}</p>
          <div style={{ display: 'flex', gap: 20, marginTop: 16 }}>
            <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>⏱ {path.duration}</span>
            <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>🎯 {(path.steps || []).length}ステップ</span>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 880, margin: '0 auto', padding: '32px 28px 64px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: 40 }}>
        {/* Steps list */}
        <div>
          <h2 style={{ fontFamily: "'Zen Maru Gothic', system-ui, sans-serif", fontWeight: 700, fontSize: 22, color: 'var(--ink-0)', margin: '0 0 20px' }}>
            学習ステップ <span style={{ fontSize: 14, color: 'var(--ink-3)', fontWeight: 500 }}>全{(path.steps || []).length}ステップ</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(path.steps || []).map((s: any, i: number) => (
              <Link key={i} href={s.id ? `/step/${s.id}` : '#'} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 18px', borderRadius: 'var(--r-lg)',
                border: `1.5px solid ${i === 0 ? accent : 'var(--line-1)'}`,
                background: i === 0 ? `${accent}0a` : 'var(--bg-card)',
                cursor: 'pointer', transition: 'all .15s', textDecoration: 'none',
              }}
                onMouseEnter={e => { if (i !== 0) e.currentTarget.style.borderColor = accent }}
                onMouseLeave={e => { if (i !== 0) e.currentTarget.style.borderColor = 'var(--line-1)' }}
              >
                <span style={{ width: 32, height: 32, borderRadius: '50%', background: i === 0 ? accent : 'var(--bg-tint)', color: i === 0 ? 'white' : 'var(--ink-2)', fontSize: 13, fontWeight: 700, display: 'grid', placeItems: 'center', flexShrink: 0 }}>{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink-0)' }}>{s.title}</div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 3, fontSize: 11.5 }}>
                    {(s.courses?.length || 0) > 0 && <span style={{ color: '#5a9d6e' }}>📚 {(s.courses || []).length}</span>}
                    {(s.knowledge?.length || 0) > 0 && <span style={{ color: '#3b82f6' }}>📖 {(s.knowledge || []).length}</span>}
                    {(s.articles?.length || 0) > 0 && <span style={{ color: '#8b5cf6' }}>📰 {(s.articles || []).length}</span>}
                  </div>
                </div>
                <span style={{ fontSize: 11, color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>{s.time || s.duration || ''}</span>
                <span style={{ fontSize: 18, color: 'var(--accent)' }}>→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: 80, alignSelf: 'start' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line-1)', padding: '18px 20px', marginBottom: 14 }}>
            <h5 style={{ fontFamily: "'Zen Maru Gothic', system-ui, sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: accent, margin: '0 0 12px' }}>📚 関連記事</h5>
            {!path.related_articles || path.related_articles.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>関連記事がまだ設定されていません。</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {path.related_articles.map((a: any) => (
                  <li key={a.id}>
                    <Link href={`/article/${a.id}/${a.slug}`} style={{ fontSize: 13, color: 'var(--ink-1)', textDecoration: 'none', lineHeight: 1.5, display: 'block', padding: '6px 10px', borderRadius: 'var(--r-sm)', background: 'var(--bg-1)' }}>
                      {a.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line-1)', padding: '18px 20px', marginBottom: 14 }}>
            <h5 style={{ fontFamily: "'Zen Maru Gothic', system-ui, sans-serif", fontSize: 12, fontWeight: 700, color: 'var(--ink-0)', margin: '0 0 10px' }}>🎯 学習状況</h5>
            <div style={{ height: 6, background: 'var(--bg-tint)', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ height: '100%', background: accent, borderRadius: 3, width: '0%' }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>{(path.steps || []).length} ステップ</div>
          </div>
          <Link href="/paths" className="btn sm" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
            ← 一覧に戻る
          </Link>
        </aside>
      </div>
    </>
  )
}
