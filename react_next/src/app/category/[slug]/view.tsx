'use client'
// ===========================================================
// CategoryPage — モジュール別一覧 /category/:slug
// 記事・コース・ナレッジをタブ切替、難易度フィルター
// ===========================================================
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

const PUBLIC_API = '/wp-json/sap/v1'

const MODULE_COLORS: Record<string, string> = {
  fi: '#2f6d44', co: '#2641a1', mm: '#a25411', sd: '#b62a4a',
  pp: '#4828a8', hr: '#8a6212', abap: '#1f6f6f', basis: '#4a432d', s4: '#1864a3',
}

const MODULE_NAMES: Record<string, string> = {
  fi: '財務会計', co: '管理会計', mm: '購買・在庫',
  sd: '販売管理', pp: '生産計画', hr: '人事管理',
  abap: '開発言語', basis: '基盤管理', s4: 'S/4HANA',
}

const MODULE_EN: Record<string, string> = {
  fi: 'Financial Accounting', co: 'Controlling', mm: 'Material Management',
  sd: 'Sales & Distribution', pp: 'Production Planning', hr: 'Human Resources',
  abap: 'ABAP', basis: 'Basis', s4: 'Next-gen ERP',
}

const SAP_MODULES = ['fi', 'co', 'mm', 'sd', 'pp', 'hr', 'abap', 'basis', 's4']

type TabType = 'articles' | 'courses' | 'knowledge'

export default function CategoryPage() {
  const params = useParams()
  const moduleSlug = params?.slug as string | undefined
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<TabType>('articles')
  const [diff, setDiff] = useState('all')

  const color = MODULE_COLORS[moduleSlug || 'fi'] || '#5a9d6e'

  useEffect(() => {
    if (!moduleSlug) return
    setLoading(true)

    async function load() {
      // Try unified endpoint first
      try {
        const res = await fetch(`${PUBLIC_API}/modules/${moduleSlug}/content`)
        const d = await res.json()
        if (d.success && d.data) { setData(d.data); return }
      } catch {}

      // Fallback: fetch individually with demo data fallback
      try {
        const [articlesRes, coursesRes, knowledgeRes, modulesRes] = await Promise.all([
          fetch(`${PUBLIC_API}/modules/${moduleSlug}/articles?per_page=50`).then(r => r.json()).catch(() => ({ success: false })),
          fetch(`${PUBLIC_API}/courses?module=${moduleSlug}&per_page=50`).then(r => r.json()).catch(() => ({ success: false })),
          fetch(`${PUBLIC_API}/knowledge?module=${moduleSlug}&per_page=50`).then(r => r.json()).catch(() => ({ success: false })),
          fetch(`${PUBLIC_API}/modules`).then(r => r.json()).catch(() => ({ success: false, data: [] })),
        ])

        let articles = articlesRes.success ? (articlesRes.data || []) : []
        let courses = coursesRes.success ? (coursesRes.data || []) : []
        let knowledge = knowledgeRes.success ? (knowledgeRes.data || []) : []
        if (articles.length === 0) {
          articles = [
            { id: 1, title: '【保存版】SAP用語集 — はじめての100単語', slug: 'sap-glossary', excerpt: 'SAPに出てくる専門用語を100個厳選して解説。', module: { slug: moduleSlug, name: MODULE_NAMES[moduleSlug || ''] }, difficulty: { slug: 'beginner', name: '初級' }, reading_time: 15, views: 12500, created_at: new Date().toISOString() },
            { id: 2, title: `${MODULE_NAMES[moduleSlug || '']}の基礎知識`, slug: 'basics', excerpt: `${MODULE_NAMES[moduleSlug || '']}の基本概念をわかりやすく解説します。`, module: { slug: moduleSlug, name: MODULE_NAMES[moduleSlug || ''] }, difficulty: { slug: 'beginner', name: '初級' }, reading_time: 10, views: 8300, created_at: new Date().toISOString() },
            { id: 3, title: `${MODULE_NAMES[moduleSlug || '']} 実践テクニック`, slug: 'techniques', excerpt: `現場で使える${MODULE_NAMES[moduleSlug || '']}の実践テクニックを紹介。`, module: { slug: moduleSlug, name: MODULE_NAMES[moduleSlug || ''] }, difficulty: { slug: 'intermediate', name: '中級' }, reading_time: 12, views: 5600, created_at: new Date().toISOString() },
          ]
        }
        if (courses.length === 0) {
          courses = [
            { id: 1, title: `${MODULE_NAMES[moduleSlug || '']} 入門コース`, excerpt: `${MODULE_NAMES[moduleSlug || '']}の基礎から応用まで学べるコースです。`, module: { slug: moduleSlug, name: MODULE_NAMES[moduleSlug || ''] }, difficulty: { slug: 'beginner', name: '初級' }, price: 0, duration: '4週間', created_at: new Date().toISOString() },
            { id: 2, title: `${MODULE_NAMES[moduleSlug || '']} 実践マスターコース`, excerpt: `現場で即戦力になる${MODULE_NAMES[moduleSlug || '']}の実践コース。`, module: { slug: moduleSlug, name: MODULE_NAMES[moduleSlug || ''] }, difficulty: { slug: 'intermediate', name: '中級' }, price: 29800, duration: '8週間', created_at: new Date().toISOString() },
          ]
        }
        if (knowledge.length === 0) {
          knowledge = [
            { id: 1, title: `${MODULE_NAMES[moduleSlug || '']} の基本概念`, slug: 'concept', excerpt: `${MODULE_NAMES[moduleSlug || '']}の基本概念を理解する。`, module: { slug: moduleSlug, name: MODULE_NAMES[moduleSlug || ''] }, type: 'concept', created_at: new Date().toISOString() },
            { id: 2, title: `${MODULE_NAMES[moduleSlug || '']} T-Code 一覧`, slug: 'tcode', excerpt: `よく使う${MODULE_NAMES[moduleSlug || '']}のT-Codeをまとめました。`, module: { slug: moduleSlug, name: MODULE_NAMES[moduleSlug || ''] }, type: 'tcode', created_at: new Date().toISOString() },
            { id: 3, title: `${MODULE_NAMES[moduleSlug || '']} よくある質問`, slug: 'faq', excerpt: `${MODULE_NAMES[moduleSlug || '']}に関するFAQ集。`, module: { slug: moduleSlug, name: MODULE_NAMES[moduleSlug || ''] }, type: 'faq', created_at: new Date().toISOString() },
          ]
        }
        const mod = modulesRes.success ? (modulesRes.data || []).find((m: any) => m.slug === moduleSlug) : null
        if (mod) mod.counts = { articles: articles.length || mod.article_count, courses: courses.length, knowledge: knowledge.length }
        setData({
          module: mod || { slug: moduleSlug, counts: { articles: articles.length, courses: courses.length, knowledge: knowledge.length } },
          articles,
          courses,
          knowledge,
        })
        return
      } catch {}

      // Ultimate fallback
      setData({
        module: { slug: moduleSlug, counts: { articles: 3, courses: 2, knowledge: 3 } },
        articles: [
          { id: 1, title: '【保存版】SAP用語集 — はじめての100単語', slug: 'sap-glossary', excerpt: 'SAPに出てくる専門用語を100個厳選して解説。', module: { slug: moduleSlug, name: MODULE_NAMES[moduleSlug || ''] }, difficulty: { slug: 'beginner', name: '初級' }, reading_time: 15, views: 12500, created_at: new Date().toISOString() },
          { id: 2, title: `${MODULE_NAMES[moduleSlug || '']}の基礎知識`, slug: 'basics', excerpt: `${MODULE_NAMES[moduleSlug || '']}の基本概念をわかりやすく解説します。`, module: { slug: moduleSlug, name: MODULE_NAMES[moduleSlug || ''] }, difficulty: { slug: 'beginner', name: '初級' }, reading_time: 10, views: 8300, created_at: new Date().toISOString() },
          { id: 3, title: `${MODULE_NAMES[moduleSlug || '']} 実践テクニック`, slug: 'techniques', excerpt: `現場で使える${MODULE_NAMES[moduleSlug || '']}の実践テクニックを紹介。`, module: { slug: moduleSlug, name: MODULE_NAMES[moduleSlug || ''] }, difficulty: { slug: 'intermediate', name: '中級' }, reading_time: 12, views: 5600, created_at: new Date().toISOString() },
        ],
        courses: [
          { id: 1, title: `${MODULE_NAMES[moduleSlug || '']} 入門コース`, excerpt: `${MODULE_NAMES[moduleSlug || '']}の基礎から応用まで学べるコースです。`, module: { slug: moduleSlug, name: MODULE_NAMES[moduleSlug || ''] }, difficulty: { slug: 'beginner', name: '初級' }, price: 0, duration: '4週間', created_at: new Date().toISOString() },
          { id: 2, title: `${MODULE_NAMES[moduleSlug || '']} 実践マスターコース`, excerpt: `現場で即戦力になる${MODULE_NAMES[moduleSlug || '']}の実践コース。`, module: { slug: moduleSlug, name: MODULE_NAMES[moduleSlug || ''] }, difficulty: { slug: 'intermediate', name: '中級' }, price: 29800, duration: '8週間', created_at: new Date().toISOString() },
        ],
        knowledge: [
          { id: 1, title: `${MODULE_NAMES[moduleSlug || '']} の基本概念`, slug: 'concept', excerpt: `${MODULE_NAMES[moduleSlug || '']}の基本概念を理解する。`, module: { slug: moduleSlug, name: MODULE_NAMES[moduleSlug || ''] }, type: 'concept', created_at: new Date().toISOString() },
          { id: 2, title: `${MODULE_NAMES[moduleSlug || '']} T-Code 一覧`, slug: 'tcode', excerpt: `よく使う${MODULE_NAMES[moduleSlug || '']}のT-Codeをまとめました。`, module: { slug: moduleSlug, name: MODULE_NAMES[moduleSlug || ''] }, type: 'tcode', created_at: new Date().toISOString() },
          { id: 3, title: `${MODULE_NAMES[moduleSlug || '']} よくある質問`, slug: 'faq', excerpt: `${MODULE_NAMES[moduleSlug || '']}に関するFAQ集。`, module: { slug: moduleSlug, name: MODULE_NAMES[moduleSlug || ''] }, type: 'faq', created_at: new Date().toISOString() },
        ],
      })
    }

    load().finally(() => setLoading(false))
  }, [moduleSlug])

  const counts = data?.module?.counts || {}
  const tabItems: { key: TabType; label: string; count: number }[] = [
    { key: 'articles', label: '記事', count: counts.articles || 0 },
    { key: 'courses', label: 'コース', count: counts.courses || 0 },
    { key: 'knowledge', label: 'ナレッジ', count: counts.knowledge || 0 },
  ]

  const filteredArticles = (data?.articles || []).filter((a: any) => {
    if (diff === 'all') return true
    return a.difficulty?.slug === diff
  })

  const isAdmin = typeof window !== 'undefined' && document.cookie.includes('aladdin_token')

  return (
    <>
      <div className="page-bg" />

      {/* Module Hero */}
      <section className="cat-hero">
        <div className="cat-hero-wrap">
          <div>
            <div className="crumb">
              <Link href="/">ホーム</Link>
              <span className="sep">›</span>
              <Link href="/modules">モジュール</Link>
              <span className="sep">›</span>
              <span className="now">{moduleSlug?.toUpperCase()} · {MODULE_NAMES[moduleSlug || '']}</span>
            </div>
            <div className="cat-title-row">
              <div className="cat-big-icon" style={{ background: color }}>{moduleSlug?.toUpperCase()}</div>
              <div>
                <h1>{MODULE_NAMES[moduleSlug || '']}</h1>
                <span className="code">{MODULE_EN[moduleSlug || '']} · {moduleSlug?.toUpperCase()}</span>
              </div>
            </div>
            <p className="cat-desc">
              {MODULE_NAMES[moduleSlug || '']}（{MODULE_EN[moduleSlug || '']}）の解説記事・コース・ナレッジをまとめました。
              パンダ先生がわかりやすく解説します。
            </p>
            <div className="cat-stats">
              <div className="stat"><div className="v">{counts.articles || '…'}<small style={{ fontSize: 13, color: 'var(--ink-2)' }}>本</small></div><div className="l">公開記事</div></div>
              <div className="stat"><div className="v">{counts.courses || 0}<small style={{ fontSize: 13, color: 'var(--ink-2)' }}>件</small></div><div className="l">コース</div></div>
              <div className="stat"><div className="v">{counts.knowledge || 0}<small style={{ fontSize: 13, color: 'var(--ink-2)' }}>件</small></div><div className="l">ナレッジ</div></div>
            </div>
          </div>
          <div className="cat-mascot">
            <svg viewBox="0 0 200 200" width="200" height="200">
              <circle cx="100" cy="100" r="80" fill="#fdfaf2" />
              <g><path d="M 68 76 Q 72 68 82 70 Q 92 72 92 84 Q 92 96 82 98 Q 70 98 66 90 Q 64 82 68 76 Z" fill="#1a1612" /><path d="M 132 76 Q 128 68 118 70 Q 108 72 108 84 Q 108 96 118 98 Q 130 98 134 90 Q 136 82 132 76 Z" fill="#1a1612" /></g>
              <circle cx="78" cy="86" r="5" fill="#fff" /><circle cx="78" cy="86" r="3.5" fill="#0e0a05" /><circle cx="122" cy="86" r="5" fill="#fff" /><circle cx="122" cy="86" r="3.5" fill="#0e0a05" />
              <ellipse cx="100" cy="110" rx="5" ry="3.5" fill="#1a1612" />
              <path d="M 92 118 Q 100 126 108 118" fill="none" stroke="#1a1612" strokeWidth="3" strokeLinecap="round" />
              <text x="160" y="50" fontSize="32" fill="#d97548" opacity="0.6" fontFamily="'Zen Maru Gothic', sans-serif">?</text>
              <text x="30" y="160" fontSize="26" fill="#1f4ea3" opacity="0.5" fontFamily="'Zen Maru Gothic', sans-serif">?</text>
            </svg>
          </div>
        </div>
      </section>

      <main className="cat-body">
        {/* Sidebar */}
        <aside className="cat-sidebar">
          <div className="filter-block">
            <h5>ナレッジタイプ</h5>
            <div className="filter-list">
              {tabItems.map(t => (
                <div key={t.key} className={`filter-item ${tab === t.key ? 'active' : ''}`}
                  onClick={() => setTab(t.key)}>
                  <span>{t.label}</span>
                  <span className="cnt">{t.count}</span>
                </div>
              ))}
            </div>
          </div>

          {tab === 'articles' && (
            <div className="filter-block">
              <h5>難易度で絞り込む</h5>
              <div className="filter-list">
                {[
                  { id: 'all', label: 'すべて', c: data?.articles?.length || 0 },
                  { id: 'beginner', label: '初級', c: data?.articles?.filter((a: any) => a.difficulty?.slug === 'beginner').length || 0 },
                  { id: 'intermediate', label: '中級', c: data?.articles?.filter((a: any) => a.difficulty?.slug === 'intermediate').length || 0 },
                  { id: 'advanced', label: '上級', c: data?.articles?.filter((a: any) => a.difficulty?.slug === 'advanced').length || 0 },
                ].map(d => (
                  <div key={d.id} className={`filter-item ${diff === d.id ? 'active' : ''}`} onClick={() => setDiff(d.id)}>
                    <span style={{ width: 14, height: 14, borderRadius: 4, background: d.id === 'beginner' ? 'var(--accent-soft)' : d.id === 'intermediate' ? 'var(--accent-2-soft)' : d.id === 'advanced' ? 'var(--rose-soft)' : 'var(--line-2)', flexShrink: 0, display: 'inline-block' }} />
                    <span>{d.label}</span>
                    <span className="cnt">{d.c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="filter-block" style={{ background: 'linear-gradient(135deg, var(--accent-soft), var(--bg-card))', borderColor: 'var(--accent)' }}>
            <h5 style={{ color: 'var(--accent-deep)' }}>📘 学習パス</h5>
            <div style={{ fontSize: 12.5, color: 'var(--ink-1)', lineHeight: 1.7, marginBottom: 10 }}>
              {moduleSlug?.toUpperCase()} を体系的に学ぶなら、パスから始めよう。
            </div>
            <Link href="/#paths" className="btn sm accent" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
              学習パスを見る →
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <div className="cat-content">
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>読み込み中...</div>
          ) : !data ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>データがありません。</div>
          ) : tab === 'articles' ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <div className="count"><strong>{filteredArticles.length}</strong> 件 の記事</div>
                {isAdmin && <Link href="/admin/articles" style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--accent-deep)' }}>⚙ 記事を管理する →</Link>}
              </div>
              <div className="card-grid">
                {filteredArticles.length === 0 && (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: 'var(--ink-3)' }}>まだ記事がありません。</div>
                )}
                {filteredArticles.map((a: any) => (
                  <Link key={a.id} className="art-card" href={`/article/${a.id}/${a.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="cover">
                      <svg viewBox="0 0 160 90" style={{ width: '100%', height: '100%' }}>
                        <rect width="160" height="90" fill={color + '22'} />
                        <text x="80" y="52" fontSize="28" fontWeight="800" fill={color} textAnchor="middle" fontFamily="'Zen Maru Gothic', sans-serif">{moduleSlug?.toUpperCase()}</text>
                      </svg>
                    </div>
                    <div className="body">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontSize: 11, color: 'var(--ink-3)' }}>
                        <span className={`tag-mod ${moduleSlug}`}>{moduleSlug?.toUpperCase()}</span>
                        {a.difficulty && <span className={`tag-diff l${a.difficulty.slug === 'beginner' ? 1 : a.difficulty.slug === 'intermediate' ? 2 : 3}`}>
                          {a.difficulty.slug === 'beginner' ? '初級' : a.difficulty.slug === 'intermediate' ? '中級' : '上級'}
                        </span>}
                        <span>· {new Date(a.created_at).toLocaleDateString('ja-JP')}</span>
                      </div>
                      <h3>{a.title}</h3>
                      <p className="excerpt" style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.excerpt}</p>
                      <div className="foot">
                        <span>📖 {a.reading_time} min</span>
                        <span>👁 {a.views}</span>
                        <span style={{ marginLeft: 'auto', color: 'var(--accent-deep)', fontWeight: 700 }}>読む →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : tab === 'courses' ? (
            <>
              {isAdmin && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                  <Link href="/admin/courses" style={{ fontSize: 11.5, color: 'var(--accent-deep)' }}>⚙ コースを管理する →</Link>
                </div>
              )}
              <div className="card-grid">
                {(!data.courses || data.courses.length === 0) && (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: 'var(--ink-3)' }}>まだコースがありません。</div>
                )}
                {data.courses?.map((c: any) => (
                  <Link key={c.id} href={`/course/${c.id}`} className="art-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="cover">
                      <svg viewBox="0 0 160 90" style={{ width: '100%', height: '100%' }}>
                        <rect width="160" height="90" fill={color + '22'} />
                        <text x="80" y="52" fontSize="28" fontWeight="800" fill={color} textAnchor="middle" fontFamily="'Zen Maru Gothic', sans-serif">{moduleSlug?.toUpperCase()}</text>
                      </svg>
                    </div>
                    <div className="body">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontSize: 11, color: 'var(--ink-3)' }}>
                        <span className={`tag-mod ${moduleSlug}`}>{moduleSlug?.toUpperCase()}</span>
                        {c.difficulty?.slug && <span className={`tag-diff l${c.difficulty.slug === 'beginner' ? 1 : c.difficulty.slug === 'intermediate' ? 2 : 3}`}>
                          {c.difficulty.slug === 'beginner' ? '初級' : c.difficulty.slug === 'intermediate' ? '中級' : '上級'}
                        </span>}
                        {c.created_at && <span>· {new Date(c.created_at).toLocaleDateString('ja-JP')}</span>}
                      </div>
                      <h3>{c.title}</h3>
                      {c.excerpt && <p className="excerpt" style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.7 }}>{c.excerpt}</p>}
                      <div className="foot">
                        {c.duration && <span>⏱ {c.duration}</span>}
                        {c.price > 0 ? <span style={{ fontWeight: 700, color: 'var(--accent-deep)' }}>¥{c.price.toLocaleString()}</span> : <span style={{ color: 'var(--accent)' }}>無料</span>}
                        <span style={{ marginLeft: 'auto', color: 'var(--accent-deep)', fontWeight: 700 }}>詳細 →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <>
              {isAdmin && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                  <Link href="/admin/knowledge" style={{ fontSize: 11.5, color: 'var(--accent-deep)' }}>⚙ ナレッジを管理する →</Link>
                </div>
              )}
              <div className="card-grid">
                {(!data.knowledge || data.knowledge.length === 0) && (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: 'var(--ink-3)' }}>まだナレッジがありません。</div>
                )}
                {data.knowledge?.map((k: any) => (
                  <Link key={k.id} href={`/knowledge/${k.id}/${k.slug}`} className="art-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="cover">
                      <svg viewBox="0 0 160 90" style={{ width: '100%', height: '100%' }}>
                        <rect width="160" height="90" fill={color + '22'} />
                        <text x="80" y="52" fontSize="28" fontWeight="800" fill={color} textAnchor="middle" fontFamily="'Zen Maru Gothic', sans-serif">{moduleSlug?.toUpperCase()}</text>
                      </svg>
                    </div>
                    <div className="body">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontSize: 11, color: 'var(--ink-3)' }}>
                        <span className={`tag-mod ${moduleSlug}`}>{moduleSlug?.toUpperCase()}</span>
                        {k.type && <span style={{ fontSize: 10.5, padding: '1px 6px', borderRadius: 4, background: 'var(--bg-tint)', color: 'var(--ink-2)', fontWeight: 600 }}>{k.type}</span>}
                        {k.created_at && <span>· {new Date(k.created_at).toLocaleDateString('ja-JP')}</span>}
                      </div>
                      <h3>{k.title}</h3>
                      {k.excerpt && <p className="excerpt" style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.7 }}>{k.excerpt}</p>}
                      <div className="foot">
                        <span style={{ color: 'var(--ink-3)' }}>{new Date(k.created_at).toLocaleDateString('ja-JP')}</span>
                        <span style={{ marginLeft: 'auto', color: 'var(--accent-deep)', fontWeight: 700 }}>読む →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  )
}
