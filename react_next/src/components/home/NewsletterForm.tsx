'use client'
// ===========================================================
// NewsletterForm — ニュースレター登録フォーム
// ===========================================================
import { useState } from 'react'
import { PUBLIC_API_BASE } from '@/lib/api'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch(`${PUBLIC_API_BASE}/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch {}
    alert('登録ありがとう！🎋')
    setEmail('')
  }

  return (
    <form className="nl-form" onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
      <button className="btn primary" type="submit">登録</button>
    </form>
  )
}
