// ===========================================================
// StaticPage — 静的ページラッパー（SEO 対応）
// ===========================================================
import { Link } from 'react-router-dom'
import SiteHeader from './Header'
import SiteFooter from './Footer'
import Seo from './Seo'
import { useTheme } from '../../hooks/useTheme'

export default function StaticPage({ title, breadcrumb, description, path, children }: {
  title: string; breadcrumb?: string; description?: string; path?: string; children: React.ReactNode
}) {
  const { settings } = useTheme()
  return (
    <>
      <Seo title={title} description={description || `${title} — SAP パンダ先生 NAVI`} path={path || `/${title.toLowerCase()}`} />
      <div className="page-bg" /><SiteHeader />
    <main style={{ position: 'relative', zIndex: 2, maxWidth: 720, margin: '0 auto', padding: '48px 28px 80px' }}>
      <div className="crumb" style={{ marginBottom: 16 }}>
        <Link to="/" style={{ color: 'var(--ink-2)' }}>ホーム</Link><span className="sep"> › </span>
        <span className="now">{breadcrumb || title}</span>
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, color: 'var(--ink-0)', margin: '0 0 24px' }}>{title}</h1>
      <div className="art-content">{children}</div>
    </main>
    <SiteFooter /></>
  )
}
