'use client'
// ===========================================================
// HeroCta — 「無料で始める」ボタン → ログイン/登録モーダル
// ===========================================================
import { useState } from 'react'
import Link from 'next/link'
import LoginModal from '@/components/auth/LoginModal'

export default function HeroCta() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div className="hero-ctas">
        <button className="btn accent" onClick={() => setShowModal(true)} style={{ border: 'none', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', padding: '10px 18px', borderRadius: 'var(--r-pill)', background: 'var(--accent)', color: 'white', fontWeight: 600, boxShadow: 'var(--sh-soft)' }}>
          無料で始める
        </button>
        <Link href="/modules" className="btn" style={{ textDecoration: 'none' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          記事を探す
        </Link>
      </div>
      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
    </>
  )
}
