// ===========================================================
// HeaderDropdown — ユーザーアイコンクリック時のドロップダウン
// ===========================================================

import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

interface Props {
  onClose: () => void
}

const menuItemStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8,
  padding: '8px 10px', borderRadius: 'var(--r-sm)',
  color: 'var(--ink-1)', textDecoration: 'none',
  fontSize: 13, transition: 'background .1s',
}

const menuIconStyle: React.CSSProperties = {
  width: 20, textAlign: 'center', fontSize: 15, flexShrink: 0,
}

const commonBtnStyle: React.CSSProperties = {
  width: '100%', border: 'none', background: 'none',
  cursor: 'pointer', fontFamily: 'inherit', fontSize: 13,
  textAlign: 'left',
}

export default function HeaderDropdown({ onClose }: Props) {
  const { user, logout } = useAuth()
  const ref = useRef<HTMLDivElement>(null)
  const [loggingOut, setLoggingOut] = useState(false)
  const [hoverIdx, setHoverIdx] = useState(-1)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const handleLogout = () => {
    setLoggingOut(true)
    logout()
    onClose()
  }

  if (!user) return null

  const isAdmin = user.roles?.includes('administrator')

  const items: { type: 'link' | 'divider' | 'btn'; to?: string; icon?: string; label?: string; action?: () => void; color?: string }[] = [
    { type: 'link', to: '/profile', icon: '👤', label: 'マイプロフィール' },
    { type: 'link', to: '/membership', icon: '⭐', label: '会員プラン' },
    { type: 'link', to: '/profile?tab=points', icon: '🏆', label: '学習記録・ポイント' },
  ]

  if (isAdmin) {
    items.push({ type: 'divider' })
    items.push({ type: 'link', to: '/admin/courses', icon: '⚙', label: '管理画面' })
  }

  items.push({ type: 'divider' })
  items.push({ type: 'btn', icon: '🚪', label: loggingOut ? 'ログアウト中...' : 'ログアウト', action: handleLogout, color: 'var(--rose)' })

  return (
    <div ref={ref} style={{
      position: 'absolute', top: 'calc(100% + 8px)', right: 0,
      background: 'var(--bg-card)', borderRadius: 'var(--r-lg)',
      border: '1px solid var(--line-2)', boxShadow: 'var(--sh-3)',
      minWidth: 220, padding: '6px', zIndex: 100,
    }}>
      {/* User info */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 10px 10px', borderBottom: '1px solid var(--line-1)',
        marginBottom: 4,
      }}>
        <img src={user.avatarUrl || ''} alt={user.displayName}
          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', background: 'var(--bg-tint)' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-0)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.displayName}
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{user.email}</div>
        </div>
      </div>

      {/* Menu items */}
      {items.map((item, i) => {
        if (item.type === 'divider') {
          return <div key={i} style={{ borderTop: '1px solid var(--line-1)', margin: '4px 10px' }} />
        }
        if (item.type === 'btn') {
          return (
            <button key={i} onClick={item.action} disabled={loggingOut} style={{
              ...menuItemStyle, ...commonBtnStyle,
              background: hoverIdx === i ? 'var(--bg-tint)' : 'transparent',
              color: item.color || 'var(--ink-1)',
            }} onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(-1)}>
              <span style={menuIconStyle}>{item.icon}</span> {item.label}
            </button>
          )
        }
        return (
          <Link key={i} to={item.to!} onClick={onClose} style={{
            ...menuItemStyle,
            background: hoverIdx === i ? 'var(--bg-tint)' : 'transparent',
            color: item.color || 'var(--ink-1)',
          }} onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(-1)}>
            <span style={menuIconStyle}>{item.icon}</span> {item.label}
          </Link>
        )
      })}
    </div>
  )
}
