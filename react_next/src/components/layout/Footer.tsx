import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-widgets container">
        <div className="footer-column footer-col-brand">
          <h3 className="footer-title">🐼 SAP パンダ先生 NAVI</h3>
          <p className="footer-desc">SAP学習者のための総合プラットフォーム</p>
        </div>
        <div className="footer-column">
          <h4 className="footer-title-sm">コンテンツ</h4>
          <ul className="footer-links">
            <li><Link href="/modules">SAPモジュール</Link></li>
            <li><Link href="/paths">学習パス</Link></li>
            <li><Link href="/courses">コース</Link></li>
            <li><Link href="/video">動画</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4 className="footer-title-sm">キャリア</h4>
          <ul className="footer-links">
            <li><Link href="/cases">案件一覧</Link></li>
            <li><Link href="/glossary">用語集</Link></li>
            <li><Link href="/trends">トレンド</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4 className="footer-title-sm">サイト情報</h4>
          <ul className="footer-links">
            <li><Link href="/about">このサイトについて</Link></li>
            <li><Link href="/team">チーム</Link></li>
            <li><Link href="/contact">お問い合わせ</Link></li>
            <li><Link href="/privacy">プライバシーポリシー</Link></li>
            <li><Link href="/terms">利用規約</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom container">
        <div className="footer-copyright">&copy; {new Date().getFullYear()} SAP パンダ先生 NAVI</div>
      </div>
      <style jsx>{`
        .site-footer { background: var(--color-bg-dark); color: var(--color-text-inverse); padding: var(--spacing-3xl) 0 var(--spacing-xl); margin-top: var(--spacing-3xl); }
        .footer-widgets { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: var(--spacing-xl); margin-bottom: var(--spacing-2xl); }
        .footer-title { font-family: var(--font-heading); font-size: var(--text-xl); margin-bottom: var(--spacing-sm); }
        .footer-title-sm { font-family: var(--font-heading); font-size: var(--text-base); margin-bottom: var(--spacing-md); color: var(--color-primary-light); }
        .footer-desc { color: rgba(255,255,255,0.6); font-size: var(--text-sm); }
        .footer-links { list-style: none; padding: 0; margin: 0; }
        .footer-links li { margin-bottom: var(--spacing-sm); }
        .footer-links a { color: rgba(255,255,255,0.7); font-size: var(--text-sm); }
        .footer-links a:hover { color: #fff; }
        .footer-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: var(--spacing-lg); border-top: 1px solid rgba(255,255,255,0.1); }
        .footer-copyright { font-size: var(--text-sm); color: rgba(255,255,255,0.5); }
        @media (max-width: 768px) { .footer-widgets { grid-template-columns: 1fr; } }
      `}</style>
    </footer>
  );
}
