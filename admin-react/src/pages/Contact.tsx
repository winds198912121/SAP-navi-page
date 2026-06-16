// ===========================================================
// Contact — お問い合わせ /contact
// WP管理画面から編集 ⇒ API経由で説明文を表示
// お問い合わせ送信は /wp-json/sap/v1/contact 経由
// ===========================================================
import { useState, useEffect } from 'react'
import api from '../services/api'
import StaticPage from '../components/layout/StaticPage'
import { p } from '../config'

const INQUIRY_TYPES = [
  { value: 'general', label: '一般的なお問い合わせ' },
  { value: 'course', label: 'コースについて' },
  { value: 'case', label: '案件掲載について' },
  { value: 'partnership', label: '提携について' },
  { value: 'other', label: 'その他' },
]

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [pageContent, setPageContent] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  const [form, setForm] = useState({
    name: '',
    name_kana: '',
    email: '',
    phone: '',
    inquiry_type: 'general',
    message: '',
    agreed_privacy: false,
    website: '', // honeypot
  })

  useEffect(() => {
    api.client.get('/pages', { params: { slug: 'contact' } })
      .then(({ data }) => {
        if (data.success && data.data?.content) {
          setPageContent(data.data.content)
        }
      }).catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  const update = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('必須項目（お名前・メールアドレス・お問い合わせ内容）を入力してください。')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('正しいメールアドレス形式で入力してください。')
      return
    }
    if (!form.agreed_privacy) {
      setError('プライバシーポリシーに同意してください。')
      return
    }

    setSubmitting(true)
    try {
      const res = await api.client.post('/contact', form)
      const data = res.data
      if (data.success) {
        setSent(true)
      } else {
        setError(data.message || '送信に失敗しました。')
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'サーバーとの通信に失敗しました'
      setError('送信エラー: ' + msg)
      console.error('Contact submit error:', err?.response?.data || err)
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) return (
    <StaticPage title="お問い合わせ" description="SAP パンダ先生 NAVI へのお問い合わせありがとうございます。" path="/contact">
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🎋</div>
        <h2>お問い合わせを受け付けました</h2>
        <p style={{ color: 'var(--ink-2)', lineHeight: 1.8, maxWidth: 480, margin: '0 auto' }}>
          内容を確認の上、担当者からご連絡いたします。<br />
          通常1〜3営業日以内に返信いたしますので、今しばらくお待ちください。
        </p>
      </div>
    </StaticPage>
  )

  const is = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid var(--line-2)', fontFamily: 'inherit', fontSize: 14, outline: 'none', background: 'var(--bg-1)', color: 'var(--ink-0)', transition: 'border-color 0.15s' } as React.CSSProperties
  const labelStyle = { fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4, color: 'var(--ink-0)' } as React.CSSProperties
  const requiredMark = { color: '#e74c3c', marginLeft: 2, fontSize: 12 } as React.CSSProperties
  const selectStyle = { ...is, cursor: 'pointer' } as React.CSSProperties

  return (
    <StaticPage title="お問い合わせ" description="SAP パンダ先生 NAVI へのお問い合わせフォーム。SAP 学習に関するご質問、案件掲載のお問い合わせなど、お気軽にご連絡ください。" path="/contact">
      {!loaded ? (
        <div style={{ color: 'var(--ink-3)', padding: 20 }}>読み込み中...</div>
      ) : pageContent ? (
        <div className="art-content" dangerouslySetInnerHTML={{ __html: pageContent }} />
      ) : (
        <p>SAP パンダ先生 NAVI に関するお問い合わせは、以下のフォームからご連絡ください。</p>
      )}

      {error && <div style={{ padding: '12px 16px', background: '#fff0f0', color: '#c0392b', borderRadius: 8, fontSize: 13, marginTop: 16, border: '1px solid #f5c6cb' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 24 }}>
        {/* honeypot — 人間には見えない */}
        <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
          <label>ウェブサイト</label>
          <input type="text" name="website" value={form.website} onChange={e => update('website', e.target.value)} tabIndex={-1} autoComplete="off" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>お名前 <span style={requiredMark}>*</span></label>
            <input type="text" style={is} value={form.name} onChange={e => update('name', e.target.value)}
              placeholder="例：山田 太郎" required />
          </div>
          <div>
            <label style={labelStyle}>フリガナ</label>
            <input type="text" style={is} value={form.name_kana} onChange={e => update('name_kana', e.target.value)}
              placeholder="例：ヤマダ タロウ" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>メールアドレス <span style={requiredMark}>*</span></label>
            <input type="email" style={is} value={form.email} onChange={e => update('email', e.target.value)}
              placeholder="例：example@sap-panda.com" required />
          </div>
          <div>
            <label style={labelStyle}>電話番号</label>
            <input type="tel" style={is} value={form.phone} onChange={e => update('phone', e.target.value)}
              placeholder="例：03-1234-5678" />
          </div>
        </div>

        <div>
          <label style={labelStyle}>お問い合わせ種別 <span style={requiredMark}>*</span></label>
          <select style={selectStyle} value={form.inquiry_type} onChange={e => update('inquiry_type', e.target.value)}>
            {INQUIRY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>お問い合わせ内容 <span style={requiredMark}>*</span></label>
          <textarea style={{ ...is, minHeight: 180, resize: 'vertical' }} value={form.message}
            onChange={e => update('message', e.target.value)} placeholder="お問い合わせ内容を詳しくご記入ください。" required />
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.6 }}>
            <input type="checkbox" checked={form.agreed_privacy} onChange={e => update('agreed_privacy', e.target.checked)}
              style={{ marginTop: 3, width: 16, height: 16, cursor: 'pointer' }} />
            <span>
              <a href={p('/privacy')} target="_blank" style={{ color: 'var(--accent-deep)', textDecoration: 'underline' }}>プライバシーポリシー</a>
              に同意する <span style={requiredMark}>*</span>
            </span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 4 }}>
          <button type="submit" className="btn primary" disabled={submitting} style={{ textDecoration: 'none', minWidth: 160, justifyContent: 'center' }}>
            {submitting ? '送信中...' : '送信する'}
          </button>
          <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>※ 送信後、確認メールをお送りします</span>
        </div>
      </form>
    </StaticPage>
  )
}
