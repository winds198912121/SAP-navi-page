// ===========================================================
// LoginModal — ログイン/登録 モーダルダイアログ
// 現在のページの上に重ねて表示、タブ切替でlogin/register
// ===========================================================

import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()

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
    const ok = tab === 'login'
      ? await login(email, password)
      : await register(email, password, name)
    setLoading(false)

    if (ok) onClose()
    else setError(tab === 'login' ? 'メールアドレスまたはパスワードが正しくありません。' : '登録に失敗しました。')
  }

  return (
    <div className="case-modal-overlay" onClick={onClose}>
      <div className="case-modal" style={{ maxWidth: 420, padding: 0, overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--line-2)' }}>
          <button onClick={() => { setTab('login'); setError('') }}
            style={{
              flex: 1, padding: '14px 0', textAlign: 'center', cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
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
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
              border: 'none', borderBottom: `2px solid ${tab === 'register' ? 'var(--accent)' : 'transparent'}`,
              background: tab === 'register' ? 'var(--accent-soft)' : 'transparent',
              color: tab === 'register' ? 'var(--accent-deep)' : 'var(--ink-2)',
              transition: 'all .15s',
            }}>
            新規登録
          </button>
        </div>

        <button className="case-modal-x" onClick={onClose}>×</button>

        <div style={{ padding: '28px 32px' }}>
          {/* Panda Avatar */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <svg width="52" height="52" viewBox="-4 -8 108 108" style={{ display: 'inline-block' }}>
              <circle cx="50" cy="52" r="46" fill="#d8ead9" />
              <path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" />
              <g><path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" /><path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" /></g>
              <circle cx="30" cy="44" r="3.4" fill="#fff" /><circle cx="30" cy="44" r="2.4" fill="#0e0a05" />
              <circle cx="70" cy="44" r="3.4" fill="#fff" /><circle cx="70" cy="44" r="2.4" fill="#0e0a05" />
              <ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" />
              <path d="M 42 68 Q 50 78 58 68" fill="#1a1612" />
            </svg>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--ink-0)', margin: '8px 0 0' }}>
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
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="パンダ 太郎" style={inputStyle} />
              </label>
            )}
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-0)' }}>メールアドレス</span>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" style={inputStyle} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-0)' }}>
                パスワード{tab === 'register' && <span style={{ fontWeight: 400, color: 'var(--ink-3)', fontSize: 11 }}> 6文字以上</span>}
              </span>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" style={{ ...inputStyle, paddingRight: 40 }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                    fontSize: 18, lineHeight: 1, color: 'var(--ink-3)',
                  }}>
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
              className="btn accent"
              style={{ width: '100%', justifyContent: 'center', padding: 12, fontSize: 15, marginTop: 4 }}>
              {loading ? '処理中...' : tab === 'login' ? 'ログイン' : '無料登録する'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '10px 14px', border: '1.5px solid var(--line-2)',
  borderRadius: 'var(--r-md)', fontSize: 14, outline: 'none',
  fontFamily: 'inherit', width: '100%',
}
