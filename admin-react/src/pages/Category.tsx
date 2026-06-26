import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Seo from '../components/layout/Seo'
import SiteHeader from '../components/layout/Header'
import SiteFooter from '../components/layout/Footer'
import FloatingPanda from '../components/layout/FloatingPanda'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'
import { SAP_MODULES } from '../types'

const BASE_URL = 'https://sap-navi.aladdin-techec.com/sap'

const MODULE_COLORS: Record<string, string> = {
  fi: '#2f6d44', co: '#2641a1', mm: '#a25411', sd: '#b62a4a',
  pp: '#4828a8', hr: '#8a6212', abap: '#1f6f6f', basis: '#4a432d', s4: '#1864a3',
}

type TabType = 'articles' | 'courses' | 'knowledge'

export default function CategoryPage() {
  const { module: moduleSlug } = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<TabType>('articles')
  const [diff, setDiff] = useState('all')
  const { settings } = useTheme()

  const { user } = useAuth()
  const isAdmin = user?.roles?.includes('administrator')
  const activeModule = SAP_MODULES.find(m => m.slug === moduleSlug)
  const color = MODULE_COLORS[moduleSlug || 'fi'] || '#5a9d6e'

  useEffect(() => {
    if (!moduleSlug) return
    setLoading(true)
    api.getModuleContent(moduleSlug).then(res => {
      if (res.success) setData(res.data)
    }).catch(() => {}).finally(() => setLoading(false))
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

  return (
    <>
      <Seo
        title={activeModule ? `${activeModule.name_ja} (${activeModule.code}) — 記事・コース一覧` : 'モジュール詳細'}
        description={activeModule
          ? `${activeModule.name_ja}（${activeModule.name_en}）の解説記事・コース・ナレッジをまとめました。${activeModule.description} パンダ先生がわかりやすく解説。`
          : 'SAP モジュール別の記事一覧ページです。'}
        path={`/category/${moduleSlug}`}
        breadcrumbs={[
          { name: 'ホーム', path: '/' },
          { name: 'モジュール', path: '/modules' },
          { name: activeModule?.name_ja || moduleSlug || '', path: `/category/${moduleSlug}` },
        ]}
        image={activeModule ? `${BASE_URL}/og-${moduleSlug}.png` : undefined}
      />
      <div className="page-bg" />
      <SiteHeader active="modules" />

      {/* Module Hero */}
      <section className="cat-hero">
        <div className="cat-hero-wrap">
          <div>
            <div className="crumb">
              <Link to="/">ホーム</Link>
              <span className="sep">›</span>
              <Link to="/modules">モジュール</Link>
              <span className="sep">›</span>
              <span className="now">{activeModule?.code} · {activeModule?.name_ja}</span>
            </div>
            <div className="cat-title-row">
              <div className="cat-big-icon" style={{ background: color }}>{activeModule?.code}</div>
              <div>
                <h1>{activeModule?.name_ja}</h1>
                <span className="code">{activeModule?.name_en} · {activeModule?.code}</span>
              </div>
            </div>
            <p className="cat-desc">
              {activeModule?.description}
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
              <text x="160" y="50" fontSize="32" fill="#d97548" opacity="0.6" fontFamily="Zen Maru Gothic">?</text>
              <text x="30" y="160" fontSize="26" fill="#1f4ea3" opacity="0.5" fontFamily="Zen Maru Gothic">?</text>
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
                    <span className="swatch" style={{
                      width: 14, height: 14, borderRadius: 4,
                      background: d.id === 'beginner' ? 'var(--accent-soft)' : d.id === 'intermediate' ? 'var(--accent-2-soft)' : d.id === 'advanced' ? 'var(--rose-soft)' : 'var(--line-2)',
                      flexShrink: 0,
                    }} />
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
              {activeModule?.code} を体系的に学ぶなら、パスから始めよう。
            </div>
            <Link to="/#paths" className="btn sm accent" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
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
              <div className="cat-toolbar" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <div className="count"><strong>{filteredArticles.length}</strong> 件 の記事</div>
              </div>
              <div className="card-grid">
                {filteredArticles.length === 0 && (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: 'var(--ink-3)' }}>まだ記事がありません。</div>
                )}
                {filteredArticles.map((a: any) => (
                  <Link key={a.id} className="art-card" to={`/article/${a.id}/${a.slug}`}>
                    <div className="cover">
                      <svg viewBox="0 0 160 90" style={{ width: '100%', height: '100%' }}>
                        <rect width="160" height="90" fill={color + '22'} />
                        <text x="80" y="52" fontSize="28" fontWeight="800" fill={color} textAnchor="middle" fontFamily="Zen Maru Gothic">{activeModule?.code}</text>
                      </svg>
                    </div>
                    <div className="body">
                      <div className="tags-row" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontSize: 11, color: 'var(--ink-3)' }}>
                        <span className={`tag-mod ${moduleSlug}`}>{activeModule?.code}</span>
                        {a.difficulty && <span className={`tag-diff l${a.difficulty.slug === 'beginner' ? 1 : a.difficulty.slug === 'intermediate' ? 2 : 3}`}>
                          {a.difficulty.slug === 'beginner' ? '初級' : a.difficulty.slug === 'intermediate' ? '中級' : '上級'}
                        </span>}
                        <span>· {new Date(a.created_at).toLocaleDateString('ja-JP')}</span>
                      </div>
                      <h3>{a.title}</h3>
                      <p className="excerpt">{a.excerpt}</p>
                      <div className="foot">
                        <span>📖 {a.reading_time} min</span>
                        <span>👁 {a.views}</span>
                        <span className="read" style={{ marginLeft: 'auto', color: 'var(--accent-deep)', fontWeight: 700 }}>読む →</span>
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
                  <Link to="/admin/courses" className="btn sm ghost" style={{ textDecoration: 'none', fontSize: 11.5, color: 'var(--accent-deep)' }}>
                    ⚙ コースを管理する →
                  </Link>
                </div>
              )}
              <div className="card-grid">
                {(!data.courses || data.courses.length === 0) && (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: 'var(--ink-3)' }}>まだコースがありません。</div>
                )}
                {data.courses?.map((c: any) => (
                  <Link key={c.id} to={`/course/${c.id}`} className="art-card">
                    <div className="cover">
                      <svg viewBox="0 0 160 90" style={{ width: '100%', height: '100%' }}>
                        <rect width="160" height="90" fill={color + '22'} />
                        <text x="80" y="52" fontSize="28" fontWeight="800" fill={color} textAnchor="middle" fontFamily="Zen Maru Gothic">{activeModule?.code}</text>
                      </svg>
                    </div>
                    <div className="body">
                      <div className="tags-row" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontSize: 11, color: 'var(--ink-3)' }}>
                        <span className={`tag-mod ${moduleSlug}`}>{activeModule?.code}</span>
                        {c.difficulty?.slug && (
                          <span className={`tag-diff l${c.difficulty.slug === 'beginner' ? 1 : c.difficulty.slug === 'intermediate' ? 2 : 3}`}>
                            {c.difficulty.slug === 'beginner' ? '初級' : c.difficulty.slug === 'intermediate' ? '中級' : '上級'}
                          </span>
                        )}
                        {c.created_at && <span>· {new Date(c.created_at).toLocaleDateString('ja-JP')}</span>}
                      </div>
                      <h3>{c.title}</h3>
                      {c.excerpt && <p className="excerpt">{c.excerpt}</p>}
                      <div className="foot">
                        {c.duration && <span>⏱ {c.duration}</span>}
                        {c.price > 0 && <span style={{ fontWeight: 700, color: 'var(--accent-deep)' }}>¥{c.price.toLocaleString()}</span>}
                        {c.price === 0 && <span style={{ color: 'var(--accent)' }}>無料</span>}
                        <span className="read" style={{ marginLeft: 'auto', color: 'var(--accent-deep)', fontWeight: 700 }}>詳細 →</span>
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
                  <Link to="/admin/knowledge" className="btn sm ghost" style={{ textDecoration: 'none', fontSize: 11.5, color: 'var(--accent-deep)' }}>
                    ⚙ ナレッジを管理する →
                  </Link>
                </div>
              )}
              <div className="card-grid">
                {(!data.knowledge || data.knowledge.length === 0) && (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: 'var(--ink-3)' }}>まだナレッジがありません。</div>
                )}
                {data.knowledge?.map((k: any) => (
                  <Link key={k.id} to={`/knowledge/${k.id}/${k.slug}`} className="art-card">
                    <div className="cover">
                      <svg viewBox="0 0 160 90" style={{ width: '100%', height: '100%' }}>
                        <rect width="160" height="90" fill={color + '22'} />
                        <text x="80" y="52" fontSize="28" fontWeight="800" fill={color} textAnchor="middle" fontFamily="Zen Maru Gothic">{activeModule?.code}</text>
                      </svg>
                    </div>
                    <div className="body">
                      <div className="tags-row" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontSize: 11, color: 'var(--ink-3)' }}>
                        <span className={`tag-mod ${moduleSlug}`}>{activeModule?.code}</span>
                        {k.type && <span style={{ fontSize: 10.5, padding: '1px 6px', borderRadius: 4, background: 'var(--bg-tint)', color: 'var(--ink-2)', fontWeight: 600 }}>{k.type}</span>}
                        {k.created_at && <span>· {new Date(k.created_at).toLocaleDateString('ja-JP')}</span>}
                      </div>
                      <h3>{k.title}</h3>
                      {k.excerpt && <p className="excerpt">{k.excerpt}</p>}
                      <div className="foot">
                        <span style={{ color: 'var(--ink-3)' }}>{new Date(k.created_at).toLocaleDateString('ja-JP')}</span>
                        <span className="read" style={{ marginLeft: 'auto', color: 'var(--accent-deep)', fontWeight: 700 }}>読む →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <SiteFooter />
      {settings.showFloatingPanda && <FloatingPanda />}
    </>
  )
}
