// ===========================================================
// CoursePage — コース詳細画面 /course/:id
// ===========================================================

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
import type { Course } from '../types'

export default function CoursePage() {
  const { id } = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [lessonPage, setLessonPage] = useState(1)
  const [relatedCourses, setRelatedCourses] = useState<any[]>([])
  const { settings } = useTheme()
  const { user } = useAuth()
  const isAdmin = user?.roles?.includes('administrator')
  const perPage = 20

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([
      api.getCourse(parseInt(id)).then(res => { if (res.success) setCourse(res.data) }),
      api.client.get(`/courses/${id}/lessons`).then(({data}) => {
        if (data.success) setLessons(data.data || [])
      }),
    ]).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!course?.module?.slug) return
    api.client.get('/courses', { params: { module: course.module.slug, per_page: 6 } })
      .then(({data}) => {
        if (data.success) setRelatedCourses((data.data || []).filter((c: any) => c.id !== parseInt(id!)))
      }).catch(() => {})
  }, [course])

  const totalPages = Math.ceil(lessons.length / perPage)
  const paginatedLessons = lessons.slice((lessonPage - 1) * perPage, lessonPage * perPage)

  const activeModule = SAP_MODULES.find(m => m.slug === course?.module?.slug)
  const color = course?.module?.slug
    ? (activeModule?.color || '#5a9d6e')
    : '#5a9d6e'

  const modName = course?.module?.name || activeModule?.name_ja || ''
  const modSlug = course?.module?.slug || ''

  if (loading) return (
    <><Seo title="コースを読み込み中" path={`/course/${id}`} /><div className="page-bg" /><SiteHeader />
    <main style={{ textAlign: 'center', padding: 80, color: 'var(--ink-3)' }}>読み込み中...</main>
    <SiteFooter /></>
  )

  if (!course) return (
    <><Seo title="コースが見つかりません" description="お探しのコースは存在しないか、削除された可能性があります。" path={`/course/${id}`} /><div className="page-bg" /><SiteHeader />
    <main style={{ textAlign: 'center', padding: 80 }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🎋</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink-0)' }}>コースが見つかりません</h2>
      <Link to="/modules" className="btn" style={{ marginTop: 20, display: 'inline-flex', textDecoration: 'none' }}>モジュール一覧に戻る</Link>
    </main>
    <SiteFooter /></>
  )

  return (
    <>
      <Seo
        title={`${course.title} — SAPコース詳細`}
        description={course.excerpt || `${course.title}。${modName}分野のSAP学習コース。${course.price > 0 ? `¥${course.price.toLocaleString()}` : '無料'}・${course.duration || ''}・${lessons.length}レッスン。`}
        path={`/course/${id}`}
        type="article"
        breadcrumbs={[
          { name: 'ホーム', path: '/' },
          { name: 'モジュール', path: '/modules' },
          ...(modSlug ? [{ name: modName, path: `/category/${modSlug}` }] : []),
          { name: course.title, path: `/course/${id}` },
        ]}
      />
      <div className="page-bg" /><SiteHeader />
      <main style={{ position: 'relative', zIndex: 2 }}>
        {/* Hero */}
        <section className="cat-hero">
          <div className="cat-hero-wrap">
            <div>
              <div className="crumb">
                <Link to="/">ホーム</Link>
                <span className="sep">›</span>
                <Link to="/modules">モジュール</Link>
                {modSlug && <><span className="sep">›</span>
                  <Link to={`/category/${modSlug}`} style={{ color: 'var(--ink-2)' }}>{modName}</Link></>}
                <span className="sep">›</span>
                <span className="now">{course.title}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, marginBottom: 6, flexWrap: 'wrap' }}>
                {modSlug && <span className={`tag-mod ${modSlug}`}>{modSlug.toUpperCase()}</span>}
                {course.difficulty && (
                  <span className={`tag-diff l${course.difficulty.slug === 'beginner' ? 1 : course.difficulty.slug === 'intermediate' ? 2 : 3}`}>
                    {course.difficulty.name || (course.difficulty.slug === 'beginner' ? '初級' : course.difficulty.slug === 'intermediate' ? '中級' : '上級')}
                  </span>
                )}
                {course.price > 0
                  ? <span style={{ fontWeight: 700, color: 'var(--accent-deep)' }}>¥{course.price.toLocaleString()}</span>
                  : <span style={{ color: 'var(--accent)' }}>無料</span>
                }
                {course.duration && <span style={{ color: 'var(--ink-3)' }}>⏱ {course.duration}</span>}
                <span style={{ color: 'var(--ink-3)' }}>📖 {lessons.length}レッスン</span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(26px, 3vw, 36px)', color: 'var(--ink-0)', margin: '0 0 8px' }}>{course.title}</h1>
              {course.excerpt && <p style={{ fontSize: 14.5, color: 'var(--ink-2)', lineHeight: 1.8, maxWidth: 600 }}>{course.excerpt}</p>}
            </div>
            <div className="cat-mascot">
              <svg viewBox="-4 -8 108 128" width="180" height="200">
                {/* graduation cap */}
                <path d="M 22 40 L 50 24 L 78 40 L 50 56 Z" fill="#2a2317" />
                <path d="M 20 42 L 20 50 Q 50 66 80 50 L 80 42" fill="none" stroke="#2a2317" strokeWidth="2.5" />
                <rect x="44" y="55" width="12" height="8" rx="2" fill="#d97548" />
                <line x1="50" y1="63" x2="50" y2="70" stroke="#d97548" strokeWidth="2" strokeLinecap="round" />
                {/* face */}
                <circle cx="50" cy="52" r="46" fill="#fdfaf2" />
                {/* ears */}
                <ellipse cx="22" cy="18" rx="13" ry="12" fill="#1a1612" />
                <ellipse cx="78" cy="18" rx="13" ry="12" fill="#1a1612" />
                {/* eye patches */}
                <path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" />
                <path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" />
                {/* eyes */}
                <circle cx="30" cy="44" r="3.4" fill="#fff" /><circle cx="30" cy="44" r="2.4" fill="#0e0a05" />
                <circle cx="70" cy="44" r="3.4" fill="#fff" /><circle cx="70" cy="44" r="2.4" fill="#0e0a05" />
                {/* blush */}
                <ellipse cx="18" cy="64" rx="5.5" ry="3" fill="#f4b8c4" opacity="0.7" />
                <ellipse cx="82" cy="64" rx="5.5" ry="3" fill="#f4b8c4" opacity="0.7" />
                {/* nose */}
                <ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" />
                {/* mouth */}
                <path d="M 50 64 L 50 67" stroke="#1a1612" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M 43 70 Q 50 74 57 70" fill="none" stroke="#1a1612" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="art-body-wrap" style={{ gridTemplateColumns: '1fr 220px' }}>
          <div className="art-content" style={{ minHeight: 200 }}>
            {course.content ? (
              <div dangerouslySetInnerHTML={{ __html: course.content }} />
            ) : lessons.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎋</div>
                <p>コンテンツは準備中です。</p>
              </div>
            ) : null}

            {/* Lessons */}
            {lessons.length > 0 && (
              <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1.5px dashed var(--line-2)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--ink-0)', margin: '0 0 4px' }}>
                  レッスン一覧 <span style={{ fontSize: 14, color: 'var(--ink-3)', fontWeight: 500 }}>全{lessons.length}レッスン</span>
                </h2>
                <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: '0 0 18px' }}>コースの各レッスンを順番に学習しましょう。</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {paginatedLessons.map((l, i) => (
                    <Link key={l.id} to={`/lesson/${l.id}`} style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '13px 18px', borderRadius: 'var(--r-lg)',
                      border: '1.5px solid var(--line-1)',
                      background: 'var(--bg-card)',
                      textDecoration: 'none', transition: 'all .15s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-soft)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line-1)'; e.currentTarget.style.background = 'var(--bg-card)' }}
                    >
                      <span style={{
                        width: 30, height: 30, borderRadius: '50%',
                        background: 'var(--accent)', color: 'white',
                        fontSize: 12, fontWeight: 700, display: 'grid', placeItems: 'center', flexShrink: 0,
                      }}>{l.order || i + 1}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-0)' }}>{l.title}</div>
                        {l.excerpt && <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.excerpt}</div>}
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>{l.time}</span>
                      <span style={{ fontSize: 18, color: 'var(--accent)' }}>→</span>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20 }}>
                    <button className="btn sm" disabled={lessonPage <= 1}
                      onClick={() => setLessonPage(p => p - 1)}
                      style={{ opacity: lessonPage <= 1 ? 0.4 : 1, cursor: lessonPage <= 1 ? 'not-allowed' : 'pointer' }}>
                      ← 前へ
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button key={p}
                        onClick={() => setLessonPage(p)}
                        className="btn sm"
                        style={{
                          minWidth: 36, justifyContent: 'center',
                          background: p === lessonPage ? 'var(--accent)' : 'var(--bg-card)',
                          color: p === lessonPage ? 'white' : 'var(--ink-1)',
                          borderColor: p === lessonPage ? 'var(--accent)' : 'var(--line-2)',
                        }}>
                        {p}
                      </button>
                    ))}
                    <button className="btn sm" disabled={lessonPage >= totalPages}
                      onClick={() => setLessonPage(p => p + 1)}
                      style={{ opacity: lessonPage >= totalPages ? 0.4 : 1, cursor: lessonPage >= totalPages ? 'not-allowed' : 'pointer' }}>
                      次へ →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <aside className="art-side">
            <div className="toc-card">
              <h5>📌 詳細</h5>
              <div style={{ fontSize: 13, color: 'var(--ink-1)', lineHeight: 1.8 }}>
                {course.duration && <div>⏱ {course.duration}</div>}
                {course.price > 0
                  ? <div>💴 ¥{course.price.toLocaleString()}</div>
                  : <div>🎉 無料</div>
                }
                <div>📅 {new Date(course.created_at).toLocaleDateString('ja-JP')}</div>
              </div>
            </div>
            {relatedCourses.length > 0 && (
              <div className="toc-card">
                <h5>📚 関連コース</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {relatedCourses.map(rc => (
                    <Link key={rc.id} to={`/course/${rc.id}`} style={{
                      display: 'block', padding: '7px 10px', borderRadius: 'var(--r-sm)',
                      fontSize: 12.5, color: 'var(--ink-1)', textDecoration: 'none',
                      background: 'var(--bg-1)', transition: 'background .12s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-soft)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-1)'}
                    >
                      <div style={{ fontWeight: 600, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rc.title}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>
                        {rc.duration ? `⏱ ${rc.duration}` : ''}
                        {rc.price > 0 ? ` · ¥${rc.price.toLocaleString()}` : rc.price === 0 ? ' · 無料' : ''}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {modSlug && <div className="toc-card">
              <h5>📂 モジュール</h5>
              <Link to={`/category/${modSlug}`} style={{ fontSize: 13, color: 'var(--accent-deep)', textDecoration: 'none', display: 'block', padding: '4px 0' }}>
                ← {modName}に戻る
              </Link>
            </div>}
            {isAdmin && (
              <div className="toc-card">
                <h5>⚙ 管理</h5>
                <Link to={`/admin/courses/${course.id}/edit`} className="btn sm" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', fontSize: 11.5 }}>
                  このコースを編集
                </Link>
              </div>
            )}
          </aside>
        </div>
      </main>
      <SiteFooter />
      {settings.showFloatingPanda && <FloatingPanda />}
    </>
  )
}
