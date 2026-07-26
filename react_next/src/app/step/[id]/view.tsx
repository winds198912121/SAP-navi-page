'use client'
// ===========================================================
// StepPage — 学習ステップ詳細画面 /step/:id
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
    if (label) { const id = `step-heading-${index++}`; toc.push({ id, label, level }) }
  }
  return toc
}

interface ContentItem { id: number; slug?: string; title: string; module?: { slug: string; name: string } | null }

const TYPE_UI: Record<string, { label: string; color: string; icon: string; linkPrefix: string }> = {
  courses: { label: 'コース', color: '#5a9d6e', icon: '📚', linkPrefix: '/course/' },
  knowledge: { label: 'ナレッジ', color: '#3b82f6', icon: '📖', linkPrefix: '/knowledge/' },
  articles: { label: '記事', color: '#8b5cf6', icon: '📰', linkPrefix: '/article/' },
}

export default function StepPage() {
  const params = useParams()
  const id = params?.id as string | undefined
  const [step, setStep] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeToc, setActiveToc] = useState('')

  useEffect(() => {
    if (!id) return; setLoading(true)
    fetch(`${PUBLIC_API}/steps/${id}`).then(r => r.json()).then(d => {
      if (d.success && d.data) setStep(d.data)
      else loadFallback()
    }).catch(() => loadFallback()).finally(() => setLoading(false))
  }, [id])

  function loadFallback() {
    setStep({
      id: parseInt(id || '0'), title: 'SAPの世界観を知る', excerpt: 'SAPの全体像と基本コンセプトを理解します。',
      step_order: 1, step_time: '20 min', path_id: 1, path_title: 'SAPって何？からはじめる入門コース',
      content: '<h2 id="step-heading-0">SAPとは？</h2><p>SAPは、企業の経営資源を効率的に管理するための統合基幹業務システム（ERP）です。1972年にドイツで生まれ、現在では世界190カ国以上の企業で利用されています。</p><h2 id="step-heading-1">SAPの歴史</h2><p>1972年：SAP設立（R/1）→ 1992年：R/3登場 → 2004年：ECC → 2015年：S/4HANAへと進化してきました。</p><h2 id="step-heading-2">モジュール構成</h2><p>SAPは機能別にモジュールに分かれています。FI（財務会計）、CO（管理会計）、MM（購買管理）、SD（販売管理）、PP（生産計画）、HR（人事管理）などがあります。</p>',
      path_items: {
        courses: [{ id: 1, title: 'SAP財務会計(FI) 入門コース', slug: 'fi-intro', module: { slug: 'fi', name: '財務会計' } }],
        articles: [{ id: 1, title: '【保存版】SAP用語集 — はじめての100単語', slug: 'sap-glossary', module: { slug: 'fi', name: '財務会計' } }],
      },
      notes: [{ title: 'ポイント', content: 'SAPは「モジュール」の組み合わせで構成されることを覚えておこう。' }],
    })
  }

  const htmlContent = step?.content || ''
  const tocItems = useMemo(() => extractToc(htmlContent), [htmlContent])

  const contentWithIds = useMemo(() => {
    let idx = 0
    return htmlContent.replace(/<h([23])(\s[^>]*)?>/gi, (_m: string, level: string, attrs: string) => `<h${level}${attrs || ''} id="step-heading-${idx++}">`)
  }, [htmlContent])

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
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [tocItems])

  const pathItems = step?.path_items || {}
  const contentGroups = useMemo(() => {
    const groups: { label: string; color: string; icon: string; items: ContentItem[]; linkPrefix: string }[] = []
    for (const [key, ui] of Object.entries(TYPE_UI)) {
      const items = (pathItems as any)[key] || []
      if (items.length > 0) groups.push({ ...ui, items })
    }
    return groups
  }, [pathItems])
  const totalItems = Object.values(pathItems).reduce((sum: number, arr: any) => sum + (arr?.length || 0), 0)

  const scrollToToc = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setActiveToc(id) }

  if (loading) return (<><div className="page-bg" /><div style={{ textAlign: 'center', padding: 80, color: 'var(--ink-3)' }}>読み込み中...</div></>)

  if (!step) return (
    <><div className="page-bg" />
    <div style={{ textAlign: 'center', padding: 80 }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🎋</div>
      <h2 style={{ fontFamily: "'Zen Maru Gothic', system-ui, sans-serif", fontSize: 22, color: 'var(--ink-0)' }}>ステップが見つかりません</h2>
      <Link href="/paths" className="btn" style={{ marginTop: 20, display: 'inline-flex', textDecoration: 'none' }}>学習パス一覧へ</Link>
    </div></>
  )

  return (
    <>
      <div className="page-bg" />
      <article className="art-hero" style={{ maxWidth: 1080 }}>
        <div className="crumb">
          <Link href="/">ホーム</Link><span className="sep"> › </span>
          <Link href="/paths">学習パス</Link><span className="sep"> › </span>
          {step.path_id && <><Link href={`/learning/${step.path_id}`}>{step.path_title}</Link><span className="sep"> › </span></>}
          <span className="now">{step.title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontSize: 12.5, marginBottom: 16 }}>
          {step.step_order && <span className="tag-mod fi">Step {step.step_order}</span>}
          {step.step_time && <span style={{ color: 'var(--ink-3)' }}>⏱ {step.step_time}</span>}
          {step.path_title && <span style={{ color: 'var(--ink-3)' }}>📚 {step.path_title}</span>}
        </div>
        <h1>{step.title}</h1>
        {step.excerpt && <p className="lead">{step.excerpt}</p>}
      </article>

      <div className="art-body-wrap">
        <div className="art-content">
          <div dangerouslySetInnerHTML={{ __html: contentWithIds || '<p style="color:var(--ink-3);text-align:center;">コンテンツは準備中です🎋</p>' }} />

          {totalItems > 0 && (
            <div style={{ marginTop: 40, paddingTop: 28, borderTop: '1.5px solid var(--line-1)' }}>
              <h2 style={{ fontFamily: "'Zen Maru Gothic', system-ui, sans-serif", fontWeight: 700, fontSize: 20, color: 'var(--ink-0)', margin: '0 0 18px' }}>
                🎯 このステップの学習コンテンツ <span style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 500, marginLeft: 8 }}>{totalItems}件</span>
              </h2>
              {contentGroups.map(group => (
                <div key={group.label} style={{ marginBottom: 20 }}>
                  <h3 style={{ fontFamily: "'Zen Maru Gothic', system-ui, sans-serif", fontSize: 15, fontWeight: 700, color: group.color, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>{group.icon}</span><span>{group.label}</span><span style={{ fontSize: 11, fontWeight: 500, color: 'var(--ink-3)' }}>{group.items.length}件</span>
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {group.items.map((item: ContentItem) => {
                      let url = group.linkPrefix + item.id
                      if (item.slug) url += '/' + item.slug
                      return (
                        <Link key={`${group.label}-${item.id}`} href={url}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'var(--bg-1)', border: '1px solid var(--line-1)', textDecoration: 'none', transition: 'all .12s' }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = group.color}
                          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--line-1)'}>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--r-pill)', background: group.color + '22', color: group.color, flexShrink: 0 }}>{group.label}</span>
                          <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500, color: 'var(--ink-0)' }}>{item.title}</span>
                          {item.module?.slug && <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 4, background: 'var(--accent-soft)', color: 'var(--accent-deep)', flexShrink: 0 }}>{item.module.slug.toUpperCase()}</span>}
                          <span style={{ fontSize: 16, color: group.color, flexShrink: 0 }}>→</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {(step.notes || []).length > 0 && (
            <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px dashed var(--line-2)' }}>
              <h3 style={{ fontFamily: "'Zen Maru Gothic', system-ui, sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--ink-0)', margin: '0 0 12px' }}>📝 ノート</h3>
              {step.notes.map((n: any, i: number) => (
                <div key={i} style={{ padding: '12px 16px', background: 'var(--bg-card)', borderRadius: 'var(--r-md)', border: '1px solid var(--line-1)', marginBottom: 8 }}>
                  {n.title && <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink-0)', marginBottom: 4 }}>{n.title}</div>}
                  {n.content && <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.7 }}>{n.content}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="art-side">
          {tocItems.length > 0 && (
            <div className="toc-card" style={{ marginBottom: 14 }}>
              <h5>📖 目次</h5>
              <ul className="toc-list">
                {tocItems.map((t, i) => (
                  <li key={i}>
                    <a href={`#${t.id}`} className={activeToc === t.id ? 'active' : ''}
                      onClick={(e) => { e.preventDefault(); scrollToToc(t.id) }} style={{ paddingLeft: t.level === 3 ? 16 : 0 }}>
                      {t.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="toc-card">
            <h5>📚 所属パス</h5>
            {step.path_id ? (
              <Link href={`/learning/${step.path_id}`} style={{ display: 'block', padding: '8px 10px', background: 'var(--accent-soft)', borderRadius: 'var(--r-sm)', fontSize: 13, color: 'var(--accent-deep)', fontWeight: 600, textDecoration: 'none' }}>
                {step.path_title} →
              </Link>
            ) : <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>未所属</p>}
          </div>
          <div className="toc-card">
            <h5>⏱ 学習時間</h5>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-0)', fontFamily: "'Zen Maru Gothic', system-ui, sans-serif" }}>{step.step_time || '—'}</p>
          </div>
          {totalItems > 0 && (
            <div className="toc-card">
              <h5>📋 コンテンツ</h5>
              {contentGroups.map(g => (
                <div key={g.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-1)', padding: '2px 0' }}>
                  <span>{g.icon} {g.label}</span><span style={{ fontWeight: 700, color: g.color }}>{g.items.length}</span>
                </div>
              ))}
            </div>
          )}
          <Link href="/paths" className="btn sm" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>← 学習パス一覧</Link>
        </aside>
      </div>
    </>
  )
}
