// ===========================================================
// MobileMenu — ハンバーガーメニュー（モバイル端末用）
// ===========================================================

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { NAV_LINKS } from '../../types'

export default function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        aria-label="メニュー"
        style={{
          display: 'none', /* visible via media query override below */
          background: 'none', border: 'none', cursor: 'pointer',
          padding: 8, color: 'var(--ink-0)', fontSize: 22, lineHeight: 1,
          alignItems: 'center', justifyContent: 'center',
        }}
        className="mobile-menu-btn"
      >
        {open ? '✕' : '☰'}
      </button>

      {/* Overlay menu */}
      {open && (
        <div style={{
          position: 'fixed', inset: 0, top: 64, zIndex: 90,
          background: 'var(--bg-card)', borderTop: '1px solid var(--line-2)',
          display: 'flex', flexDirection: 'column', padding: '16px 20px', gap: 4,
          overflowY: 'auto', animation: 'modalIn .15s ease-out',
        }}>
          {NAV_LINKS.map(l => (
            <Link key={l.id} to={l.href}
              onClick={() => setOpen(false)}
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
            <Link to="/glossary" onClick={() => setOpen(false)}
              style={{ display: 'block', padding: '10px 12px', fontSize: 14, color: 'var(--ink-1)', textDecoration: 'none' }}>
              📚 用語集
            </Link>
            <Link to="/trends" onClick={() => setOpen(false)}
              style={{ display: 'block', padding: '10px 12px', fontSize: 14, color: 'var(--ink-1)', textDecoration: 'none' }}>
              📈 SAPトレンド
            </Link>
            <Link to="/career" onClick={() => setOpen(false)}
              style={{ display: 'block', padding: '10px 12px', fontSize: 14, color: 'var(--ink-1)', textDecoration: 'none' }}>
              🎯 転職ガイド
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
