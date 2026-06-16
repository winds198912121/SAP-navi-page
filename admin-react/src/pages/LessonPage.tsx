// ===========================================================
// LessonPage — レッスン詳細画面 /lesson/:id
// ===========================================================

import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import Seo from '../components/layout/Seo'
import SiteHeader from '../components/layout/Header'
import SiteFooter from '../components/layout/Footer'
import FloatingPanda from '../components/layout/FloatingPanda'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'
import { scrollToHeading, throttle } from '../utils'

/** HTMLからh2/h3見出しを抽出して目次を生成 */
function extractToc(html: string): { id: string; label: string; level: number }[] {
  const toc: { id: string; label: string; level: number }[] = []
  const regex = /<h([23])(?:\s[^>]*)?>(.+?)<\/h\1>/gi
  let match: RegExpExecArray | null = null
  let index = 0
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1])
    const label = match[2].replace(/<[^>]+>/g, '').trim()
    if (label) {
      const id = `lesson-heading-${index++}`
      toc.push({ id, label, level })
    }
  }
  return toc
}

export default function LessonPage() {
  const { id } = useParams()
  const [lesson, setLesson] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeToc, setActiveToc] = useState('')
  const { settings } = useTheme()
  const { user } = useAuth()
  const isAdmin = user?.roles?.includes('administrator')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.client.get(`/lessons/${id}`).then(({data}) => {
      if (data.success) setLesson(data.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  const htmlContent = lesson?.content || ''
  const tocItems = useMemo(() => extractToc(htmlContent), [htmlContent])

  // inject id into h2/h3 tags in content
  const contentWithIds = useMemo(() => {
    let idx = 0
    return htmlContent.replace(/<h([23])(\s[^>]*)?>/gi, (_m: string, level: string, attrs: string) => {
      const id = `lesson-heading-${idx++}`
      return `<h${level}${attrs || ''} id="${id}">`
    })
  }, [htmlContent])

  // scroll tracking for TOC（getBoundingClientRect で絶対位置を計算）
  useEffect(() => {
    if (tocItems.length === 0) return
    const onScroll = throttle(() => {
      const viewTop = window.scrollY + 160
      let active = tocItems[0].id
      for (const t of tocItems) {
        const el = document.getElementById(t.id)
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY
          if (top <= viewTop) active = t.id
        }
      }
      setActiveToc(active)
    }, 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [tocItems])

  const lessonTitle = lesson?.title || ''
  const lessonExcerpt = lesson?.excerpt || ''

  if (loading) return (
    <><Seo title="レッスンを読み込み中" path={`/lesson/${id}`} /><div className="page-bg" /><SiteHeader />
    <main style={{ textAlign: 'center', padding: 80, color: 'var(--ink-3)' }}>読み込み中...</main>
    <SiteFooter /></>
  )

  if (!lesson) return (
    <><Seo title="レッスンが見つかりません" description="お探しのレッスンは存在しないか、削除された可能性があります。" path={`/lesson/${id}`} /><div className="page-bg" /><SiteHeader />
    <main style={{ textAlign: 'center', padding: 80 }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🎋</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink-0)' }}>レッスンが見つかりません</h2>
      <Link to="/courses" className="btn" style={{ marginTop: 20, display: 'inline-flex', textDecoration: 'none' }}>コース一覧に戻る</Link>
    </main>
    <SiteFooter /></>
  )

  return (
    <>
      <Seo
        title={`${lessonTitle} — SAPレッスン`}
        description={lessonExcerpt || `SAP 学習レッスン「${lessonTitle}」。${lesson.time || ''}で学べる実践的な SAP トレーニングコンテンツ。`}
        path={`/lesson/${id}`}
        type="article"
        breadcrumbs={[
          { name: 'ホーム', path: '/' },
          { name: 'モジュール', path: '/modules' },
          ...(lesson.course_id ? [{ name: lesson.course_title || 'コース', path: `/course/${lesson.course_id}` }] : []),
          { name: lessonTitle, path: `/lesson/${id}` },
        ]}
      />
      <div className="page-bg" /><SiteHeader />
      <main style={{ position: 'relative', zIndex: 2 }}>
        <section className="cat-hero">
          <div className="cat-hero-wrap" style={{ gridTemplateColumns: '1fr' }}>
            <div>
              <div className="crumb">
                <Link to="/">ホーム</Link>
                <span className="sep">›</span>
                <Link to="/modules">モジュール</Link>
                {lesson.course_id ? <><span className="sep">›</span>
                  <Link to={`/course/${lesson.course_id}`} style={{ color: 'var(--ink-2)' }}>{lesson.course_title}</Link></> : null}
                <span className="sep">›</span>
                <span className="now">{lesson.title}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, marginBottom: 6, flexWrap: 'wrap' }}>
                <span className="tag-diff l1" style={{ fontSize: 10.5 }}>レッスン {lesson.order}</span>
                {lesson.time && <span style={{ color: 'var(--ink-3)' }}>⏱ {lesson.time}</span>}
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(24px, 2.5vw, 32px)', color: 'var(--ink-0)', margin: '0 0 8px' }}>{lesson.title}</h1>
              {lesson.excerpt && <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.8, maxWidth: 600 }}>{lesson.excerpt}</p>}
            </div>
          </div>
        </section>

        <div className="art-body-wrap" style={{ gridTemplateColumns: '1fr 220px' }}>
          <div className="art-content" style={{ minHeight: 200 }}>
            {htmlContent ? (
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
                      <a href={`#${t.id}`}
                        className={activeToc === t.id ? 'active' : ''}
                        style={{ paddingLeft: t.level === 3 ? 22 : 10 }}
                        onClick={(e) => { e.preventDefault(); scrollToHeading(t.id); setActiveToc(t.id) }}>
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
              <Link to={`/course/${lesson.course_id}`} style={{ fontSize: 13, color: 'var(--accent-deep)', textDecoration: 'none', display: 'block', padding: '4px 0' }}>
                ← {lesson.course_title}に戻る
              </Link>
            </div> : null}
            {isAdmin && (
              <div className="toc-card">
                <h5>⚙ 管理</h5>
                <Link to={`/admin/lessons/${lesson.id}/edit`} className="btn sm" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', fontSize: 11.5 }}>
                  このレッスンを編集
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
