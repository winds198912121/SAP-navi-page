// ===========================================================
// VideoPage — 動画一覧ページ /video
// YouTube埋め込み、モジュール別フィルタ、20件ページネーション
// 動画プレーヤーはStickyでスクロール追従
// ===========================================================
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/layout/Seo'
import SiteHeader from '../components/layout/Header'
import SiteFooter from '../components/layout/Footer'
import FloatingPanda from '../components/layout/FloatingPanda'
import { useTheme } from '../hooks/useTheme'
import api from '../services/api'

const PER_PAGE = 20

export default function VideoPage() {
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [currentVideo, setCurrentVideo] = useState<any>(null)
  const [moduleFilter, setModuleFilter] = useState('')
  const [showIframe, setShowIframe] = useState(false)
  const [sticky, setSticky] = useState(false)
  const { settings } = useTheme()

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))

  const loadVideos = (mod?: string, pg?: number) => {
    setLoading(true)
    const p = pg || page
    api.getVideos({ per_page: PER_PAGE, page: p, ...(mod ? { module: mod } : {}) }).then(res => {
      if (res.success) {
        setVideos(res.data)
        setTotal(res.total || 0)
        if (res.data.length > 0 && !currentVideo) setCurrentVideo(res.data[0])
      }
    }).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { loadVideos() }, [])

  // Sticky: scroll position based — avoids IntersectionObserver reflow loop
  useEffect(() => {
    if (!currentVideo) return
    const handleScroll = () => {
      const shouldStick = window.scrollY > 180
      setSticky(prev => prev !== shouldStick ? shouldStick : prev)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentVideo])

  const openVideo = (v: any) => {
    setCurrentVideo(v)
    setShowIframe(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => setShowIframe(true), 400)
  }

  const filterByModule = (m: string) => {
    setModuleFilter(m)
    setPage(1)
    setCurrentVideo(null)
    loadVideos(m || undefined, 1)
  }

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return
    setPage(p)
    setCurrentVideo(null)
    loadVideos(moduleFilter || undefined, p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <div className="page-bg" />
      <Seo
        title="SAP 動画講座一覧"
        description="SAP パンダ先生の動画講座一覧。モジュール別にフィルタ可能。YouTube 動画で SAP の操作画面を確認しながら学習。"
        path="/video"
      /><SiteHeader active="yt" />
      <main style={{ position: 'relative', zIndex: 2 }}>

        {/* Sticky video player — position:sticky avoids reflow loop */}
        {currentVideo && (
          <div
            style={{
              background: '#1a1208',
              position: 'sticky',
              top: 0, zIndex: 30,
              padding: sticky ? '12px 28px' : '28px 28px 24px',
              transition: 'padding .15s',
              boxShadow: sticky ? '0 4px 20px rgba(0,0,0,0.3)' : 'none',
            }}>
            <div style={{
              maxWidth: sticky ? 1280 : 960, margin: '0 auto',
              display: sticky ? 'flex' : 'block', gap: 20, alignItems: 'center',
            }}>
              {/* Minimized thumbnail when sticky */}
              {sticky ? (
                <>
                  <div style={{ width: 200, flexShrink: 0, cursor: 'pointer' }} onClick={() => { setSticky(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                    {showIframe && currentVideo.youtube_id ? (
                      <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: 6, overflow: 'hidden', background: '#000' }}>
                        <iframe src={`https://www.youtube.com/embed/${currentVideo.youtube_id}?autoplay=1`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen />
                      </div>
                    ) : (
                      <div style={{ aspectRatio: '16/9', background: '#1a1208', borderRadius: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden' }} onClick={() => setShowIframe(true)}>
                        {(currentVideo.thumbnail || currentVideo.youtube_id) && (
                          <img src={currentVideo.thumbnail || `https://img.youtube.com/vi/${currentVideo.youtube_id}/mqdefault.jpg`} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                        <div style={{ fontSize: 32, opacity: 0.8, lineHeight: 1, position: 'relative', zIndex: 2 }}>▶</div>
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'white', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentVideo.title}</h2>
                    <div style={{ display: 'flex', gap: 12, fontSize: 11.5, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
                      {currentVideo.module && <span>{currentVideo.module.name}</span>}
                      <span>⏱ {currentVideo.duration || '--'}</span>
                      <span>👁 {currentVideo.views ? `${(currentVideo.views / 1000).toFixed(1)}k` : '0'} views</span>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ maxWidth: 960, margin: '0 auto' }}>
                  <div className="crumb" style={{ marginBottom: 12 }}>
                    <Link to="/" style={{ color: 'rgba(255,255,255,0.6)' }}>ホーム</Link><span className="sep" style={{ color: 'rgba(255,255,255,0.4)' }}> › </span>
                    <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>動画</span>
                  </div>
                  {showIframe && currentVideo.youtube_id ? (
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, marginBottom: 16, borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
                      <iframe src={`https://www.youtube.com/embed/${currentVideo.youtube_id}?autoplay=1`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen />
                    </div>
                  ) : (
                    <div style={{ aspectRatio: '16/9', background: '#1a1208', borderRadius: 'var(--r-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 16, cursor: 'pointer', width: '100%', position: 'relative', overflow: 'hidden' }} onClick={() => setShowIframe(true)}>
                      {(currentVideo.thumbnail || currentVideo.youtube_id) && (
                        <img src={currentVideo.thumbnail || `https://img.youtube.com/vi/${currentVideo.youtube_id}/mqdefault.jpg`} alt={currentVideo.title ? `${currentVideo.title} - SAP パンダ先生動画講座` : 'SAP パンダ先生動画講座'} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                      )}
                      <div style={{ textAlign: 'center', color: 'white', position: 'relative', zIndex: 2 }}>
                        <div style={{ fontSize: 64, marginBottom: 8, opacity: 0.9, lineHeight: 1 }}>▶</div>
                        <div style={{ fontSize: 13, opacity: 0.7 }}>クリックして再生</div>
                      </div>
                    </div>
                  )}
                  <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'white', margin: '0 0 6px' }}>{currentVideo.title}</h1>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12.5, color: 'rgba(255,255,255,0.5)' }}>
                    {currentVideo.module && <span>{currentVideo.module.name}</span>}
                    <span>⏱ {currentVideo.duration || '--'}</span>
                    <span>👁 {currentVideo.views ? `${(currentVideo.views / 1000).toFixed(1)}k` : '0'} views</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Video grid */}
        <section className="section" style={{ paddingTop: 24 }}>
          <div className="section-head" style={{ marginBottom: 20 }}>
            <div><div className="label">Video Library</div><h2>動画一覧<span className="accent-mark">.</span></h2></div>
            <div className="desc">パンダ先生のSAP解説動画。<br />見て聞いて理解しよう。</div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
            {[{ slug: '', name: 'すべて' }, { slug: 'fi', name: 'FI' }, { slug: 'co', name: 'CO' }, { slug: 'mm', name: 'MM' }, { slug: 'sd', name: 'SD' }, { slug: 'abap', name: 'ABAP' }, { slug: 's4', name: 'S/4' }].map(m => (
              <button key={m.slug || 'all'} onClick={() => filterByModule(m.slug)}
                style={{ padding: '6px 16px', borderRadius: 'var(--r-pill)', border: '1.5px solid', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600, borderColor: moduleFilter === m.slug ? 'var(--accent)' : 'var(--line-2)', background: moduleFilter === m.slug ? 'var(--accent-soft)' : 'var(--bg-card)', color: moduleFilter === m.slug ? 'var(--accent-deep)' : 'var(--ink-1)' }}>
                {m.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>読み込み中...</div>
          ) : videos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>動画がまだありません。</div>
          ) : (
            <>
              <div className="yt-videos" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {videos.map(v => (
                  <div key={v.id} className="yt-vid" onClick={() => openVideo(v)} style={{ cursor: 'pointer' }}>
                    <div className="thumb" style={{ aspectRatio: '16/9', width: '100%', background: `linear-gradient(135deg, ${v.module?.slug === 'fi' ? '#2f6d44' : v.module?.slug === 'abap' ? '#1f6f6f' : v.module?.slug === 'mm' ? '#a25411' : '#2c1d4a'}, ${v.module?.slug === 'fi' ? '#5a9d6e' : '#5a3a8a'})`, borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                      {v.thumbnail ? (
                        <img src={v.thumbnail} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : v.youtube_id ? (
                        <img src={`https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg`} alt={v.title ? `${v.title} - SAP パンダ先生` : 'SAP パンダ先生動画講座'} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : null}
                      {v.youtube_id && <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                      </div>}
                      {v.duration && <span style={{ position: 'absolute', right: 8, bottom: 8, background: 'rgba(0,0,0,0.75)', color: 'white', fontSize: 11, fontFamily: 'var(--font-mono)', padding: '2px 6px', borderRadius: 4, zIndex: 2 }}>{v.duration}</span>}
                    </div>
                    <div className="vid-info" style={{ padding: '12px 0' }}>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--ink-0)', margin: '0 0 4px', lineHeight: 1.4 }}>{v.title}</h4>
                      <div style={{ display: 'flex', gap: 10, fontSize: 11.5, color: 'var(--ink-3)' }}>
                        {v.module && <span>{v.module.name}</span>}
                        {v.views > 0 && <span>👁 {(v.views / 1000).toFixed(1)}k views</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 32 }}>
                  <button onClick={() => goToPage(page - 1)} disabled={page <= 1}
                    style={{ padding: '8px 14px', borderRadius: 'var(--r-sm)', border: '1px solid var(--line-2)', background: 'var(--bg-card)', cursor: page <= 1 ? 'default' : 'pointer', opacity: page <= 1 ? 0.4 : 1, fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
                    ‹
                  </button>
                  {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                    let p: number
                    if (totalPages <= 10) p = i + 1
                    else if (page <= 5) p = i + 1
                    else if (page >= totalPages - 4) p = totalPages - 9 + i
                    else p = page - 5 + i
                    if (p >= 1 && p <= totalPages) {
                      return (
                        <button key={p} onClick={() => goToPage(p)}
                          style={{
                            minWidth: 36, height: 36, borderRadius: 'var(--r-sm)', border: '1px solid', cursor: 'pointer',
                            fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
                            borderColor: page === p ? 'var(--accent)' : 'var(--line-2)',
                            background: page === p ? 'var(--accent-soft)' : 'var(--bg-card)',
                            color: page === p ? 'var(--accent-deep)' : 'var(--ink-1)',
                          }}>
                          {p}
                        </button>
                      )
                    }
                    return null
                  })}
                  <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages}
                    style={{ padding: '8px 14px', borderRadius: 'var(--r-sm)', border: '1px solid var(--line-2)', background: 'var(--bg-card)', cursor: page >= totalPages ? 'default' : 'pointer', opacity: page >= totalPages ? 0.4 : 1, fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
                    ›
                  </button>
                  <span style={{ fontSize: 12, color: 'var(--ink-3)', marginLeft: 8 }}>{page}/{totalPages}</span>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <SiteFooter />
      {settings.showFloatingPanda && <FloatingPanda />}
    </>
  )
}
