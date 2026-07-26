'use client'
// ===========================================================
// Profile — プロフィールページ
// ===========================================================
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const API = '/wp-json/sap/v1'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return m ? decodeURIComponent(m[1]) : null
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`
}

function StatCard({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--line-1)',
      borderRadius: 'var(--r-lg)', padding: '18px 20px',
      textAlign: 'center',
    }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--accent-deep)', lineHeight: 1 }}>
        {value}<span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-2)' }}>{unit}</span>
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 4, letterSpacing: '0.04em' }}>{label}</div>
    </div>
  )
}

function PointsHistory({ token }: { token: string }) {
  const [history, setHistory] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [claimMsg, setClaimMsg] = useState('')
  const [claimErr, setClaimErr] = useState(false)

  const fetchPoints = useCallback(() => {
    fetch(`${API}/points`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          setTotal(json.data.total)
          setHistory(json.data.history || [])
        }
      })
      .finally(() => setLoading(false))
  }, [token])

  useEffect(() => { fetchPoints() }, [fetchPoints])

  async function claimDaily() {
    setClaiming(true)
    setClaimMsg('')
    try {
      const res = await fetch(`${API}/points/daily`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      })
      const json = await res.json()
      if (json.success) {
        setClaimMsg(json.data?.message || '10ポイント獲得！')
        setClaimErr(false)
        fetchPoints()
      } else {
        setClaimMsg(json.message || '本日は既に受取済みです。')
        setClaimErr(true)
      }
    } catch {
      setClaimMsg('エラーが発生しました。')
      setClaimErr(true)
    } finally {
      setClaiming(false)
      setTimeout(() => setClaimMsg(''), 3000)
    }
  }

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink-0)', margin: 0 }}>
          獲得ポイント
        </h3>
        <button className="btn sm" onClick={claimDaily} disabled={claiming}
          style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
          {claiming ? '受取中...' : '📅 デイリーボーナス'}
        </button>
      </div>
      {claimMsg && (
        <div style={{
          padding: '6px 12px', borderRadius: 'var(--r-sm)', fontSize: 12, marginBottom: 10,
          background: claimErr ? 'var(--rose-soft)' : 'var(--accent-soft)',
          color: claimErr ? 'var(--rose)' : 'var(--accent-deep)',
        }}>{claimMsg}</div>
      )}
      <div style={{ fontSize: 36, fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--ink-0)', marginBottom: 16 }}>
        {total}<span style={{ fontSize: 16, fontWeight: 500, color: 'var(--ink-2)' }}> pt</span>
      </div>
      {loading ? (
        <div style={{ color: 'var(--ink-3)', fontSize: 13 }}>読み込み中...</div>
      ) : history.length === 0 ? (
        <div style={{ color: 'var(--ink-3)', fontSize: 13 }}>まだポイント履歴がありません。</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {history.map((h, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '8px 12px', background: 'var(--bg-1)',
              borderRadius: 'var(--r-sm)', fontSize: 13,
            }}>
              <span style={{
                background: h.points > 0 ? 'var(--accent-soft)' : 'var(--bg-tint)',
                color: h.points > 0 ? 'var(--accent-deep)' : 'var(--ink-3)',
                fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--r-sm)',
                fontVariantNumeric: 'tabular-nums', minWidth: 48, textAlign: 'right',
              }}>
                {h.points > 0 ? '+' : ''}{h.points}
              </span>
              <span style={{ flex: 1, color: 'var(--ink-1)' }}>{h.description}</span>
              <span style={{ color: 'var(--ink-3)', fontSize: 11 }}>{h.created_at?.slice(0, 10)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [editError, setEditError] = useState('')

  useEffect(() => {
    const token = getCookie('aladdin_token')
    if (!token) { router.push('/login'); return }
    fetch(`${API}/users/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data) setUser(json.data)
        else { deleteCookie('aladdin_token'); router.push('/login') }
      })
      .catch(() => { deleteCookie('aladdin_token'); router.push('/login') })
      .finally(() => setLoading(false))
  }, [router])

  useEffect(() => {
    if (editing && user) {
      setName(user.display_name)
      setBio(user.description || '')
    }
  }, [editing, user])

  async function handleSave() {
    const token = getCookie('aladdin_token')
    if (!token) return
    setSaving(true)
    setEditError('')
    try {
      const res = await fetch(`${API}/users/me`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_name: name, description: bio }),
      })
      const json = await res.json()
      if (json.success && json.data) {
        setUser(json.data)
        setEditing(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      } else {
        setEditError(json.message || '保存に失敗しました')
      }
    } catch {
      setEditError('保存に失敗しました')
    }
    setSaving(false)
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-0)' }}>
      <div style={{ fontSize: 14, color: 'var(--ink-3)' }}>読み込み中...</div>
    </div>
  )

  if (!user) return null

  const token = getCookie('aladdin_token') || ''

  return (
    <>
      <main style={{ position: 'relative', zIndex: 2, maxWidth: 880, margin: '0 auto', padding: '40px 28px 80px' }}>
        {/* Profile Header */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--r-xl)',
          border: '1px solid var(--line-1)', padding: '32px 36px',
          display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap',
        }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 88, height: 88, borderRadius: '50%',
              background: 'var(--accent)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-display)',
              border: '3px solid var(--accent-soft)',
              overflow: 'hidden',
            }}>
              {user.display_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || '?'}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            {!editing ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--ink-0)', margin: 0 }}>{user.display_name || 'ユーザー'}</h1>
                  {user.roles?.includes('administrator') && (
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 'var(--r-pill)', background: 'var(--accent-soft)', color: 'var(--accent-deep)', fontWeight: 600, letterSpacing: '0.06em' }}>
                      管理者
                    </span>
                  )}
                  {user.roles?.includes('subscriber') && !user.roles?.includes('administrator') && (
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 'var(--r-pill)', background: 'var(--bg-tint)', color: 'var(--ink-2)', fontWeight: 600, letterSpacing: '0.06em' }}>
                      メンバー
                    </span>
                  )}
                </div>
                {user.description && (
                  <p style={{ fontSize: 13.5, color: 'var(--ink-2)', margin: '8px 0 0', lineHeight: 1.7 }}>{user.description}</p>
                )}
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 8 }}>
                  登録: {user.member_since || user.registered_at?.slice(0, 7) || '-'} · {user.email}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {editError && (
                  <div style={{ padding: '6px 12px', borderRadius: 'var(--r-sm)', fontSize: 12, background: 'var(--rose-soft)', color: 'var(--rose)' }}>{editError}</div>
                )}
                <input value={name} onChange={e => setName(e.target.value)}
                  placeholder="表示名" style={{
                    padding: '8px 12px', border: '1.5px solid var(--line-2)',
                    borderRadius: 'var(--r-md)', fontSize: 13.5, outline: 'none',
                    fontFamily: 'inherit', width: '100%', background: 'var(--bg-1)',
                  }} />
                <textarea value={bio} onChange={e => setBio(e.target.value)}
                  placeholder="自己紹介" rows={3} style={{
                    padding: '8px 12px', border: '1.5px solid var(--line-2)',
                    borderRadius: 'var(--r-md)', fontSize: 13.5, outline: 'none',
                    fontFamily: 'inherit', width: '100%', background: 'var(--bg-1)',
                    resize: 'vertical',
                  }} />
              </div>
            )}
          </div>
          <div style={{ marginLeft: 'auto' }}>
            {!editing ? (
              <button className="btn sm" onClick={() => setEditing(true)}>プロフィール編集</button>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn sm ghost" onClick={() => setEditing(false)}>キャンセル</button>
                <button className="btn sm primary" onClick={handleSave} disabled={saving}>
                  {saving ? '保存中...' : saved ? '✓ 保存完了' : '保存'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginTop: 24 }}>
          <StatCard label="閲覧記事" value={user.stats?.articles_read || 0} unit=" 本" />
          <StatCard label="回答数" value={user.stats?.quizzes_answered || 0} unit=" 問" />
          <StatCard label="正解率" value={user.stats?.quiz_accuracy || 0} unit="%" />
          <StatCard label="会員ランク" value={user.membership?.plan || '無料'} />
        </div>

        {/* Points History */}
        <PointsHistory token={token} />

        {/* Admin link */}
        {user.roles?.includes('administrator') && (
          <div style={{ marginTop: 24, padding: '18px 20px', background: 'var(--bg-card)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--ink-0)', margin: '0 0 4px' }}>⚙ 管理画面</h3>
              <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: 0 }}>記事・コース・ユーザーの管理はこちらから</p>
            </div>
            <Link href="/admin" style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-deep)', textDecoration: 'none' }}>管理画面へ →</Link>
          </div>
        )}

        {/* Logout */}
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <button className="btn" style={{ color: 'var(--rose)', borderColor: 'var(--rose-soft)' }}
            onClick={() => { deleteCookie('aladdin_token'); router.push('/') }}>
            ログアウト
          </button>
        </div>
      </main>
    </>
  )
}
