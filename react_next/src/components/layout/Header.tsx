'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import LoginModal from '@/components/auth/LoginModal';

/** クッキーから値を読み取る */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

/** Cookie を削除する */
function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`;
}

const NAV_LINKS = [
  { id: 'home', label: 'ホーム', href: '/' },
  { id: 'modules', label: 'モジュール', href: '/modules' },
  { id: 'paths', label: '学習パス', href: '/paths' },
  { id: 'quiz', label: '今日の一問', href: '/quiz-page' },
  { id: 'cases', label: '案件・仕事', href: '/cases' },
  { id: 'yt', label: '動画', href: '/video' },
];

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
);

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<{ display_name: string; email: string; roles?: string[] } | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  // Determine active nav
  const active = NAV_LINKS.find(l => l.href !== '/' && pathname.startsWith(l.href))?.id || (pathname === '/' ? 'home' : '');

  // ログイン状態を復元（aladdin_token cookie → /users/me）
  const fetchUser = useCallback(async () => {
    const token = getCookie('aladdin_token');
    if (!token) { setUser(null); setUserLoading(false); return; }
    try {
      const res = await fetch('/wp-json/sap/v1/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success && json.data) {
        setUser(json.data);
      } else {
        // Token expired
        deleteCookie('aladdin_token');
        setUser(null);
      }
    } catch {
      setUser(null);
    }
    setUserLoading(false);
  }, []);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  // LoginModal が閉じられたら再フェッチ（新規登録 / ログイン後）
  const handleLoginClose = useCallback(() => {
    setShowLogin(false);
    fetchUser();
  }, [fetchUser]);

  // ログアウト
  const handleLogout = useCallback(() => {
    deleteCookie('aladdin_token');
    setUser(null);
    setDropdownOpen(false);
    router.push('/');
  }, [router]);

  // ⌘K / Ctrl+K → 検索ページへ
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        router.push('/search');
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [router]);

  // ユーザー用 avatar fallback
  const userInitial = user?.display_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?';

  return (
    <>
      <header className="site-header">
        <div className="nav-wrap">
          <Link className="brand" href="/">
            <div className="logo-panda"><PandaAvatar size={38} /></div>
            <div className="brand-text">
              <div className="brand-name">パンダ<span className="sensei">先生</span></div>
              <div className="brand-sub">SAP NAVI · パンダ ナビ</div>
            </div>
          </Link>

          <nav className="nav-main">
            {NAV_LINKS.map(l => (
              <Link key={l.id} href={l.href}
                className={`nav-link ${active === l.id ? 'active' : ''}`}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="nav-right">
            <div className="search-pill" onClick={() => router.push('/search')} style={{ cursor: 'pointer' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
              </svg>
              <span style={{ flex: 1, fontSize: 13, color: 'var(--ink-3)', userSelect: 'none' }}>モジュール、用語、エラー番号...</span>
              <span className="kbd">⌘K</span>
            </div>

            {/* ---- ログイン / ユーザー情報 ---- */}
            <div style={{ position: 'relative' }}>
              {userLoading ? (
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--line-1)', animation: 'pulse 1.2s ease-in-out infinite' }} />
              ) : user ? (
                <>
                  <button
                    onClick={() => setDropdownOpen(prev => !prev)}
                    className="user-menu-btn"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '4px 12px 4px 4px',
                      borderRadius: 'var(--r-full)', border: '1px solid var(--line-2)',
                      background: 'transparent', cursor: 'pointer',
                      fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
                      color: 'var(--ink-0)', transition: 'all .15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line-2)')}
                  >
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'var(--accent)', color: '#fff',
                      fontSize: 13, fontWeight: 700,
                    }}>{userInitial}</span>
                    <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.display_name || 'ユーザー'}
                    </span>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"
                      style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}>
                      <path d="M2 3.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <>
                      <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setDropdownOpen(false)} />
                      <div style={{
                        position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 100,
                        minWidth: 220, background: 'var(--bg-card)',
                        border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)',
                        boxShadow: '0 8px 24px rgba(0,0,0,.12)',
                        overflow: 'hidden',
                      }}>
                        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--line-1)' }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-0)' }}>{user.display_name || 'ユーザー'}</div>
                          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{user.email || ''}</div>
                          {user.roles?.includes('administrator') && (
                            <span style={{ display: 'inline-block', marginTop: 6, padding: '2px 8px', borderRadius: 999, background: 'var(--accent-soft)', color: 'var(--accent-deep)', fontSize: 11, fontWeight: 600 }}>管理者</span>
                          )}
                        </div>
                        <Link href="/profile" onClick={() => setDropdownOpen(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: 14, color: 'var(--ink-0)', textDecoration: 'none', transition: 'background .1s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--line-1)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                          👤 プロフィール
                        </Link>
                        {user.roles?.includes('administrator') && (
                          <Link href="/admin" onClick={() => setDropdownOpen(false)}
                            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: 14, color: 'var(--ink-0)', textDecoration: 'none', transition: 'background .1s' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--line-1)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                            ⚙ 管理画面
                          </Link>
                        )}
                        <div style={{ borderTop: '1px solid var(--line-1)' }}>
                          <button onClick={handleLogout}
                            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: 14, color: 'var(--rose)', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', fontFamily: 'inherit', transition: 'background .1s' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--rose-soft)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                            🚪 ログアウト
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <button className="btn sm accent" onClick={() => setShowLogin(true)}
                  style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                  無料登録
                </button>
              )}
            </div>
            {showLogin && <LoginModal onClose={handleLoginClose} />}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(prev => !prev)}
            aria-label="メニュー"
            className="mobile-menu-btn"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, top: 64, zIndex: 90,
          background: 'var(--bg-card)', borderTop: '1px solid var(--line-2)',
          display: 'flex', flexDirection: 'column', padding: '16px 20px', gap: 4,
          overflowY: 'auto', animation: 'modalIn .15s ease-out',
        }}>
          {user && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px', marginBottom: 4,
              borderRadius: 'var(--r-md)',
              background: 'var(--accent-soft)',
            }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 36, height: 36, borderRadius: '50%',
                background: 'var(--accent)', color: '#fff',
                fontSize: 16, fontWeight: 700,
              }}>{userInitial}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-0)' }}>{user.display_name}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{user.email}</div>
              </div>
            </div>
          )}
          {NAV_LINKS.map(l => (
            <Link key={l.id} href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 12px', borderRadius: 'var(--r-md)',
                fontSize: 15, fontWeight: 600, color: 'var(--ink-0)',
                textDecoration: 'none', minHeight: 48,
              }}>
              {l.label}
            </Link>
          ))}
          <div style={{ borderTop: '1px solid var(--line-1)', margin: '8px 0', paddingTop: 12 }}>
            {user && (
              <Link href="/profile" onClick={() => setMobileOpen(false)}
                style={{ display: 'block', padding: '10px 12px', fontSize: 14, color: 'var(--ink-1)', textDecoration: 'none' }}>
                👤 プロフィール
              </Link>
            )}
            {user?.roles?.includes('administrator') && (
              <Link href="/admin" onClick={() => setMobileOpen(false)}
                style={{ display: 'block', padding: '10px 12px', fontSize: 14, color: 'var(--ink-1)', textDecoration: 'none' }}>
                ⚙ 管理画面
              </Link>
            )}
            <Link href="/glossary" onClick={() => setMobileOpen(false)}
              style={{ display: 'block', padding: '10px 12px', fontSize: 14, color: 'var(--ink-1)', textDecoration: 'none' }}>
              📚 用語集
            </Link>
            <Link href="/trends" onClick={() => setMobileOpen(false)}
              style={{ display: 'block', padding: '10px 12px', fontSize: 14, color: 'var(--ink-1)', textDecoration: 'none' }}>
              📈 SAPトレンド
            </Link>
            <Link href="/career" onClick={() => setMobileOpen(false)}
              style={{ display: 'block', padding: '10px 12px', fontSize: 14, color: 'var(--ink-1)', textDecoration: 'none' }}>
              🎯 転職ガイド
            </Link>
            {user && (
              <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                style={{ display: 'block', padding: '10px 12px', fontSize: 14, color: 'var(--rose)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', width: '100%', textAlign: 'left' }}>
                🚪 ログアウト
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
