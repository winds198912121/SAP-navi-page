'use client'
// ===========================================================
// AdminLayout — 管理后台布局（階層型メニュー + ルート保護）
// ===========================================================

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import LoginModal from '@/components/auth/LoginModal'

interface MenuItem { path: string; label: string; icon: string }
interface MenuGroup { label: string; icon: string; children: MenuItem[] }

const MENU_GROUPS: MenuGroup[] = [
  {
    label: 'ダッシュボード', icon: '📊',
    children: [{ path: '/admin', label: '統計概覧', icon: '📊' }],
  },
  {
    label: 'マスター管理', icon: '📋',
    children: [
      { path: '/admin/modules', label: 'モジュール管理', icon: '🧩' },
      { path: '/admin/articles', label: '記事管理', icon: '📰' },
    ],
  },
  {
    label: 'ラーニング管理', icon: '📚',
    children: [
      { path: '/admin/courses', label: 'コース管理', icon: '📚' },
      { path: '/admin/lessons', label: 'レッスン', icon: '📝' },
      { path: '/admin/knowledge', label: 'ナレッジ管理', icon: '📖' },
      { path: '/admin/videos', label: '動画管理', icon: '🎬' },
      { path: '/admin/quizzes', label: '每日一问', icon: '❓' },
      { path: '/admin/learning-paths', label: '学習パス', icon: '🎯' },
      { path: '/admin/notes', label: '记事', icon: '📝' },
    ],
  },
  {
    label: 'ビジネス管理', icon: '💼',
    children: [
      { path: '/admin/cases', label: '案件管理', icon: '💼' },
      { path: '/admin/applications', label: '応募管理', icon: '📋' },
      { path: '/admin/contact', label: 'お問い合わせ', icon: '📨' },
    ],
  },
  {
    label: 'システム管理', icon: '⚙',
    children: [
      { path: '/admin/pages', label: '固定ページ', icon: '📄' },
      { path: '/admin/users', label: 'ユーザー管理', icon: '👥' },
      { path: '/admin/plugins', label: 'プラグイン', icon: '🔌' },
      { path: '/admin/seo-geo', label: 'SEO/GEO', icon: '🔍' },
    ],
  },
]

function NavGroup({ group, currentPath }: { group: MenuGroup; currentPath: string }) {
  const [open, setOpen] = useState(() => group.children.some(c => currentPath.startsWith(c.path)))
  const activeCount = group.children.filter(c => currentPath.startsWith(c.path)).length

  return (
    <div style={{ marginBottom: 6 }}>
      <div onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
          padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700,
          color: activeCount > 0 ? '#8bc9a0' : 'rgba(255,255,255,0.5)',
          letterSpacing: '0.04em', textTransform: 'uppercase',
          transition: 'color .12s', userSelect: 'none',
        }}>
        <span style={{ fontSize: 11 }}>{open ? '▾' : '▸'}</span>
        <span>{group.label}</span>
      </div>
      {open && (
        <div style={{ paddingLeft: 8 }}>
          {group.children.map(item => {
            const active = currentPath.startsWith(item.path)
            return (
              <Link key={item.path} href={item.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 14px', borderRadius: 10,
                  color: active ? '#8bc9a0' : 'rgba(255,255,255,0.65)',
                  textDecoration: 'none', fontSize: 13.5, fontWeight: active ? 600 : 500,
                  background: active ? 'rgba(90,157,110,0.2)' : 'transparent',
                  transition: 'all .12s', marginBottom: 1,
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}>
                <span style={{ fontSize: 16, width: 22, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => { setSidebarOpen(false) }, [pathname])

  useEffect(() => {
    const checkAuth = async () => {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)aladdin_token\s*=\s*([^;]*).*$)|^.*$/, '$1')
      if (!token) { setLoading(false); return }
      try {
        const res = await fetch('/wp-json/sap/v1/users/me', {
          headers: { 'Authorization': `Bearer ${token}` },
          cache: 'no-store',
        })
        const json = await res.json()
        if (json.success && json.data) {
          setUser(json.data)
          if (!json.data.roles?.includes('administrator')) setUser(null)
        }
      } catch {}
      setLoading(false)
    }
    checkAuth()
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f5f0e8', color: '#7a6e58' }}>
      読み込み中...
    </div>
  )

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f5f0e8', color: '#7a6e58', padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🚫</div>
        <h2 style={{ fontFamily: "'Zen Maru Gothic', system-ui, sans-serif", fontSize: 22, color: '#2a2317', margin: '0 0 8px' }}>アクセス権限がありません</h2>
        <p style={{ fontSize: 14, margin: '0 0 20px', maxWidth: 360 }}>この管理画面には管理者のみアクセスできます。ログインしてください。</p>
        <button onClick={() => setShowLogin(true)} style={{ padding: '10px 24px', borderRadius: 999, background: '#2a2317', color: 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}>ログイン</button>
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <button className="admin-mobile-toggle" onClick={() => setSidebarOpen(prev => !prev)} aria-label="メニュー">
        {sidebarOpen ? '✕' : '☰'}
      </button>
      {sidebarOpen && <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />}
      <aside className={`admin-sidebar${sidebarOpen ? ' admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar-head">
          <Link href="/admin/courses" className="admin-logo">🎋 SAP Panda</Link>
          <span className="admin-badge">管理</span>
        </div>
        <nav className="admin-nav" style={{ padding: '8px 10px', overflowY: 'auto', flex: 1 }}>
          {MENU_GROUPS.map(group => (
            <NavGroup key={group.label} group={group} currentPath={pathname} />
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-user">
            <img src={user.avatar_url || ''} alt={user.display_name}
              className="admin-avatar"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            <div className="admin-user-info">
              <div className="admin-user-name">{user.display_name || '管理者'}</div>
              <div className="admin-user-role">管理者</div>
            </div>
          </div>
          <Link href="/" className="admin-back-link">← サイトに戻る</Link>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  )
}
