'use client'
// ===========================================================
// SearchPage — 検索結果ページ /search?q=xxx
// ===========================================================
import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const PUBLIC_API = '/wp-json/sap/v1'

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

const FALLBACK_ARTICLES = [
  { id: 1, title: '【保存版】SAP用語集 — はじめての100単語', slug: 'sap-glossary', excerpt: 'SAPに出てくる専門用語を100個厳選して解説。', module: { slug: 'fi', name: '財務会計' }, difficulty: { slug: 'beginner', name: '初級' }, reading_time: 15, created_at: new Date().toISOString() },
  { id: 2, title: 'BAPI とは何か、なぜ使うのか — 5分で理解', slug: 'bapi-intro', excerpt: 'SAPの拡張開発でよく聞くBAPIを5分で解説。', module: { slug: 'abap', name: '開発言語' }, difficulty: { slug: 'intermediate', name: '中級' }, reading_time: 5, created_at: new Date().toISOString() },
  { id: 3, title: 'Fiori vs SAP GUI — 結局どう使い分ける？', slug: 'fiori-vs-gui', excerpt: 'モダンFioriとクラシックGUIの比較。', module: { slug: 's4', name: 'S/4HANA' }, difficulty: { slug: 'beginner', name: '初級' }, reading_time: 8, created_at: new Date().toISOString() },
  { id: 4, title: 'T-Code 早見表（よく使う50個）', slug: 'tcode-list', excerpt: 'SAPコンサルタント必修のT-Codeを50個まとめました。', module: { slug: 'basis', name: '基盤管理' }, difficulty: { slug: 'beginner', name: '初級' }, reading_time: 10, created_at: new Date().toISOString() },
  { id: 5, title: 'ABAP オブジェクト指向 完全入門', slug: 'abap-oop', excerpt: 'ABAPのオブジェクト指向プログラミングを基礎から解説。', module: { slug: 'abap', name: '開発言語' }, difficulty: { slug: 'intermediate', name: '中級' }, reading_time: 20, created_at: new Date().toISOString() },
  { id: 6, title: 'MMの移動タイプ、覚えるならこの10個', slug: 'mm-movement', excerpt: '在庫移動で使う移動タイプを厳選。', module: { slug: 'mm', name: '購買管理' }, difficulty: { slug: 'beginner', name: '初級' }, reading_time: 8, created_at: new Date().toISOString() },
  { id: 7, title: 'S/4HANA アップグレード手順', slug: 's4-upgrade', excerpt: 'S/4HANAのバージョンアップ手順を解説。', module: { slug: 's4', name: 'S/4HANA' }, difficulty: { slug: 'advanced', name: '上級' }, reading_time: 25, created_at: new Date().toISOString() },
  { id: 8, title: '新人コンサルが最初に読むべき本ベスト5', slug: 'top5-books', excerpt: 'SAPコンサルタントにおすすめの本を紹介。', module: { slug: 'fi', name: '財務会計' }, difficulty: { slug: 'beginner', name: '初級' }, reading_time: 5, created_at: new Date().toISOString() },
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQ = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQ)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  const doSearch = async (q: string) => {
    if (!q.trim()) { setResults([]); setSearched(false); return }
    setLoading(true); setSearched(true)
    const ql = q.toLowerCase()
    try {
      const res = await fetch(`${PUBLIC_API}/articles/search?q=${encodeURIComponent(q.trim())}&per_page=20`)
      const json = await res.json()
      if (json.success && json.data?.length > 0) {
        setResults(json.data)
      } else {
        setResults(FALLBACK_ARTICLES.filter(a =>
          a.title.toLowerCase().includes(ql) ||
          a.excerpt.toLowerCase().includes(ql) ||
          a.module?.name?.toLowerCase().includes(ql) ||
          a.module?.slug?.toLowerCase().includes(ql)
        ))
      }
    } catch {
      setResults(FALLBACK_ARTICLES.filter(a =>
        a.title.toLowerCase().includes(ql) ||
        a.excerpt.toLowerCase().includes(ql) ||
        a.module?.name?.toLowerCase().includes(ql) ||
        a.module?.slug?.toLowerCase().includes(ql)
      ))
    }
    setLoading(false)
  }

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) { setQuery(q); doSearch(q) }
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!query.trim()) { setResults([]); setSearched(false); return }
    timerRef.current = setTimeout(() => {
      const url = query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : '/search'
      router.replace(url, { scroll: false })
      doSearch(query.trim())
    }, 300)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [query])

  return (
    <>
      <div className="page-bg" />
      <section className="section" style={{ paddingTop: 32 }}>
        {/* Search input */}
        <div style={{ maxWidth: 720, margin: '0 auto 32px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'var(--bg-card)', border: '2px solid var(--line-2)',
            borderRadius: 'var(--r-pill)', padding: '12px 20px',
            transition: 'border-color .15s', boxShadow: 'var(--sh-1)',
          }}
            onFocusCapture={e => { e.currentTarget.style.borderColor = 'var(--accent)' }}
            onBlurCapture={e => { e.currentTarget.style.borderColor = 'var(--line-2)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2.4" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
            </svg>
            <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
              placeholder="モジュール名、用語、エラー番号で検索..."
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, fontFamily: 'inherit', color: 'var(--ink-0)', background: 'transparent' }} />
            {loading && <span style={{ fontSize: 12, color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>検索中...</span>}
            {query && !loading && (
              <button onClick={() => { setQuery(''); setResults([]); setSearched(false); inputRef.current?.focus() }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--ink-3)', padding: 0, lineHeight: 1 }}>✕</button>
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
                {results.map((article: any) => {
                  const slug = article.module?.slug || article.modules?.[0]?.slug || ''
                  const modName = article.module?.name || article.modules?.[0]?.name || ''
                  const diff = article.difficulty?.slug || ''
                  const diffName = article.difficulty?.name || (diff === 'beginner' ? '初級' : diff === 'intermediate' ? '中級' : '上級')
                  return (
                    <Link key={article.id} href={`/article/${article.id}/${article.slug || ''}`}
                      style={{
                        display: 'flex', gap: 16, padding: '16px 20px',
                        background: 'var(--bg-card)', borderRadius: 'var(--r-lg)',
                        border: '1px solid var(--line-1)',
                        textDecoration: 'none', transition: 'all .15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateX(2px)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line-1)'; e.currentTarget.style.transform = 'none' }}>
                      <div style={{ width: 48, height: 48, borderRadius: 'var(--r-sm)', flexShrink: 0, background: slug ? (modColor[slug] || 'var(--accent-soft)') : 'var(--bg-tint)', display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 800, color: '#fff' }}>
                        {slug?.toUpperCase() || '?'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                          {modName && <span style={{ fontSize: 10.5, fontWeight: 700, padding: '1px 7px', borderRadius: 4, background: 'var(--accent-soft)', color: 'var(--accent-deep)' }}>{modName}</span>}
                          {diff && <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 999, ...diffStyle(diff) }}>{diffName}</span>}
                          <span style={{ fontSize: 11.5, color: 'var(--ink-3)', marginLeft: 'auto' }}>{article.reading_time || article.readingTime || 5}分</span>
                        </div>
                        <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink-0)', lineHeight: 1.45, marginBottom: 4 }}>{article.title}</div>
                        {article.excerpt && (
                          <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {article.excerpt.replace(/<[^>]*>/g, '')}
                          </div>
                        )}
                        <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 6 }}>{article.created_at?.slice(0, 10) || ''}</div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
