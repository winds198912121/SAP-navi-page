'use client'
// ===========================================================
// LoginModal — ログイン/登録 モーダルダイアログ
// ===========================================================
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

const inputStyle: React.CSSProperties = {
  padding: '10px 14px', border: '1.5px solid var(--line-2)',
  borderRadius: 'var(--r-md)', fontSize: 14, outline: 'none',
  fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
}

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const PUBLIC_API = '/wp-json/sap/v1'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (tab === 'register') {
      if (!name || !email || !password) { setError('すべての項目を入力してください。'); return }
      if (password.length < 6) { setError('パスワードは6文字以上で入力してください。'); return }
      if (password !== confirm) { setError('パスワードが一致しません。'); return }
    } else {
      if (!email || !password) { setError('メールアドレスとパスワードを入力してください。'); return }
    }

    setLoading(true)
    try {
      const endpoint = tab === 'login' ? '/auth/login' : '/auth/register'
      const body: any = { email, password }
      if (tab === 'register') body.name = name
      const res = await fetch(`${PUBLIC_API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (json.success && json.data?.token) {
        document.cookie = `aladdin_token=${json.data.token}; path=/; max-age=86400`
        onClose()
        window.location.reload()
      } else {
        setError(json.message || (tab === 'login' ? 'メールアドレスまたはパスワードが正しくありません。' : '登録に失敗しました。'))
      }
    } catch {
      setError('サーバーに接続できませんでした。')
    }
    setLoading(false)
  }

  if (!mounted) return null

  return createPortal(
    <div className="case-modal-overlay" onClick={onClose}>
      <div className="case-modal" style={{ maxWidth: 420, padding: 0, overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}>

        <div style={{ display: 'flex', borderBottom: '1px solid var(--line-2)' }}>
          <button onClick={() => { setTab('login'); setError('') }}
            style={{
              flex: 1, padding: '14px 0', textAlign: 'center', cursor: 'pointer',
              fontFamily: "'Zen Maru Gothic', system-ui, sans-serif", fontWeight: 700, fontSize: 15,
              border: 'none', borderBottom: `2px solid ${tab === 'login' ? 'var(--accent)' : 'transparent'}`,
              background: tab === 'login' ? 'var(--accent-soft)' : 'transparent',
              color: tab === 'login' ? 'var(--accent-deep)' : 'var(--ink-2)',
              transition: 'all .15s',
            }}>
            ログイン
          </button>
          <button onClick={() => { setTab('register'); setError('') }}
            style={{
              flex: 1, padding: '14px 0', textAlign: 'center', cursor: 'pointer',
              fontFamily: "'Zen Maru Gothic', system-ui, sans-serif", fontWeight: 700, fontSize: 15,
              border: 'none', borderBottom: `2px solid ${tab === 'register' ? 'var(--accent)' : 'transparent'}`,
              background: tab === 'register' ? 'var(--accent-soft)' : 'transparent',
              color: tab === 'register' ? 'var(--accent-deep)' : 'var(--ink-2)',
              transition: 'all .15s',
            }}>
            新規登録
          </button>
        </div>

        <button className="case-modal-x" onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 20, fontSize: 28, background: 'none', border: 'none', color: 'var(--ink-3)', cursor: 'pointer', lineHeight: 1 }}>×</button>

        <div style={{ padding: '28px 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 52, lineHeight: 1 }}>🐼</div>
            <h2 style={{ fontFamily: "'Zen Maru Gothic', system-ui, sans-serif", fontSize: 20, color: 'var(--ink-0)', margin: '8px 0 0' }}>
              {tab === 'login' ? 'ログイン' : 'パンダ先生と一緒に学ぼう 🎋'}
            </h2>
          </div>

          {error && (
            <div style={{ background: 'var(--rose-soft)', color: 'var(--rose)', padding: '10px 14px', borderRadius: 'var(--r-md)', fontSize: 13, marginBottom: 16 }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {tab === 'register' && (
              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-0)' }}>お名前</span>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="パンダ 太郎" style={inputStyle} />
              </label>
            )}
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-0)' }}>メールアドレス</span>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-0)' }}>
                パスワード{tab === 'register' && <span style={{ fontWeight: 400, color: 'var(--ink-3)', fontSize: 11 }}> 6文字以上</span>}
              </span>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" style={{ ...inputStyle, paddingRight: 40 }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 4, fontSize: 18, lineHeight: 1, color: 'var(--ink-3)' }}>
                  {showPassword ? '👁' : '👁‍🗨'}
                </button>
              </div>
            </label>
            {tab === 'register' && (
              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-0)' }}>パスワード（確認）</span>
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                  placeholder="••••••••" style={{ ...inputStyle, borderColor: confirm && password !== confirm ? 'var(--rose)' : 'var(--line-2)' }} />
              </label>
            )}
            <button type="submit" disabled={loading}
              className="btn accent" style={{ width: '100%', justifyContent: 'center', padding: 12, fontSize: 15, marginTop: 4 }}>
              {loading ? '処理中...' : tab === 'login' ? 'ログイン' : '無料登録する'}
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  )
}
