'use client'
// ===========================================================
// KnowledgePage — ナレッジ詳細画面 /knowledge/:id/:slug
// ===========================================================
import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

const PUBLIC_API = '/wp-json/sap/v1'

const MODULE_COLORS: Record<string, string> = {
  fi: '#2f6d44', co: '#2641a1', mm: '#a25411', sd: '#b62a4a',
  pp: '#4828a8', hr: '#8a6212', abap: '#1f6f6f', basis: '#4a432d', s4: '#1864a3',
}

function extractToc(html: string): { id: string; label: string; level: number }[] {
  const toc: { id: string; label: string; level: number }[] = []
  const regex = /<h([23])(?:\s[^>]*)?>(.+?)<\/h\1>/gi
  let match: RegExpExecArray | null = null
  let index = 0
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1])
    const label = match[2].replace(/<[^>]+>/g, '').trim()
    if (label) { const id = `knowledge-heading-${index++}`; toc.push({ id, label, level }) }
  }
  return toc
}

export default function KnowledgePage() {
  const params = useParams()
  const id = params?.id as string | undefined
  const slug = params?.slug as string | undefined

  const [knowledge, setKnowledge] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeToc, setActiveToc] = useState('')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`${PUBLIC_API}/knowledge/${id}`).then(r => r.json()).then(d => {
      if (d.success && d.data) setKnowledge(d.data)
      else loadFallback()
    }).catch(() => loadFallback()).finally(() => setLoading(false))
  }, [id])

  function loadFallback() {
    const i = parseInt(id || '0')
    const demos: Record<number, any> = {
      1: {
        id: 1, title: 'FIモジュールの基本概念', slug: 'concept',
        excerpt: '財務会計(FI)モジュールの基本的な概念と仕組みを解説します。',
        content: '<h2 id="knowledge-heading-0">FIモジュールとは</h2><p>FI（Financial Accounting）モジュールは、SAPの中核となる財務会計モジュールです。企業のすべての財務取引を記録・管理し、法定報告に必要な財務諸表を作成します。</p><h2 id="knowledge-heading-1">主な機能</h2><p><strong>総勘定元帳</strong>：すべての会計取引を記録する中心的な機能。会社コード単位で管理されます。</p><p><strong>売掛金管理</strong>：得意先からの入金を管理。請求書発行から入金消込まで。</p><p><strong>買掛金管理</strong>：仕入先への支払いを管理。支払い実行から消込まで。</p><h2 id="knowledge-heading-2">関連T-Code</h2><p><strong>FB50</strong>：一般仕訳入力<br/><strong>F-02</strong>：一般仕訳入力（詳細）<br/><strong>FBL1N</strong>：仕入先明細照会<br/><strong>FBL5N</strong>：得意先明細照会<br/><strong>F.01</strong>：勘定残高照会</p>',
        module: { slug: 'fi', name: '財務会計' },
        type: 'concept',
        difficulty: { slug: 'beginner', name: '初級' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        references: [
          { url: 'https://help.sap.com/docs/SAP_S4HANA', label: 'SAP Help Portal - S/4HANA' },
          { url: 'https://www.sap.com/japan/products/erp/financials.html', label: 'SAP ERP Financials' },
        ],
      },
      2: {
        id: 2, title: 'FI T-Code 一覧', slug: 'tcode',
        excerpt: '財務会計(FI)モジュールでよく使うT-Codeを一覧でまとめました。',
        content: '<h2 id="knowledge-heading-0">よく使うFI T-Code</h2><table><tr><th>T-Code</th><th>名称</th><th>用途</th></tr><tr><td>FB50</td><td>一般仕訳入力</td><td>最も基本的な仕訳入力</td></tr><tr><td>F-02</td><td>一般仕訳入力（詳細）</td><td>複雑な仕訳に対応</td></tr><tr><td>FBL1N</td><td>仕入先明細照会</td><td>買掛金の明細確認</td></tr></table>',
        module: { slug: 'fi', name: '財務会計' },
        type: 'tcode',
        created_at: new Date().toISOString(),
      },
    }
    setKnowledge(demos[i] || demos[1])
  }

  const fullContent = knowledge?.content || ''
  const tocItems = useMemo(() => extractToc(fullContent), [fullContent])

  const contentWithIds = useMemo(() => {
    let idx = 0
    return fullContent.replace(/<h([23])(\s[^>]*)?>/gi, (_m: string, level: string, attrs: string) => {
      return `<h${level}${attrs || ''} id="knowledge-heading-${idx++}">`
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

  if (!knowledge) return (
    <><div className="page-bg" />
    <div style={{ textAlign: 'center', padding: 80 }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🎋</div>
      <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontSize: 22, color: 'var(--ink-0)' }}>ナレッジが見つかりません</h2>
      <Link href="/modules" className="btn" style={{ marginTop: 20, display: 'inline-flex', textDecoration: 'none' }}>モジュール一覧に戻る</Link>
    </div></>
  )

  const modSlug = knowledge.module?.slug || ''
  const modColor = MODULE_COLORS[modSlug] || '#5a9d6e'
  const modName = knowledge.module?.name || modSlug.toUpperCase()
  const typeLabel = knowledge.type === 'concept' ? '概念'
    : knowledge.type === 'tcode' ? 'T-Code'
    : knowledge.type === 'faq' ? 'FAQ'
    : knowledge.type === 'glossary' ? '用語'
    : knowledge.type || ''

  return (
    <>
      <div className="page-bg" />

      <section className="cat-hero">
        <div className="cat-hero-wrap">
          <div>
            <div className="crumb">
              <Link href="/">ホーム</Link><span className="sep">›</span>
              <Link href="/modules">モジュール</Link>
              {modSlug && <><span className="sep">›</span><Link href={`/category/${modSlug}`} style={{ color: 'var(--ink-2)' }}>{modName}</Link></>}
              <span className="sep">›</span>
              <span className="now">{knowledge.title}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, marginBottom: 6, flexWrap: 'wrap' }}>
              {modSlug && <span className={`tag-mod ${modSlug}`}>{modSlug.toUpperCase()}</span>}
              {typeLabel && <span style={{ fontSize: 10.5, padding: '2px 7px', borderRadius: 4, background: 'var(--bg-tint)', color: 'var(--ink-2)', fontWeight: 600 }}>{typeLabel}</span>}
              {knowledge.difficulty && (
                <span className={`tag-diff l${knowledge.difficulty.slug === 'beginner' ? 1 : knowledge.difficulty.slug === 'intermediate' ? 2 : 3}`}>
                  {knowledge.difficulty.name || (knowledge.difficulty.slug === 'beginner' ? '初級' : knowledge.difficulty.slug === 'intermediate' ? '中級' : '上級')}
                </span>
              )}
              <span style={{ color: 'var(--ink-3)' }}>📅 {knowledge.created_at ? new Date(knowledge.created_at).toLocaleDateString('ja-JP') : ''}</span>
            </div>
            <h1 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: 'clamp(26px, 3vw, 36px)', color: 'var(--ink-0)', margin: '0 0 8px' }}>{knowledge.title}</h1>
            {knowledge.excerpt && <p style={{ fontSize: 14.5, color: 'var(--ink-2)', lineHeight: 1.8, maxWidth: 600 }}>{knowledge.excerpt}</p>}
          </div>
          <div className="cat-mascot">
            <svg viewBox="-4 -8 108 128" width="180" height="200">
              <path d="M 22 40 L 50 24 L 78 40 L 50 56 Z" fill="#2a2317" />
              <path d="M 20 42 L 20 50 Q 50 66 80 50 L 80 42" fill="none" stroke="#2a2317" strokeWidth="2.5" />
              <rect x="44" y="55" width="12" height="8" rx="2" fill="#d97548" />
              <line x1="50" y1="63" x2="50" y2="70" stroke="#d97548" strokeWidth="2" strokeLinecap="round" />
              <circle cx="50" cy="52" r="46" fill="#fdfaf2" />
              <ellipse cx="22" cy="18" rx="13" ry="12" fill="#1a1612" /><ellipse cx="78" cy="18" rx="13" ry="12" fill="#1a1612" />
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

          {/* References */}
          {knowledge.references && knowledge.references.length > 0 && (
            <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1.5px dashed var(--line-2)' }}>
              <h3 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: 17, color: 'var(--ink-0)', margin: '0 0 12px' }}>🔗 参考リンク</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {knowledge.references.map((r: any, i: number) => (
                  <li key={i}>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 'var(--r-md)', background: 'var(--bg-card)', border: '1px solid var(--line-1)', textDecoration: 'none', fontSize: 13, color: 'var(--accent-deep)', transition: 'background .12s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-soft)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-card)'}>
                      <span>🔗</span><span>{r.label || r.url}</span>
                    </a>
                  </li>
                ))}
              </ul>
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
              <div>📅 {knowledge.created_at ? new Date(knowledge.created_at).toLocaleDateString('ja-JP') : ''}</div>
              {knowledge.updated_at && <div>🔄 {new Date(knowledge.updated_at).toLocaleDateString('ja-JP')}</div>}
              {typeLabel && <div>🏷️ {typeLabel}</div>}
            </div>
          </div>
          {modSlug && <div className="toc-card">
            <h5>📂 モジュール</h5>
            <Link href={`/category/${modSlug}`} style={{ fontSize: 13, color: 'var(--accent-deep)', textDecoration: 'none', display: 'block', padding: '4px 0' }}>← {modName}に戻る</Link>
          </div>}
        </aside>
      </div>
    </>
  )
}
