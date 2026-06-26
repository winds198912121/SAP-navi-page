// ===========================================================
// MobileBottomNav — モバイル下部固定ナビゲーション
// スマートフォンでの主要画面間移動をスムーズに
// ===========================================================

import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

interface NavItem {
  to: string
  label: string
  icon: string
  activeIcon: string
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'ホーム', icon: '🏠', activeIcon: '🏠' },
  { to: '/modules', label: 'モジュール', icon: '🧩', activeIcon: '🧩' },
  { to: '/paths', label: '学習パス', icon: '🎯', activeIcon: '🎯' },
  { to: '/cases', label: '案件', icon: '💼', activeIcon: '💼' },
]

export default function MobileBottomNav() {
  const { pathname } = useLocation()
  const { user } = useAuth()

  // Only show on public pages, not admin
  if (pathname.startsWith('/admin')) return null

  return (
    <nav className="mob-bottom-nav">
      {NAV_ITEMS.map(item => {
        const active = item.to === '/' ? pathname === '/' : pathname.startsWith(item.to)
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`mob-nav-item ${active ? 'active' : ''}`}
          >
            <span className="mob-nav-icon">{active ? item.activeIcon : item.icon}</span>
            <span className="mob-nav-label">{item.label}</span>
          </Link>
        )
      })}
      {user ? (
        <Link to="/profile" className={`mob-nav-item ${pathname.startsWith('/profile') ? 'active' : ''}`}>
          <span className="mob-nav-icon">👤</span>
          <span className="mob-nav-label">マイページ</span>
        </Link>
      ) : (
        <Link to="/login" className="mob-nav-item">
          <span className="mob-nav-icon">🔑</span>
          <span className="mob-nav-label">ログイン</span>
        </Link>
      )}
    </nav>
  )
}
