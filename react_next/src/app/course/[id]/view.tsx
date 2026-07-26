'use client'
// ===========================================================
// CoursePage — コース詳細画面 /course/:id
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
  fi: 'FI · 財務会計', co: 'CO · 管理会計', mm: 'MM · 購買・在庫',
  sd: 'SD · 販売管理', pp: 'PP · 生産計画', hr: 'HR · 人事管理',
  abap: 'ABAP · 開発言語', basis: 'Basis · 基盤管理', s4: 'S/4 · S/4HANA',
}

export default function CoursePage() {
  const params = useParams()
  const id = params?.id as string | undefined

  const [course, setCourse] = useState<any>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [lessonPage, setLessonPage] = useState(1)
  const [relatedCourses, setRelatedCourses] = useState<any[]>([])
  const perPage = 20

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([
      fetch(`${PUBLIC_API}/courses/${id}`).then(r => r.json()).then(d => {
        if (d.success && d.data) setCourse(d.data)
        else setCourse({
          id: parseInt(id || '0'), title: 'SAP財務会計(FI) 入門コース',
          excerpt: '財務会計の基本から決算処理までを体系的に学ぶコースです。パンダ先生が丁寧に解説します。',
          content: '<h2 id="s1">コース概要</h2><p>SAP FIモジュールの基礎を学ぶコースです。財務会計の基本概念から日常業務、決算までをカバーします。</p><h2 id="s2">学習目標</h2><ul><li>FIモジュールの全体像を理解する</li><li>基本マスタデータの管理方法を学ぶ</li><li>日常仕訳から決算までの流れを把握する</li></ul>',
          module: { slug: 'fi', name: '財務会計' },
          difficulty: { slug: 'beginner', name: '初級' },
          price: 0, duration: '4週間',
          created_at: new Date().toISOString(),
        })
      }).catch(() => setCourse({
        id: parseInt(id || '0'), title: 'SAP財務会計(FI) 入門コース',
        excerpt: '財務会計の基本から決算処理までを体系的に学ぶコースです。パンダ先生が丁寧に解説します。',
        content: '<h2 id="s1">コース概要</h2><p>SAP FIモジュールの基礎を学ぶコースです。財務会計の基本概念から日常業務、決算までをカバーします。</p><h2 id="s2">学習目標</h2><ul><li>FIモジュールの全体像を理解する</li><li>基本マスタデータの管理方法を学ぶ</li><li>日常仕訳から決算までの流れを把握する</li></ul>',
        module: { slug: 'fi', name: '財務会計' },
        difficulty: { slug: 'beginner', name: '初級' },
        price: 0, duration: '4週間',
        created_at: new Date().toISOString(),
      })),
      fetch(`${PUBLIC_API}/courses/${id}/lessons`).then(r => r.json()).then(d => {
        if (d.success) setLessons(d.data || [])
        else setLessons([
          { id: 101, title: 'SAPとは？FIモジュールの全体像', slug: 'sap-fi-overview', time: '20 min', excerpt: 'SAPの基本とFIモジュールの役割を理解します。' },
          { id: 102, title: '会社コードと財務会計組織', slug: 'company-code', time: '25 min', excerpt: '会社コードの設定と組織構造を学びます。' },
          { id: 103, title: '基本マスタデータの管理', slug: 'master-data', time: '30 min', excerpt: '勘定科目マスタ、得意先マスタ、仕入先マスタを管理します。' },
          { id: 104, title: '日常仕訳入力の実践', slug: 'daily-journal', time: '35 min', excerpt: 'FB50での仕訳入力を実践形式で学びます。' },
          { id: 105, title: '買掛金・売掛金管理', slug: 'ar-ap', time: '30 min', excerpt: 'F-43/F-28での入金・支払処理を学びます。' },
        ])
      }).catch(() => setLessons([
        { id: 101, title: 'SAPとは？FIモジュールの全体像', slug: 'sap-fi-overview', time: '20 min', excerpt: 'SAPの基本とFIモジュールの役割を理解します。' },
        { id: 102, title: '会社コードと財務会計組織', slug: 'company-code', time: '25 min', excerpt: '会社コードの設定と組織構造を学びます。' },
        { id: 103, title: '基本マスタデータの管理', slug: 'master-data', time: '30 min', excerpt: '勘定科目マスタ、得意先マスタ、仕入先マスタを管理します。' },
        { id: 104, title: '日常仕訳入力の実践', slug: 'daily-journal', time: '35 min', excerpt: 'FB50での仕訳入力を実践形式で学びます。' },
        { id: 105, title: '買掛金・売掛金管理', slug: 'ar-ap', time: '30 min', excerpt: 'F-43/F-28での入金・支払処理を学びます。' },
      ])),
    ]).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!course?.module?.slug) return
    fetch(`${PUBLIC_API}/courses?module=${course.module.slug}&per_page=6`).then(r => r.json()).then(d => {
      if (d.success) setRelatedCourses((d.data || []).filter((c: any) => c.id !== parseInt(id!)))
    }).catch(() => {})
  }, [course, id])

  const modSlug = course?.module?.slug || ''
  const color = MODULE_COLORS[modSlug] || '#5a9d6e'
  const modName = MODULE_NAMES[modSlug] || modSlug.toUpperCase()

  const totalPages = Math.ceil(lessons.length / perPage)
  const paginatedLessons = lessons.slice((lessonPage - 1) * perPage, lessonPage * perPage)

  if (loading) return (
    <><div className="page-bg" /><div style={{ textAlign: 'center', padding: 80, color: 'var(--ink-3)' }}>読み込み中...</div></>
  )

  if (!course) return (
    <><div className="page-bg" />
    <div style={{ textAlign: 'center', padding: 80 }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🎋</div>
      <h2 style={{ fontFamily: "'Zen Maru Gothic', system-ui, sans-serif", fontSize: 22, color: 'var(--ink-0)' }}>コースが見つかりません</h2>
      <p style={{ color: 'var(--ink-2)', margin: '10px 0 20px' }}>お探しのコースは存在しないか、削除された可能性があります。</p>
      <Link href="/modules" className="btn" style={{ marginTop: 20, display: 'inline-flex', textDecoration: 'none' }}>モジュール一覧に戻る</Link>
    </div></>
  )

  return (
    <>
      <div className="page-bg" />

      {/* Hero */}
      <section className="cat-hero">
        <div className="cat-hero-wrap">
          <div>
            <div className="crumb">
              <Link href="/">ホーム</Link><span className="sep">›</span>
              <Link href="/modules">モジュール</Link>
              {modSlug && <><span className="sep">›</span><Link href={`/category/${modSlug}`} style={{ color: 'var(--ink-2)' }}>{modName.split('·')[0]?.trim() || modSlug.toUpperCase()}</Link></>}
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
            <h1 style={{ fontFamily: "'Zen Maru Gothic', system-ui, sans-serif", fontWeight: 700, fontSize: 'clamp(26px, 3vw, 36px)', color: 'var(--ink-0)', margin: '0 0 8px' }}>{course.title}</h1>
            {course.excerpt && <p style={{ fontSize: 14.5, color: 'var(--ink-2)', lineHeight: 1.8, maxWidth: 600 }}>{course.excerpt}</p>}
          </div>
          <div className="cat-mascot">
            <svg viewBox="-4 -8 108 128" width="180" height="200">
              <path d="M 22 40 L 50 24 L 78 40 L 50 56 Z" fill="#2a2317" />
              <path d="M 20 42 L 20 50 Q 50 66 80 50 L 80 42" fill="none" stroke="#2a2317" strokeWidth="2.5" />
              <rect x="44" y="55" width="12" height="8" rx="2" fill="#d97548" />
              <line x1="50" y1="63" x2="50" y2="70" stroke="#d97548" strokeWidth="2" strokeLinecap="round" />
              <circle cx="50" cy="52" r="46" fill="#fdfaf2" />
              <ellipse cx="22" cy="18" rx="13" ry="12" fill="#1a1612" />
              <ellipse cx="78" cy="18" rx="13" ry="12" fill="#1a1612" />
              <path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" />
              <path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" />
              <circle cx="30" cy="44" r="3.4" fill="#fff" /><circle cx="30" cy="44" r="2.4" fill="#0e0a05" />
              <circle cx="70" cy="44" r="3.4" fill="#fff" /><circle cx="70" cy="44" r="2.4" fill="#0e0a05" />
              <ellipse cx="18" cy="64" rx="5.5" ry="3" fill="#f4b8c4" opacity="0.7" />
              <ellipse cx="82" cy="64" rx="5.5" ry="3" fill="#f4b8c4" opacity="0.7" />
              <ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" />
              <path d="M 50 64 L 50 67" stroke="#1a1612" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M 43 70 Q 50 74 57 70" fill="none" stroke="#1a1612" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="art-body-wrap" style={{ gridTemplateColumns: '1fr 220px', maxWidth: 1280 }}>
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
              <h2 style={{ fontFamily: "'Zen Maru Gothic', system-ui, sans-serif", fontWeight: 700, fontSize: 22, color: 'var(--ink-0)', margin: '0 0 4px' }}>
                レッスン一覧 <span style={{ fontSize: 14, color: 'var(--ink-3)', fontWeight: 500 }}>全{lessons.length}レッスン</span>
              </h2>
              <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: '0 0 18px' }}>コースの各レッスンを順番に学習しましょう。</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {paginatedLessons.map((l: any, i: number) => (
                  <Link key={l.id} href={`/lesson/${l.id}/${l.slug || ''}`} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '13px 18px', borderRadius: 'var(--r-lg)',
                    border: '1.5px solid var(--line-1)',
                    background: 'var(--bg-card)',
                    textDecoration: 'none', transition: 'all .15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-soft)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line-1)'; e.currentTarget.style.background = 'var(--bg-card)' }}
                  >
                    <span style={{ width: 30, height: 30, borderRadius: '50%', background: color, color: 'white', fontSize: 12, fontWeight: 700, display: 'grid', placeItems: 'center', flexShrink: 0 }}>{l.order || i + 1}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-0)' }}>{l.title}</div>
                      {l.excerpt && <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.excerpt}</div>}
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>{l.time || l.duration || ''}</span>
                    <span style={{ fontSize: 18, color: 'var(--accent)' }}>→</span>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20 }}>
                  <button className="btn sm" disabled={lessonPage <= 1} onClick={() => setLessonPage(p => p - 1)}
                    style={{ opacity: lessonPage <= 1 ? 0.4 : 1, cursor: lessonPage <= 1 ? 'not-allowed' : 'pointer' }}>← 前へ</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setLessonPage(p)} className="btn sm"
                      style={{ minWidth: 36, justifyContent: 'center', background: p === lessonPage ? 'var(--accent)' : 'var(--bg-card)', color: p === lessonPage ? 'white' : 'var(--ink-1)', borderColor: p === lessonPage ? 'var(--accent)' : 'var(--line-2)' }}>{p}</button>
                  ))}
                  <button className="btn sm" disabled={lessonPage >= totalPages} onClick={() => setLessonPage(p => p + 1)}
                    style={{ opacity: lessonPage >= totalPages ? 0.4 : 1, cursor: lessonPage >= totalPages ? 'not-allowed' : 'pointer' }}>次へ →</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="art-side">
          <div className="toc-card">
            <h5>📌 詳細</h5>
            <div style={{ fontSize: 13, color: 'var(--ink-1)', lineHeight: 1.8 }}>
              {course.duration && <div>⏱ {course.duration}</div>}
              {course.price > 0 ? <div>💴 ¥{course.price.toLocaleString()}</div> : <div>🎉 無料</div>}
              <div>📅 {course.created_at ? new Date(course.created_at).toLocaleDateString('ja-JP') : ''}</div>
            </div>
          </div>
          {relatedCourses.length > 0 && (
            <div className="toc-card">
              <h5>📚 関連コース</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {relatedCourses.map((rc: any) => (
                  <Link key={rc.id} href={`/course/${rc.id}`} style={{ display: 'block', padding: '7px 10px', borderRadius: 'var(--r-sm)', fontSize: 12.5, color: 'var(--ink-1)', textDecoration: 'none', background: 'var(--bg-1)', transition: 'background .12s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-soft)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-1)'}>
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
            <Link href={`/category/${modSlug}`} style={{ fontSize: 13, color: 'var(--accent-deep)', textDecoration: 'none', display: 'block', padding: '4px 0' }}>← {modName}に戻る</Link>
          </div>}
        </aside>
      </div>
    </>
  )
}
