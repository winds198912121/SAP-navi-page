'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', icon: '🏠', label: 'ホーム' },
  { href: '/modules', icon: '📚', label: 'モジュール' },
  { href: '/paths', icon: '🎯', label: '学習パス' },
  { href: '/quiz-page', icon: '❓', label: '今日の一問' },
  { href: '/video', icon: '🎬', label: '動画' },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="mob-bottom-nav">
      {NAV_ITEMS.map(item => {
        const isActive = item.href === '/'
          ? pathname === '/'
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className="mob-nav-item"
            style={{ opacity: isActive ? 1 : 0.6 }}
          >
            <span className="mob-nav-icon">{item.icon}</span>
            <span className="mob-nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
