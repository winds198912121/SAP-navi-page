'use client'
// ===========================================================
// LessonPage — レッスン詳細画面 /lesson/:id/:slug
// ===========================================================
import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

const PUBLIC_API = '/wp-json/sap/v1'

function extractToc(html: string): { id: string; label: string; level: number }[] {
  const toc: { id: string; label: string; level: number }[] = []
  const regex = /<h([23])(?:\s[^>]*)?>(.+?)<\/h\1>/gi
  let match: RegExpExecArray | null = null
  let index = 0
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1])
    const label = match[2].replace(/<[^>]+>/g, '').trim()
    if (label) { const id = `lesson-heading-${index++}`; toc.push({ id, label, level }) }
  }
  return toc
}

export default function LessonPage() {
  const params = useParams()
  const id = params?.id as string | undefined
  const slug = params?.slug as string | undefined

  const [lesson, setLesson] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeToc, setActiveToc] = useState('')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`${PUBLIC_API}/lessons/${id}`).then(r => r.json()).then(d => {
      if (d.success && d.data) setLesson(d.data)
      else loadFallback()
    }).catch(() => loadFallback()).finally(() => setLoading(false))
  }, [id])

  function loadFallback() {
    setLesson({
      id: parseInt(id || '0'),
      title: 'SAPとは？FIモジュールの全体像',
      excerpt: 'SAPの基本とFIモジュールの役割を理解します。このレッスンではSAPの歴史や全体像をつかみましょう。',
      content: '<h2 id="lesson-heading-0">SAPとは？</h2><p>SAP（エス・エー・ピー）とは、ドイツに本社を置くSAP SEが開発した統合基幹業務システム（ERP）です。世界で最も多くの企業に導入されているERPシステムとして知られています。</p><h2 id="lesson-heading-1">SAPの歴史</h2><p>1972年に5人の元IBM社員によって設立されたSAP。最初の製品「R/1」はリアルタイム処理が可能な会計システムでした。その後「R/2」（メインフレーム向け）、「R/3」（クライアントサーバー型）と進化し、現在の「S/4HANA」に至ります。</p><h2 id="lesson-heading-2">FIモジュールの役割</h2><p>FI（Financial Accounting）は、財務会計を担当するモジュールです。企業の経済活動を記録し、財務諸表を作成するための基盤となります。主な機能として、<strong>総勘定元帳</strong>、<strong>売掛金管理</strong>、<strong>買掛金管理</strong>、<strong>固定資産管理</strong>などがあります。</p><h2 id="lesson-heading-3">まとめ</h2><p>SAP FIモジュールは企業の財務情報を一元管理するための強力なツールです。次回のレッスンでは、実際の会社コード設定について学びます。</p>',
      order: 1, time: '20 min',
      course_id: 1, course_title: 'SAP財務会計(FI) 入門コース',
      created_at: new Date().toISOString(),
    })
  }

  const fullContent = lesson?.content || ''
  const tocItems = useMemo(() => extractToc(fullContent), [fullContent])

  const contentWithIds = useMemo(() => {
    let idx = 0
    return fullContent.replace(/<h([23])(\s[^>]*)?>/gi, (_m: string, level: string, attrs: string) => {
      const id = `lesson-heading-${idx++}`
      return `<h${level}${attrs || ''} id="${id}">`
    })
  }, [fullContent])

  useEffect(() => {
    if (tocItems.length === 0) return
    const onScroll = () => {
      const viewTop = window.scrollY + 160
      let active = tocItems[0].id
      for (const t of tocItems) {
        const el = document.getElementById(t.id)
        if (el) { const top = el.getBoundingClientRect().top + window.scrollY; if (top <= viewTop) active = t.id }
      }
      setActiveToc(active)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [tocItems])

  const scrollToHeading = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setActiveToc(id) }

  if (loading) return (<><div className="page-bg" /><div style={{ textAlign: 'center', padding: 80, color: 'var(--ink-3)' }}>読み込み中...</div></>)

  if (!lesson) return (
    <><div className="page-bg" />
    <div style={{ textAlign: 'center', padding: 80 }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🎋</div>
      <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontSize: 22, color: 'var(--ink-0)' }}>レッスンが見つかりません</h2>
      <Link href="/courses" className="btn" style={{ marginTop: 20, display: 'inline-flex', textDecoration: 'none' }}>コース一覧に戻る</Link>
    </div></>
  )

  return (
    <>
      <div className="page-bg" />

      <section className="cat-hero">
        <div className="cat-hero-wrap" style={{ gridTemplateColumns: '1fr' }}>
          <div>
            <div className="crumb">
              <Link href="/">ホーム</Link><span className="sep">›</span>
              <Link href="/modules">モジュール</Link>
              {lesson.course_id ? <><span className="sep">›</span>
                <Link href={`/course/${lesson.course_id}`} style={{ color: 'var(--ink-2)' }}>{lesson.course_title}</Link></> : null}
              <span className="sep">›</span>
              <span className="now">{lesson.title}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, marginBottom: 6, flexWrap: 'wrap' }}>
              <span className="tag-diff l1" style={{ fontSize: 10.5 }}>レッスン {lesson.order}</span>
              {lesson.time && <span style={{ color: 'var(--ink-3)' }}>⏱ {lesson.time}</span>}
            </div>
            <h1 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: 'clamp(24px, 2.5vw, 32px)', color: 'var(--ink-0)', margin: '0 0 8px' }}>{lesson.title}</h1>
            {lesson.excerpt && <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.8, maxWidth: 600 }}>{lesson.excerpt}</p>}
          </div>
        </div>
      </section>

      <div className="art-body-wrap" style={{ gridTemplateColumns: '1fr 220px', maxWidth: 1280 }}>
        <div className="art-content" style={{ minHeight: 200 }}>
          {fullContent ? (
            <div dangerouslySetInnerHTML={{ __html: contentWithIds }} />
          ) : (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎋</div>
              <p>コンテンツは準備中です。</p>
            </div>
          )}
        </div>

        <aside className="art-side">
          {tocItems.length > 0 && (
            <div className="toc-card">
              <h5>📖 目次</h5>
              <ul className="toc-list">
                {tocItems.map(t => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className={activeToc === t.id ? 'active' : ''}
                      style={{ paddingLeft: t.level === 3 ? 22 : 10 }}
                      onClick={(e) => { e.preventDefault(); scrollToHeading(t.id) }}>
                      {t.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="toc-card">
            <h5>📌 詳細</h5>
            <div style={{ fontSize: 13, color: 'var(--ink-1)', lineHeight: 1.8 }}>
              <div>📖 レッスン {lesson.order}</div>
              {lesson.time && <div>⏱ {lesson.time}</div>}
            </div>
          </div>
          {lesson.course_id ? <div className="toc-card">
            <h5>📂 コース</h5>
            <Link href={`/course/${lesson.course_id}`} style={{ fontSize: 13, color: 'var(--accent-deep)', textDecoration: 'none', display: 'block', padding: '4px 0' }}>← {lesson.course_title}に戻る</Link>
          </div> : null}
        </aside>
      </div>
    </>
  )
}
