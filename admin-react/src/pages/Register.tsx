// ===========================================================
// 注册页面 (T2.1.2.3)
// ===========================================================

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Seo from '../components/layout/Seo'
import SiteHeader from '../components/layout/Header'
import SiteFooter from '../components/layout/Footer'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrMsg('')
    if (!email || !password || !name) { setErrMsg('すべての項目を入力してください。'); return }
    if (password.length < 6) { setErrMsg('パスワードは6文字以上で入力してください。'); return }
    if (password !== confirm) { setErrMsg('パスワードが一致しません。'); return }
    setSubmitting(true)
    const ok = await register(email, password, name)
    setSubmitting(false)
    if (ok) navigate('/')
  }

  return (
    <>
      <div className="page-bg" />
      <Seo
        title="新規登録 — SAP パンダ先生"
        description="SAP パンダ先生 NAVI に無料登録。記事の保存、学習進度の記録、每日クイズの解答履歴、案件への応募が可能になります。"
        path="/register"
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
              <circle cx="30" cy="44" r="4" fill="#fff" /><circle cx="30" cy="44" r="2.8" fill="#0e0a05" />
              <circle cx="70" cy="44" r="4" fill="#fff" /><circle cx="70" cy="44" r="2.8" fill="#0e0a05" />
              <ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" />
              <path d="M 40 67 Q 50 82 60 67 Q 50 70 40 67 Z" fill="#1a1612" />
            </svg>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink-0)', margin: 0 }}>新規登録</h1>
            <p style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 8 }}>パンダ先生と一緒にSAPを学びましょう 🎋</p>
          </div>
          {errMsg && <div style={{ background: 'var(--rose-soft)', color: 'var(--rose)', padding: '10px 14px', borderRadius: 'var(--r-md)', fontSize: 13, marginBottom: 16 }}>{errMsg}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-0)' }}>お名前</span>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="パンダ 太郎" required
                style={inputStyle} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-0)' }}>メールアドレス</span>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required
                style={inputStyle} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-0)' }}>パスワード <span style={{ fontWeight: 400, color: 'var(--ink-3)' }}>6文字以上</span></span>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required minLength={6}
                style={inputStyle} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-0)' }}>パスワード（確認）</span>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder="••••••••" required
                style={{
                  ...inputStyle,
                  borderColor: confirm && password !== confirm ? 'var(--rose)' : 'var(--line-2)',
                }} />
            </label>
            <button type="submit" disabled={submitting}
              className="btn accent"
              style={{ width: '100%', justifyContent: 'center', padding: 12, fontSize: 15 }}>
              {submitting ? '登録中...' : '無料登録する'}
            </button>
          </form>
          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--ink-2)' }}>
            すでにアカウントをお持ちの方
            <Link to="/login" style={{ color: 'var(--accent-deep)', fontWeight: 600, marginLeft: 4 }}>ログイン</Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '10px 14px', border: '1.5px solid var(--line-2)',
  borderRadius: 'var(--r-md)', fontSize: 14, outline: 'none',
  fontFamily: 'inherit',
}
