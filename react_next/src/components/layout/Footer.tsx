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
    </footer>
  );
}
