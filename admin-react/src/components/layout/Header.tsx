import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { NAV_LINKS } from '../../types'
import { useAuth } from '../../hooks/useAuth'
import LoginModal from '../auth/LoginModal'
import HeaderDropdown from './HeaderDropdown'
import MobileMenu from './MobileMenu'

const PandaAvatar = ({ size = 38 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="-4 -8 108 108">
    <circle cx="50" cy="52" r="46" fill="#e8f0fb" opacity="0.4" />
    <g transform="translate(0,0)">
      <g style={{ transformOrigin: '24px 22px' }}>
        <ellipse cx="22" cy="18" rx="13" ry="12" fill="#1a1612" />
        <ellipse cx="22" cy="20" rx="6" ry="5" fill="#3a2e22" />
      </g>
      <g style={{ transformOrigin: '76px 22px', animationDelay: '0.3s' }}>
        <ellipse cx="78" cy="18" rx="13" ry="12" fill="#1a1612" />
        <ellipse cx="78" cy="20" rx="6" ry="5" fill="#3a2e22" />
      </g>
      <path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" />
      <g>
        <path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" />
        <path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" />
      </g>
      <circle cx="30" cy="44" r="3.4" fill="#fff" />
      <circle cx="30" cy="44" r="2.4" fill="#0e0a05" />
      <circle cx="70" cy="44" r="3.4" fill="#fff" />
      <circle cx="70" cy="44" r="2.4" fill="#0e0a05" />
      <ellipse cx="18" cy="64" rx="5.5" ry="3" fill="#f4b8c4" opacity="0.7" />
      <ellipse cx="82" cy="64" rx="5.5" ry="3" fill="#f4b8c4" opacity="0.7" />
      <ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" />
      <path d="M 50 64 L 50 67" stroke="#1a1612" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M 43 70 Q 50 74 57 70" fill="none" stroke="#1a1612" strokeWidth="1.8" strokeLinecap="round" />
    </g>
  </svg>
)

export default function SiteHeader({ active = 'home' }: { active?: string }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showLogin, setShowLogin] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  // ⌘K / Ctrl+K → 検索ページへ
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        navigate('/search')
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [navigate])

  return (
    <>
      <header className="site-header">
        <div className="nav-wrap">
          <Link className="brand" to="/">
            <div className="logo-panda"><PandaAvatar size={38} /></div>
            <div className="brand-text">
              <div className="brand-name">パンダ<span className="sensei">先生</span></div>
              <div className="brand-sub">SAP NAVI · パンダ ナビ</div>
            </div>
          </Link>
          <nav className="nav-main">
            {NAV_LINKS.map(l => (
              <Link key={l.id} to={l.href}
                className={`nav-link ${active === l.id ? 'active' : ''}`}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="nav-right">
            <div className="search-pill" onClick={() => navigate('/search')} style={{ cursor: 'pointer' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
              </svg>
              <span style={{ flex: 1, fontSize: 13, color: 'var(--ink-3)', userSelect: 'none' }}>モジュール、用語、エラー番号...</span>
              <span className="kbd">⌘K</span>
            </div>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, userSelect: 'none' }}
                  onClick={() => setShowDropdown(prev => !prev)}>
                  <img src={user.avatarUrl || ''} alt={user.displayName}
                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-soft)' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-0)', whiteSpace: 'nowrap' }}>{user.displayName}</span>
                </div>
                {showDropdown && <HeaderDropdown onClose={() => setShowDropdown(false)} />}
              </div>
            ) : (
              <button className="btn sm accent" onClick={() => setShowLogin(true)}
                style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                無料登録
              </button>
            )}
          </div>
          <MobileMenu />
        </div>
      </header>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  )
}
