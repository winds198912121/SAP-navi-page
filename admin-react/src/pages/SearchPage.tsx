// ===========================================================
// SearchPage — 検索結果ページ /search?q=xxx
// 記事検索結果を一覧表示
// ===========================================================

import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Seo from '../components/layout/Seo'
import SiteHeader from '../components/layout/Header'
import SiteFooter from '../components/layout/Footer'
import FloatingPanda from '../components/layout/FloatingPanda'
import { useTheme } from '../hooks/useTheme'
import api from '../services/api'
import type { Article } from '../types'
import { formatDate } from '../utils'

const modColor: Record<string, string> = {
  fi: '#2f6d44', co: '#2641a1', mm: '#a25411', sd: '#b62a4a',
  pp: '#4828a8', hr: '#8a6212', abap: '#1f6f6f', basis: '#4a432d', s4: '#1864a3',
}

const diffStyle = (slug: string): React.CSSProperties => {
  const map: Record<string, React.CSSProperties> = {
    beginner: { background: 'var(--accent-soft)', color: 'var(--accent-deep)' },
    intermediate: { background: 'var(--accent-2-soft)', color: 'var(--accent-2)' },
    advanced: { background: 'var(--rose-soft)', color: 'var(--rose)' },
  }
  return map[slug] || map.beginner
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { settings } = useTheme()
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  const doSearch = async (q: string) => {
    if (!q.trim()) {
      setResults([])
      setSearched(false)
      return
    }
    setLoading(true)
    setSearched(true)
    try {
      const res = await api.searchArticles(q.trim(), { per_page: 20 })
      setResults(res.success && res.data ? res.data : [])
    } catch {
      setResults([])
    }
    setLoading(false)
  }

  // Initial search from URL param
  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      doSearch(q)
    }
    inputRef.current?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Debounced search on input change
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!query.trim()) {
      setResults([])
      setSearched(false)
      return
    }
    timerRef.current = setTimeout(() => {
      setSearchParams(query ? { q: query.trim() } : {}, { replace: true })
      doSearch(query.trim())
    }, 300)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  return (
    <>
      <Seo
        title={query ? `「${query}」の検索結果` : '記事検索'}
        description="SAPパンダ先生の記事を検索"
        path="/search"
      />
      <div className="page-bg" />
      <SiteHeader active="" />
      <main style={{ position: 'relative', zIndex: 2 }}>
        <section className="section" style={{ paddingTop: 32 }}>
          {/* Search input */}
          <div style={{
            maxWidth: 720, margin: '0 auto 32px',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'var(--bg-card)', border: '2px solid var(--line-2)',
              borderRadius: 'var(--r-pill)', padding: '12px 20px',
              transition: 'border-color .15s', boxShadow: 'var(--sh-1)',
            }}
              onFocusCapture={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)' }}
              onBlurCapture={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--line-2)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2.4" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="モジュール名、用語、エラー番号で検索..."
                style={{
                  flex: 1, border: 'none', outline: 'none', fontSize: 16,
                  fontFamily: 'inherit', color: 'var(--ink-0)',
                  background: 'transparent',
                }}
              />
              {loading && (
                <span style={{ fontSize: 12, color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>検索中...</span>
              )}
              {query && !loading && (
                <button onClick={() => { setQuery(''); setResults([]); setSearched(false); inputRef.current?.focus() }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--ink-3)', padding: 0, lineHeight: 1 }}>
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {!searched ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)', fontSize: 14, lineHeight: 2 }}>
                <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>🔍</span>
                キーワードを入力して記事を検索<br />
                <span style={{ fontSize: 12, color: 'var(--ink-4)' }}>例: FI, 決算, 購買, BOM, ALV, 会計伝票</span>
              </div>
            ) : loading ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--ink-3)' }}>検索中...</div>
            ) : results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)', fontSize: 14, lineHeight: 2 }}>
                <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>😕</span>
                「{query}」に一致する記事が見つかりませんでした<br />
                <span style={{ fontSize: 12, color: 'var(--ink-4)' }}>別のキーワードで試してみてください</span>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 16 }}>
                  「{query}」の検索結果: <strong>{results.length}</strong> 件
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {results.map((article) => (
                    <Link key={article.id} to={`/article/${article.id}/${article.slug}`}
                      style={{
                        display: 'flex', gap: 16, padding: '16px 20px',
                        background: 'var(--bg-card)', borderRadius: 'var(--r-lg)',
                        border: '1px solid var(--line-1)',
                        textDecoration: 'none', transition: 'all .15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateX(2px)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line-1)'; e.currentTarget.style.transform = 'none' }}>
                      {/* Module icon */}
                      <div style={{
                        width: 48, height: 48, borderRadius: 'var(--r-sm)', flexShrink: 0,
                        background: article.modules[0]?.slug ? (modColor[article.modules[0].slug] || 'var(--accent-soft)') : 'var(--bg-tint)',
                        display: 'grid', placeItems: 'center',
                        fontSize: 14, fontWeight: 800, color: '#fff',
                      }}>
                        {article.modules[0]?.slug?.toUpperCase() || '?'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                          {article.modules[0] && (
                            <span style={{ fontSize: 10.5, fontWeight: 700, padding: '1px 7px', borderRadius: 4, background: 'var(--accent-soft)', color: 'var(--accent-deep)' }}>
                              {article.modules[0].name}
                            </span>
                          )}
                          {article.difficulty && (
                            <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 999, ...diffStyle(article.difficulty.slug) }}>
                              {article.difficulty.name}
                            </span>
                          )}
                          <span style={{ fontSize: 11.5, color: 'var(--ink-3)', marginLeft: 'auto' }}>
                            {article.readingTime}分
                          </span>
                        </div>
                        <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink-0)', lineHeight: 1.45, marginBottom: 4 }}>
                          {article.title}
                        </div>
                        {article.excerpt && (
                          <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {article.excerpt.replace(/<[^>]*>/g, '')}
                          </div>
                        )}
                        <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 6 }}>
                          {formatDate(article)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
      {settings.showFloatingPanda && <FloatingPanda />}
    </>
  )
}
