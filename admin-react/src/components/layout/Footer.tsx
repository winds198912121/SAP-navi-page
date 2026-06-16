import { Link } from 'react-router-dom'
import { SAP_MODULES } from '../../types'

const PandaAvatar = ({ size = 38 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="-4 -8 108 108">
    <circle cx="50" cy="52" r="46" fill="#e8f0fb" opacity="0.4" />
    <g transform="translate(0,0)">
      <ellipse cx="22" cy="18" rx="13" ry="12" fill="#1a1612" />
      <ellipse cx="78" cy="18" rx="13" ry="12" fill="#1a1612" />
      <path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" />
      <g>
        <path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" />
        <path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" />
      </g>
      <circle cx="30" cy="44" r="3.4" fill="#fff" />
      <circle cx="30" cy="44" r="2.4" fill="#0e0a05" />
      <circle cx="70" cy="44" r="3.4" fill="#fff" />
      <circle cx="70" cy="44" r="2.4" fill="#0e0a05" />
      <ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" />
      <path d="M 43 70 Q 50 74 57 70" fill="none" stroke="#1a1612" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M 50 64 L 50 67" stroke="#1a1612" strokeWidth="1.4" strokeLinecap="round" />
    </g>
  </svg>
)

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="foot-wrap">
        <div>
          <Link className="brand" to="/" style={{ marginBottom: 6 }}>
            <div className="logo-panda" style={{ filter: 'brightness(1.05)' }}>
              <PandaAvatar size={38} />
            </div>
            <div className="brand-text">
              <div className="brand-name">パンダ<span className="sensei" style={{ color: '#7dd49c' }}>先生</span></div>
              <div className="brand-sub">SAP NAVI</div>
            </div>
          </Link>
          <p className="foot-about">
            SAPコンサル、開発者、ユーザー部門 — すべての SAPer のために、
            パンダ先生がやさしく解説する SAP ナレッジサイト。
          </p>
          <div className="foot-socials">
            {['X', 'YT', 'GH', 'RSS'].map(s => (
              <a key={s} href="#" className="foot-soc" style={{ fontSize: 11, fontWeight: 600 }}>{s}</a>
            ))}
          </div>
        </div>
        <div className="foot-col">
          <h5>モジュール</h5>
          <ul>
            {SAP_MODULES.slice(0, 6).map(m => (
              <li key={m.code}><Link to={`/category/${m.slug}`}>{m.code} · {m.name_ja}</Link></li>
            ))}
          </ul>
        </div>
        <div className="foot-col">
          <h5>コンテンツ</h5>
          <ul>
            <li><Link to="/#paths">学習パス</Link></li>
            <li><Link to="/#quiz">今日の一問</Link></li>
            <li><Link to="/#youtube">動画講座</Link></li>
            <li><Link to="/glossary">用語集</Link></li>
            <li><Link to="/trends">SAPトレンド</Link></li>
            <li><Link to="/career">転職ガイド</Link></li>
          </ul>
        </div>
        <div className="foot-col">
          <h5>パンダ先生</h5>
          <ul>
            <li><Link to="/about">サイトについて</Link></li>
            <li><Link to="/team">執筆メンバー</Link></li>
            <li><Link to="/contact">お問い合わせ</Link></li>
            <li><Link to="/privacy">プライバシー</Link></li>
            <li><Link to="/terms">利用規約</Link></li>
          </ul>
        </div>
      </div>
      <div className="foot-bot">
        <span className="copy">© 2026 パンダ先生 SAP NAVI. 大好きな SAP を、もっと身近に。</span>
        <span>Made with 🎋 in Tokyo</span>
      </div>
    </footer>
  )
}
