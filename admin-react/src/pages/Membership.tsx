// ===========================================================
// 会员订阅页面 (T2.4.2.1 — 含 Stripe Checkout + 当前方案高亮)
// ===========================================================

import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'
import Seo from '../components/layout/Seo'
import SiteHeader from '../components/layout/Header'
import SiteFooter from '../components/layout/Footer'

interface Plan {
  id: number
  name: string
  description: string
  price: number
  interval: string
  features: string[]
  popular: boolean
}

interface CurrentPlan {
  plan_id: number
  plan_name: string
  status: string
  started?: string
  expires?: string
}

export default function MembershipPage() {
  const { user } = useAuth()
  const [plans, setPlans] = useState<Plan[]>([])
  const [current, setCurrent] = useState<CurrentPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState<number | null>(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    Promise.all([
      api.getMembershipPlans(),
      user ? api.getCurrentMembership().catch(() => ({ data: null })) : Promise.resolve({ data: null }),
    ]).then(([plansRes, currentRes]) => {
      if (plansRes.success) setPlans(plansRes.data)
      if (currentRes?.data) setCurrent(currentRes.data)
    }).finally(() => setLoading(false))
  }, [user])

  async function subscribe(planId: number) {
    if (!user) { setErr('ログインが必要です。'); return }
    setSubscribing(planId)
    setErr('')
    try {
      const res = await api.subscribeMembership(planId)
      if (res.success) {
        if (res.data.checkout_url) {
          // Stripe Checkout: redirect to Stripe
          window.location.href = res.data.checkout_url
        } else {
          // Direct activation (dev mode): refresh and show success
          setCurrent({
            plan_id: planId,
            plan_name: plans.find(p => p.id === planId)?.name || '',
            status: 'active',
            expires: res.data.expires,
          })
        }
      } else {
        setErr(res.message || '登録に失敗しました。')
      }
    } catch {
      setErr('サーバーエラーが発生しました。')
    } finally { setSubscribing(null) }
  }

  const isCurrentPlan = (planId: number) => current?.status === 'active' && current.plan_id === planId
  const intervalLabel = (i: string) => i === 'year' ? '年額' : '月額'

  return (
    <>
      <div className="page-bg" />
      <Seo
        title="会員プラン — SAP パンダ先生"
        description="SAP パンダ先生 NAVI の会員プラン一覧。プレミアムプランでは AI 質問機能、非公開案件アクセス、学習進度詳細レポートが利用可能。"
        path="/membership"
      />
      <SiteHeader />
      <main style={{ position: 'relative', zIndex: 2, maxWidth: 960, margin: '0 auto', padding: '40px 28px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--ink-0)', margin: '0 0 8px' }}>
            会員プラン<span className="accent-mark">.</span>
          </h1>
          <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>
            パンダ先生の全コンテンツにアクセス。AI アシスタントや修了証など、
            プレミアム機能をすべてお使いいただけます。
          </p>
        </div>

        {err && (
          <div style={{
            background: 'var(--rose-soft)', color: 'var(--rose)',
            padding: '10px 14px', borderRadius: 'var(--r-md)', fontSize: 13,
            marginBottom: 16, textAlign: 'center',
          }}>{err}</div>
        )}

        {current?.status === 'active' && !subscribing && (
          <div style={{
            background: 'var(--accent-soft)', border: '1px solid var(--accent)',
            borderRadius: 'var(--r-lg)', padding: '14px 20px', marginBottom: 24,
            display: 'flex', alignItems: 'center', gap: 12,
            fontSize: 13, color: 'var(--accent-deep)',
          }}>
            <span style={{ fontSize: 20 }}>🎋</span>
            <div>
              <strong>{current.plan_name}</strong> にご登録済みです。
              {current.expires && <> 有効期限: {current.expires.slice(0, 10)}</>}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, alignItems: 'start' }}>
          {loading ? (
            <div style={{ textAlign: 'center', gridColumn: '1/-1', color: 'var(--ink-3)' }}>読み込み中...</div>
          ) : plans.length === 0 ? (
            <div style={{ textAlign: 'center', gridColumn: '1/-1', color: 'var(--ink-3)' }}>プランがありません。</div>
          ) : plans.map(plan => {
            const isActive = isCurrentPlan(plan.id)
            return (
              <div key={plan.id} style={{
                background: 'var(--bg-card)', borderRadius: 'var(--r-xl)',
                border: isActive ? '2px solid var(--accent-deep)'
                       : plan.popular ? '2px solid var(--accent)'
                       : '1px solid var(--line-2)',
                padding: '28px 24px', position: 'relative',
                boxShadow: isActive ? 'var(--sh-soft)' : plan.popular ? 'var(--sh-soft)' : 'none',
              }}>
                {isActive && <span style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--accent-deep)', color: 'white', fontSize: 10.5,
                  fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                  padding: '4px 14px', borderRadius: 'var(--r-pill)',
                }}>契約中</span>}
                {!isActive && plan.popular && <span style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--accent)', color: 'white', fontSize: 10.5,
                  fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                  padding: '4px 14px', borderRadius: 'var(--r-pill)',
                }}>おすすめ</span>}
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--ink-0)', margin: '0 0 4px' }}>{plan.name}</h3>
                {plan.description && (
                  <p style={{ fontSize: 12.5, color: 'var(--ink-2)', margin: '0 0 16px', lineHeight: 1.6 }}>{plan.description}</p>
                )}
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36, color: 'var(--ink-0)' }}>
                    ¥{plan.price.toLocaleString()}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--ink-2)', marginLeft: 4 }}>/{intervalLabel(plan.interval)}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {plan.features.map((f, i) => (
                    <li key={i} style={{ fontSize: 13, color: 'var(--ink-1)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: 'var(--accent)' }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`btn ${isActive ? 'ghost' : plan.popular ? 'accent' : ''}`}
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => subscribe(plan.id)}
                  disabled={subscribing === plan.id || isActive}>
                  {isActive ? '✓ 登録済み' : subscribing === plan.id ? '処理中...' : 'このプランに登録'}
                </button>
              </div>
            )
          })}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
