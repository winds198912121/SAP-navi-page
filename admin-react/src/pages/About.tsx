// ===========================================================
// About — サイトについて /about
// ===========================================================
import { Link } from 'react-router-dom'
import Seo from '../components/layout/Seo'
import SiteHeader from '../components/layout/Header'
import SiteFooter from '../components/layout/Footer'
import { useTheme } from '../hooks/useTheme'

export default function About() {
  const { settings } = useTheme()
  return (
    <><Seo title="サイトについて" description="SAP パンダ先生 NAVI のサイト概要。ミッション・運営情報をご紹介。FI/CO/MM/SD/ABAP など SAP 学習者向けの総合ナレッジサイトです。" path="/about" breadcrumbs={[{ name: 'ホーム', path: '/' }, { name: 'サイトについて', path: '/about' }]} /><div className="page-bg" /><SiteHeader />
    <main style={{ position: 'relative', zIndex: 2, maxWidth: 720, margin: '0 auto', padding: '48px 28px 80px' }}>
      <div className="crumb" style={{ marginBottom: 16 }}>
        <Link to="/" style={{ color: 'var(--ink-2)' }}>ホーム</Link><span className="sep"> › </span>
        <span className="now">サイトについて</span>
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, color: 'var(--ink-0)', margin: '0 0 24px' }}>サイトについて</h1>
      <div className="art-content">
        <p>SAP パンダ先生 NAVI は、SAP に関わるすべての人に向けた総合ナレッジサイトです。</p>
        <h2>私たちのミッション</h2>
        <p>SAP の世界は広く、専門用語も多く、「どこから始めればいいのかわからない」という声をよく聞きます。パンダ先生 NAVI は、そんな迷える SAPer のために、やさしく・わかりやすい解説を提供します。</p>
        <h2>カバーする領域</h2>
        <ul><li>FI（財務会計）、CO（管理会計）、MM（購買管理）、SD（販売管理）</li><li>PP（生産計画）、HR（人事管理）、ABAP（開発）、Basis（基盤）</li><li>S/4HANA、Fiori、クラウド、最新トピック</li></ul>
        <h2>運営情報</h2>
        <p>運営: パンダ先生プロジェクトチーム<br />連絡先: お問い合わせフォームよりご連絡ください。</p>
      </div>
    </main>
    <SiteFooter /></>
  )
}
