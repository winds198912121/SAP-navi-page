'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/', label: 'ホーム' },
  { href: '/modules', label: 'モジュール' },
  { href: '/paths', label: '学習パス' },
  { href: '/courses', label: 'コース' },
  { href: '/quiz-page', label: 'クイズ' },
  { href: '/cases', label: '案件' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="site-header">
        <div className="header-inner container">
          <div className="site-branding">
            <Link href="/" className="site-title">🐼 SAP パンダ先生 NAVI</Link>
          </div>
          <nav className="main-navigation">
            <ul className="nav-menu">
              {NAV_ITEMS.map(item => (
                <li key={item.href} className={pathname === item.href ? 'current-menu-item' : ''}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="header-actions">
            <button className="search-toggle" onClick={() => setSearchOpen(!searchOpen)} aria-label="検索">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
            <Link href="/login" className="btn btn-primary btn-sm">ログイン</Link>
            <Link href="/register" className="btn btn-outline btn-sm">登録</Link>
            <button className="mobile-menu-toggle" onClick={() => setMenuOpen(true)} aria-label="メニュー">
              <span className="hamburger-box"><span className="hamburger-inner"></span></span>
            </button>
          </div>
        </div>
        {searchOpen && (
          <div className="header-search">
            <form action="/search" className="search-form" onSubmit={() => setSearchOpen(false)}>
              <input type="search" name="q" placeholder="記事を検索…" required />
              <button type="submit">検索</button>
            </form>
          </div>
        )}
      </header>
      {menuOpen && (
        <div className="mobile-menu-overlay active" onClick={() => setMenuOpen(false)}>
          <div className="mobile-menu-panel active" onClick={e => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <span className="mobile-menu-title">メニュー</span>
              <button className="mobile-menu-close" onClick={() => setMenuOpen(false)}>&times;</button>
            </div>
            <ul className="mobile-nav">
              {NAV_ITEMS.map(item => (
                <li key={item.href}><Link href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</Link></li>
              ))}
              <li><Link href="/search" onClick={() => setMenuOpen(false)}>検索</Link></li>
              <li><Link href="/about" onClick={() => setMenuOpen(false)}>このサイトについて</Link></li>
              <li><Link href="/contact" onClick={() => setMenuOpen(false)}>お問い合わせ</Link></li>
            </ul>
            <div className="mobile-menu-auth">
              <Link href="/login" className="btn btn-primary btn-block" onClick={() => setMenuOpen(false)}>ログイン</Link>
              <Link href="/register" className="btn btn-outline btn-block" onClick={() => setMenuOpen(false)}>新規登録</Link>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .site-header {
          position: sticky; top: 0; z-index: 1000;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--color-border-light);
          height: var(--header-height);
        }
        .header-inner {
          display: flex; align-items: center; justify-content: space-between;
          height: 100%;
        }
        .site-title { font-family: var(--font-heading); font-size: var(--text-xl); font-weight: 700; color: var(--color-text); white-space: nowrap; }
        .site-title:hover { color: var(--color-primary); }
        .nav-menu { display: flex; gap: var(--spacing-xs); list-style: none; padding: 0; margin: 0; }
        .nav-menu li { margin: 0; }
        .nav-menu a {
          display: block; padding: var(--spacing-sm) var(--spacing-md);
          color: var(--color-text); font-size: var(--text-sm); font-weight: 500;
          border-radius: var(--radius-md); transition: all var(--transition-fast);
        }
        .nav-menu a:hover,
        .current-menu-item a { color: var(--color-primary); background: var(--color-primary-bg); }
        .header-actions { display: flex; align-items: center; gap: var(--spacing-sm); }
        .search-toggle {
          display: flex; align-items: center; justify-content: center;
          width: 38px; height: 38px; border: none; background: transparent;
          color: var(--color-text); cursor: pointer; border-radius: var(--radius-md);
        }
        .search-toggle:hover { background: var(--color-bg); color: var(--color-primary); }
        .header-search {
          position: absolute; top: var(--header-height); left: 0; right: 0;
          background: var(--color-bg-alt); padding: var(--spacing-md) var(--spacing-lg);
          border-bottom: 1px solid var(--color-border); box-shadow: var(--shadow-md); z-index: 999;
        }
        .search-form { display: flex; max-width: 600px; margin: 0 auto; gap: var(--spacing-sm); }
        .search-form input[type="search"] {
          flex: 1; padding: var(--spacing-sm) var(--spacing-md);
          border: 2px solid var(--color-border); border-radius: var(--radius-md);
          font-size: var(--text-base); font-family: var(--font-body); outline: none;
        }
        .search-form input[type="search"]:focus { border-color: var(--color-primary); }
        .search-form button {
          padding: var(--spacing-sm) var(--spacing-lg); background: var(--color-primary);
          color: white; border: none; border-radius: var(--radius-md); cursor: pointer; font-weight: 500;
        }
        .search-form button:hover { background: var(--color-primary-dark); }
        .mobile-menu-toggle { display: none; width: 38px; height: 38px; border: none; background: transparent; cursor: pointer; padding: 8px; }
        .hamburger-box { display: block; width: 22px; height: 2px; background: var(--color-text); border-radius: 2px; position: relative; }
        .hamburger-inner::before { content: ''; position: absolute; width: 22px; height: 2px; background: var(--color-text); border-radius: 2px; top: -7px; }
        .hamburger-inner::after { content: ''; position: absolute; width: 22px; height: 2px; background: var(--color-text); border-radius: 2px; top: 7px; }
        .mobile-menu-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 2000; }
        .mobile-menu-panel { position: fixed; top: 0; right: 0; bottom: 0; width: 300px; max-width: 85vw; background: var(--color-bg-alt); z-index: 2001; overflow-y: auto; }
        .mobile-menu-header { display: flex; align-items: center; justify-content: space-between; padding: var(--spacing-md) var(--spacing-lg); border-bottom: 1px solid var(--color-border); }
        .mobile-menu-title { font-family: var(--font-heading); font-weight: 700; }
        .mobile-menu-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--color-text); }
        .mobile-nav { list-style: none; padding: 0; margin: 0; }
        .mobile-nav li { margin: 0; }
        .mobile-nav a { display: block; padding: var(--spacing-md) var(--spacing-lg); color: var(--color-text); border-bottom: 1px solid var(--color-border-light); }
        .mobile-nav a:hover { background: var(--color-primary-bg); color: var(--color-primary); }
        .mobile-menu-auth { padding: var(--spacing-lg); display: flex; flex-direction: column; gap: var(--spacing-sm); }
        @media (max-width: 768px) {
          .main-navigation { display: none; }
          .header-actions .btn { display: none; }
          .mobile-menu-toggle { display: flex; }
        }
      `}</style>
    </>
  );
}
