// ===========================================================
// 个人资料页面 (T2.2.2.1)
// ===========================================================

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, type AuthUser } from '../hooks/useAuth'
import api from '../services/api'
import { p } from '../config'
import Seo from '../components/layout/Seo'
import SiteHeader from '../components/layout/Header'
import SiteFooter from '../components/layout/Footer'

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

function PointsHistory() {
  const [history, setHistory] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [claimMsg, setClaimMsg] = useState('')
  const [claimErr, setClaimErr] = useState(false)

  const fetchPoints = () => {
    api.getPoints().then(res => {
      if (res.success) {
        setTotal(res.data.total)
        setHistory(res.data.history || [])
      }
    }).finally(() => setLoading(false))
  }

  useEffect(() => { fetchPoints() }, [])

  async function claimDaily() {
    setClaiming(true)
    setClaimMsg('')
    try {
      const res = await api.claimDailyPoints()
      if (res.success) {
        setClaimMsg(res.data?.message || '10ポイント獲得！')
        setClaimErr(false)
        fetchPoints()
      } else {
        setClaimMsg(res.message || '本日は既に受取済みです。')
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
  const { user, loading, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!loading && !user) navigate('/login')
  }, [user, loading, navigate])

  useEffect(() => {
    if (editing && user) {
      setName(user.displayName)
      setBio(user.description || '')
    }
  }, [editing, user])

  if (loading || !user) return null

  async function handleSave() {
    setSaving(true)
    const ok = await updateProfile({ displayName: name, description: bio })
    setSaving(false)
    if (ok) { setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 2000) }
  }

  return (
    <>
      <Seo
        title="プロフィール — SAP パンダ先生"
        description="学習統計、進捗管理、設定変更。SAP パンダ先生 NAVI のプロフィールページ。"
        path="/profile"
        noindex
      />
      <div className="page-bg" />
      <SiteHeader />
      <main style={{ position: 'relative', zIndex: 2, maxWidth: 880, margin: '0 auto', padding: '40px 28px 80px' }}>
        {/* Profile Header */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--r-xl)',
          border: '1px solid var(--line-1)', padding: '32px 36px',
          display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap',
        }}>
          <div style={{ position: 'relative' }}>
            <img src={user.avatarUrl} alt={user.displayName}
              style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-soft)' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            {!editing ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--ink-0)', margin: 0 }}>{user.displayName}</h1>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 'var(--r-pill)', background: 'var(--accent-soft)', color: 'var(--accent-deep)', fontWeight: 600, letterSpacing: '0.06em' }}>
                    {user.roles?.includes('administrator') ? '管理者' : user.roles?.includes('subscriber') ? 'メンバー' : ''}
                  </span>
                </div>
                {user.description && <p style={{ fontSize: 13.5, color: 'var(--ink-2)', margin: '8px 0 0', lineHeight: 1.7 }}>{user.description}</p>}
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 8 }}>
                  登録: {user.memberSince} · {user.email}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input value={name} onChange={e => setName(e.target.value)}
                  placeholder="表示名" style={inputStyle} />
                <textarea value={bio} onChange={e => setBio(e.target.value)}
                  placeholder="自己紹介" rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }} />
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
          <StatCard label="閲覧記事" value={user.stats?.articlesRead || 0} unit=" 本" />
          <StatCard label="回答数" value={user.stats?.quizzesAnswered || 0} unit=" 問" />
          <StatCard label="正解率" value={user.stats?.quizAccuracy || 0} unit="%" />
          <StatCard label="ブックマーク" value={user.stats?.bookmarks || 0} unit=" 件" />
        </div>

        {/* Points History */}
        <PointsHistory />

        {/* Bookmark link */}
        <div style={{ marginTop: 24, padding: '18px 20px', background: 'var(--bg-card)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-lg)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--ink-0)', margin: '0 0 8px' }}>📑 保存した記事</h3>
          <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: 0 }}>
            {user.stats?.bookmarks ? `${user.stats.bookmarks} 件の記事を保存しています。` : 'まだ記事を保存していません。'}
          </p>
        </div>

        {/* Logout */}
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <button className="btn" style={{ color: 'var(--rose)', borderColor: 'var(--rose-soft)' }}
            onClick={() => { api.logout(); window.location.href = p('/') }}>
            ログアウト
          </button>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '8px 12px', border: '1.5px solid var(--line-2)',
  borderRadius: 'var(--r-md)', fontSize: 13.5, outline: 'none',
  fontFamily: 'inherit', width: '100%', background: 'var(--bg-1)',
}
