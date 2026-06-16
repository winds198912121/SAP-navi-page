// ===========================================================
// FreelanceWorries — フリーランスの困りごとセクション + 登録モーダル
// ===========================================================

import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import LoginModal from '../auth/LoginModal'
import api from '../../services/api'

const MOD_COLOR: Record<string, string> = {
  fi: '#2f6d44', co: '#2641a1', mm: '#a25411', sd: '#b62a4a', pp: '#4828a8',
  hr: '#8a6212', abap: '#1f6f6f', basis: '#4a432d', s4: '#1864a3',
}

const SKILL_OPTIONS = ['FI', 'CO', 'MM', 'SD', 'PP', 'HR', 'ABAP', 'Basis', 'S/4']

const WORRIES = [
  { q: '案件探しが、とにかく大変…', a: '希望条件を一度登録すれば、合う案件だけスカウトでお届け。探す時間をゼロに。', tag: '探す手間' },
  { q: '単価交渉、正直ニガテ。', a: '相場と実績をもとに、担当が代わりに交渉。「言い出せず安く受ける」をなくします。', tag: '単価' },
  { q: 'ブランク・年齢が不安。', a: '40代・復帰組の決定実績多数。経験の棚卸しから一緒に。學び直しはパンダ先生で。', tag: 'キャリア' },
  { q: '自分の市場価値がわからない。', a: '登録すると無料で「単価診断」。今のスキルがいくらになるか、客観的に把握できます。', tag: '価値' },
]

export default function FreelanceWorries() {
  const { user } = useAuth()
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [pendingRegister, setPendingRegister] = useState(false)
  const prevUser = useRef(user)

  // Auto-show register modal after successful login
  useEffect(() => {
    if (pendingRegister && user && !prevUser.current) {
      setShowRegister(true)
      setPendingRegister(false)
    }
    prevUser.current = user
  }, [user, pendingRegister])

  const handleRegisterClick = () => {
    if (!user) {
      setShowLogin(true)
      setPendingRegister(true)
      return
    }
    setShowRegister(true)
  }

  return (
    <section className="section" id="worries">
      <div className="section-head">
        <div>
          <div className="label">Freelancer's Real Talk</div>
          <h2>フリーランスSAPerの、ほんとの悩み<span className="accent-mark">。</span></h2>
        </div>
        <div className="desc">
          一人で抱えがちな不安、ぜんぶ言葉にしてみました。<br />
          パンダ先生のチームが、ひとつずつ解きほぐします。
        </div>
      </div>

      <div className="worries-grid">
        {WORRIES.map((w, i) => (
          <div key={i} className="worry-card">
            <span className="worry-tag">{w.tag}</span>
            <div className="worry-q">「{w.q}」</div>
            <div className="worry-a">
              <span style={{ fontWeight: 600, color: 'var(--accent-deep)', display: 'block', marginBottom: 4 }}>
                パンダ先生の答え
              </span>
              {w.a}
            </div>
          </div>
        ))}
      </div>

      <div className="worries-cta">
        <div>
          <svg width="80" height="80" viewBox="0 0 100 100">
            <circle cx="50" cy="52" r="46" fill="#d8ead9" />
            <g transform="translate(25,20)">
              <path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" />
              <g>
                <path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" />
                <path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" />
              </g>
              <circle cx="30" cy="44" r="4" fill="#fff" /><circle cx="30" cy="44" r="2.8" fill="#0e0a05" />
              <circle cx="70" cy="44" r="4" fill="#fff" /><circle cx="70" cy="44" r="2.8" fill="#0e0a05" />
              <ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" />
              <path d="M 42 68 Q 50 78 58 68" fill="#1a1612" />
            </g>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div className="wc-eyebrow" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-deep)' }}>
            まずは登録だけでもOK 🎋
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: 'var(--ink-0)', margin: '8px 0' }}>
            「いつか」を、今日の一歩に。
          </h3>
          <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.7 }}>
            登録は無料・3分。合わなければ断ってOK。あなたの SAP スキルは、ちゃんとお金になります。
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button className="btn accent" type="button" onClick={handleRegisterClick}>案件を見て登録する →</button>
            <Link to="/paths" className="btn ghost" style={{ textDecoration: 'none' }}>まず学習パスでスキルを固める</Link>
          </div>
        </div>
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </section>
  )
}

function RegisterModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth()
  const [skills, setSkills] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    expected_rate: '',
    experience_years: '',
    self_pr: '',
  })

  const handleChange = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))
  const toggleSkill = (m: string) => setSkills(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) { setError('名前とメールアドレスは必須です。'); return }
    setSubmitting(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('email', form.email)
      formData.append('phone', form.phone)
      formData.append('expected_rate', form.expected_rate)
      formData.append('experience_years', form.experience_years)
      formData.append('skill_modules', JSON.stringify(skills))
      formData.append('self_pr', form.self_pr)
      const files = (document.getElementById('register-resume') as HTMLInputElement)
      if (files?.files?.[0]) formData.append('resume', files.files[0])
      const res = await api.client.post('/cases/0/apply', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      if (res.data.success) setDone(true)
      else setError(res.data.message || '送信に失敗しました。')
    } catch { setError('サーバーエラーが発生しました。') }
    finally { setSubmitting(false) }
  }

  return (
    <div className="case-modal-overlay" onClick={onClose}>
      <div className="case-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
        <button className="case-modal-x" onClick={onClose} aria-label="閉じる">×</button>

        {done ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>🎋</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink-0)', margin: '0 0 8px' }}>登録ありがとうございます！</h2>
            <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.8 }}>
              担当から1営業日以内にご連絡します。<br />
              まずは気軽に話を聞いてみてくださいね。
            </p>
            <button className="btn primary" onClick={onClose} style={{ marginTop: 20 }}>閉じる</button>
          </div>
        ) : (
          <>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--ink-0)', margin: '0 0 4px' }}>フリーランス登録</h3>
            <p style={{ fontSize: 12.5, color: 'var(--ink-2)', margin: '0 0 16px' }}>3分で完了。合わなければ断ってOKです。</p>

            {error && <div style={{ background: '#fbe3e6', border: '1px solid rgba(217,101,112,0.3)', borderRadius: 12, padding: '10px 14px', fontSize: 13, color: '#d96570', marginBottom: 14 }}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div><label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-2)', display: 'block', marginBottom: 3 }}>お名前 *</label>
                    <input type="text" value={form.name} onChange={e => handleChange('name', e.target.value)} required placeholder="山田 太郎"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--line-2)', fontFamily: 'inherit', fontSize: 13 }} /></div>
                  <div><label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-2)', display: 'block', marginBottom: 3 }}>メールアドレス *</label>
                    <input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} required placeholder="your@email.com"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--line-2)', fontFamily: 'inherit', fontSize: 13 }} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <div><label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-2)', display: 'block', marginBottom: 3 }}>電話番号</label>
                    <input type="text" value={form.phone} onChange={e => handleChange('phone', e.target.value)} placeholder="080-xxxx-xxxx"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--line-2)', fontFamily: 'inherit', fontSize: 13 }} /></div>
                  <div><label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-2)', display: 'block', marginBottom: 3 }}>希望単価 (月/万)</label>
                    <input type="text" value={form.expected_rate} onChange={e => handleChange('expected_rate', e.target.value)} placeholder="80"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--line-2)', fontFamily: 'inherit', fontSize: 13 }} /></div>
                  <div><label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-2)', display: 'block', marginBottom: 3 }}>経験年数</label>
                    <input type="text" value={form.experience_years} onChange={e => handleChange('experience_years', e.target.value)} placeholder="5年"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--line-2)', fontFamily: 'inherit', fontSize: 13 }} /></div>
                </div>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-2)', display: 'block', marginBottom: 3 }}>得意モジュール（複数選択可）</label>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {SKILL_OPTIONS.map(m => (
                      <button key={m} type="button" onClick={() => toggleSkill(m)}
                        style={{
                          padding: '4px 10px', borderRadius: 999, border: '1.5px solid',
                          fontSize: 11.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                          background: skills.includes(m) ? (MOD_COLOR[m.toLowerCase()] || '#5a9d6e') : 'var(--bg-card)',
                          color: skills.includes(m) ? '#fff' : 'var(--ink-1)',
                          borderColor: skills.includes(m) ? 'transparent' : 'var(--line-2)',
                        }}>{m}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-2)', display: 'block', marginBottom: 3 }}>自己PR</label>
                  <textarea value={form.self_pr} onChange={e => handleChange('self_pr', e.target.value)} rows={3} placeholder="経歴や強みを簡単に"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--line-2)', fontFamily: 'inherit', fontSize: 13, resize: 'vertical' }} />
                </div>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-2)', display: 'block', marginBottom: 3 }}>履歴書・職務経歴書（任意）</label>
                  <input type="file" id="register-resume" accept=".pdf,.doc,.docx" style={{ fontSize: 12 }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 18 }}>
                <button type="button" className="btn" onClick={onClose}>キャンセル</button>
                <button type="submit" className="btn accent" disabled={submitting}>
                  {submitting ? '送信中...' : '登録する'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
