// ===========================================================
// StepPage — 学習ステップ詳細画面 /step/:id
// 文章のような内容表示、関連パスへのリンク、目次
// ===========================================================

import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import Seo from '../components/layout/Seo'
import SiteHeader from '../components/layout/Header'
import SiteFooter from '../components/layout/Footer'
import FloatingPanda from '../components/layout/FloatingPanda'
import { useTheme } from '../hooks/useTheme'
import api from '../services/api'

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
      const id = `step-heading-${index++}`
      toc.push({ id, label, level })
    }
  }
  return toc
}

export default function StepPage() {
  const { id } = useParams()
  const [step, setStep] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeToc, setActiveToc] = useState('')
  const { settings } = useTheme()

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.getStep(parseInt(id)).then(res => {
      if (res.success) setStep(res.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  const htmlContent = step?.content || ''
  const tocItems = useMemo(() => extractToc(htmlContent), [htmlContent])

  // inject id into h2/h3 tags in content
  const contentWithIds = useMemo(() => {
    let idx = 0
    return htmlContent.replace(/<h([23])(\s[^>]*)?>/gi, (_m: string, level: string, attrs: string) => {
      const id = `step-heading-${idx++}`
      return `<h${level}${attrs || ''} id="${id}">`
    })
  }, [htmlContent])

  // scroll tracking for TOC（getBoundingClientRect で絶対位置を計算）
  useEffect(() => {
    if (tocItems.length === 0) return
    const onScroll = () => {
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
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [tocItems])

  if (loading) {
    return (
      <><Seo title="ステップ詳細" description="学習ステップを読み込み中です。" path={"/step/"+String(id)} /><div className="page-bg" /><SiteHeader />
        <main style={{ textAlign: 'center', padding: 80, color: 'var(--ink-3)' }}>読み込み中...</main>
        <SiteFooter /></>
    )
  }

  if (!step) {
    return (
      <><Seo title="ステップが見つかりません" description="お探しのステップは存在しないか、削除されました。" path={"/step/"+String(id)} /><div className="page-bg" /><SiteHeader />
        <main style={{ textAlign: 'center', padding: 80 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎋</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink-0)' }}>ステップが見つかりません</h2>
          <Link to="/paths" className="btn" style={{ marginTop: 20, display: 'inline-flex', textDecoration: 'none' }}>学習パス一覧へ</Link>
        </main>
        <SiteFooter /></>
    )
  }

  const stepTitle = step?.title || ''
  const stepExcerpt = step?.excerpt || ''

  return (
    <>
      <Seo
        title={`${stepTitle} — SAP学習ステップ`}
        description={stepExcerpt || `SAP 学習ステップ「${stepTitle}」。${step.step_time || ''}`}
        path={"/step/"+String(id)}
        type="article"
        breadcrumbs={[
          { name: 'ホーム', path: '/' },
          { name: '学習パス', path: '/paths' },
          ...(step.path_id ? [{ name: step.path_title || '学習パス', path: "/learning/"+String(step.path_id) }] : []),
          { name: stepTitle, path: "/step/"+String(id) },
        ]}
      />
      <div className="page-bg" /><SiteHeader />
      <main style={{ position: 'relative', zIndex: 2 }}>
        <article className="art-hero" style={{ maxWidth: 1080 }}>
          <div className="crumb">
            <Link to="/">ホーム</Link><span className="sep"> › </span>
            <Link to="/paths">学習パス</Link><span className="sep"> › </span>
            {step.path_id && <><Link to={`/learning/${step.path_id}`}>{step.path_title}</Link><span className="sep"> › </span></>}
            <span className="now">{step.title}</span>
          </div>

          <div className="meta-top" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontSize: 12.5, marginBottom: 16 }}>
            {step.step_order && <span className="tag-mod fi">Step {step.step_order}</span>}
            {step.step_time && <span style={{ color: 'var(--ink-3)' }}>⏱ {step.step_time}</span>}
            {step.path_title && <span style={{ color: 'var(--ink-3)' }}>📚 {step.path_title}</span>}
          </div>

          <h1>{step.title}</h1>
          {step.excerpt && <p className="lead">{step.excerpt}</p>}
        </article>

        <div className="art-body-wrap">
          <div className="art-content" dangerouslySetInnerHTML={{ __html: contentWithIds || '<p style="color:var(--ink-3);text-align:center;">コンテンツは準備中です🎋</p>' }} />

          <aside className="art-side">
            {/* 目次 */}
            {tocItems.length > 0 && (
              <div className="toc-card" style={{ marginBottom: 14 }}>
                <h5>📖 目次</h5>
                <ul className="toc-list">
                  {tocItems.map((t, i) => (
                    <li key={i} className={t.level === 3 ? 'sub' : ''}>
                      <a href={`#${t.id}`}
                        className={activeToc === t.id ? 'active' : ''}
                        onClick={(e) => { e.preventDefault(); document.getElementById(t.id)?.scrollIntoView({ behavior: 'smooth' }); setActiveToc(t.id) }}>
                        {t.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 所属パス */}
            <div className="toc-card">
              <h5>📚 所属パス</h5>
              {step.path_id ? (
                <Link to={`/learning/${step.path_id}`} style={{ display: 'block', padding: '8px 10px', background: 'var(--accent-soft)', borderRadius: 'var(--r-sm)', fontSize: 13, color: 'var(--accent-deep)', fontWeight: 600, textDecoration: 'none' }}>
                  {step.path_title} →
                </Link>
              ) : (
                <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>未所属</p>
              )}
            </div>

            {/* 学習時間 */}
            <div className="toc-card" style={{ marginBottom: 14 }}>
              <h5>⏱ 学習時間</h5>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-0)', fontFamily: 'var(--font-display)' }}>{step.step_time || '—'}</p>
            </div>

            <Link to="/paths" className="btn sm" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
              ← 学習パス一覧
            </Link>
          </aside>
        </div>
      </main>
      <SiteFooter />
      {settings.showFloatingPanda && <FloatingPanda />}
    </>
  )
}
