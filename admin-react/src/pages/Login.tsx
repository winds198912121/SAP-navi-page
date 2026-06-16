// ===========================================================
// 登录页面 (T2.1.2.2)
// ===========================================================

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Seo from '../components/layout/Seo'
import SiteHeader from '../components/layout/Header'
import SiteFooter from '../components/layout/Footer'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { setErrMsg('メールアドレスとパスワードを入力してください。'); return }
    setSubmitting(true)
    setErrMsg('')
    const ok = await login(email, password)
    setSubmitting(false)
    if (ok) navigate('/')
    else setErrMsg('メールアドレスまたはパスワードが正しくありません。')
  }

  return (
    <>
      <div className="page-bg" />
      <Seo
        title="ログイン — SAP パンダ先生"
        description="SAP パンダ先生 NAVI にログイン。会員限定の学習機能、案件応募、学習進度の管理が利用できます。"
        path="/login"
        noindex
      />
      <SiteHeader />
      <main style={{ position: 'relative', zIndex: 2, minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--r-xl)',
          border: '1px solid var(--line-2)', padding: '40px 48px',
          maxWidth: 420, width: '100%', margin: '40px 20px',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <svg width="56" height="56" viewBox="-4 -8 108 108" style={{ margin: '0 auto 12px', display: 'block' }}>
              <circle cx="50" cy="52" r="46" fill="#d8ead9" />
              <path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" />
              <g><path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" /><path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" /></g>
              <circle cx="30" cy="44" r="3.4" fill="#fff" /><circle cx="30" cy="44" r="2.4" fill="#0e0a05" />
              <circle cx="70" cy="44" r="3.4" fill="#fff" /><circle cx="70" cy="44" r="2.4" fill="#0e0a05" />
              <ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" />
              <path d="M 42 68 Q 50 78 58 68" fill="#1a1612" />
            </svg>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink-0)', margin: 0 }}>ログイン</h1>
          </div>
          {errMsg && <div style={{ background: 'var(--rose-soft)', color: 'var(--rose)', padding: '10px 14px', borderRadius: 'var(--r-md)', fontSize: 13, marginBottom: 16 }}>{errMsg}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-0)' }}>メールアドレス</span>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required
                style={{ padding: '10px 14px', border: '1.5px solid var(--line-2)', borderRadius: 'var(--r-md)', fontSize: 14, outline: 'none' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--line-2)'} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-0)' }}>パスワード</span>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                style={{ padding: '10px 14px', border: '1.5px solid var(--line-2)', borderRadius: 'var(--r-md)', fontSize: 14, outline: 'none' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--line-2)'} />
            </label>
            <button type="submit" disabled={submitting}
              className="btn primary"
              style={{ width: '100%', justifyContent: 'center', padding: 12, fontSize: 15 }}>
              {submitting ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>
          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--ink-2)' }}>
            アカウントをお持ちでない方は
            <Link to="/register" style={{ color: 'var(--accent-deep)', fontWeight: 600, marginLeft: 4 }}>新規登録</Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
