// ===========================================================
// Dashboard — 管理画面ダッシュボード（統計概覧）
// ===========================================================
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

interface Stats {
  counts: Record<string, number>
  recent_articles: any[]
  recent_users: any[]
  recent_inquiries: any[]
  popular_articles: any[]
}

const COUNT_CARDS = [
  { key: 'articles', label: '公開記事', icon: '📰', color: '#3b82f6', bg: '#dbeafe', link: '/admin/articles' },
  { key: 'courses', label: 'コース', icon: '📚', color: '#5a9d6e', bg: '#d8ead9', link: '/admin/courses' },
  { key: 'lessons', label: 'レッスン', icon: '📝', color: '#d97548', bg: '#fde0c2', link: '/admin/lessons' },
  { key: 'knowledge', label: 'ナレッジ', icon: '📖', color: '#8b5cf6', bg: '#ede9fe', link: '/admin/knowledge' },
  { key: 'videos', label: '動画', icon: '🎬', color: '#ec4899', bg: '#fce7f3', link: '/admin/videos' },
  { key: 'quizzes', label: 'クイズ', icon: '❓', color: '#f59e0b', bg: '#fef3c7', link: '/admin/quizzes' },
  { key: 'cases', label: '案件', icon: '💼', color: '#6366f1', bg: '#e0e7ff', link: '/admin/cases' },
  { key: 'users', label: 'ユーザー', icon: '👥', color: '#14b8a6', bg: '#ccfbf1', link: '/admin/users' },
  { key: 'paths', label: '学習パス', icon: '🎯', color: '#a855f7', bg: '#f3e8ff', link: '/paths' },
  { key: 'contact_unread', label: '未読問合せ', icon: '📨', color: '#ef4444', bg: '#fee2e2', link: '/admin/contact', badge: true },
]

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.client.get('/admin/stats').then(({ data }) => {
      if (data.success) setStats(data.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="admin-loading">統計データを読み込み中...</div>
  if (!stats) return <div className="admin-empty"><div className="admin-empty-icon">📊</div><p>統計データの取得に失敗しました。</p></div>

  const c = stats.counts

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>ダッシュボード</h1>
          <p className="admin-page-desc">サイト全体の統計データを一覧表示</p>
        </div>
      </div>

      {/* 統計カード */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12, marginBottom: 28 }}>
        {COUNT_CARDS.map(card => {
          const val = c[card.key] ?? 0
          return (
            <Link key={card.key} to={card.link}
              style={{
                display: 'flex', flexDirection: 'column', gap: 6,
                padding: '16px 14px', borderRadius: 14,
                background: card.bg, textDecoration: 'none',
                position: 'relative', overflow: 'hidden',
                transition: 'transform 0.12s', cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: 24, lineHeight: 1 }}>{card.icon}</div>
              <div>
                <div style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 800, fontSize: 24, color: card.color, lineHeight: 1.2 }}>
                  {val.toLocaleString()}
                  {card.key === 'contact_unread' && val > 0 && (
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', marginLeft: 4, verticalAlign: 'super' }}>
                      NEW
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 11.5, color: '#4a4030', fontWeight: 500 }}>{card.label}</div>
              </div>
            </Link>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* 最近の記事 */}
        <div className="admin-form-card">
          <h3>📰 最近の記事</h3>
          {stats.recent_articles.length === 0 ? (
            <div className="admin-empty" style={{ padding: 20 }}>まだ記事がありません</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {stats.recent_articles.map((a: any) => (
                <Link key={a.id} to={`/admin/articles/${a.id}/edit`}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 10px', borderRadius: 8, textDecoration: 'none', color: 'inherit',
                    transition: 'background 0.1s', fontSize: 13 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tint)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>
                    {a.module && <span style={{ fontSize: 10.5, padding: '1px 5px', borderRadius: 3, background: '#d8ead9', color: '#3e7a52', fontWeight: 600, marginRight: 6 }}>{a.module}</span>}
                    {a.title}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--ink-3)', whiteSpace: 'nowrap', marginLeft: 12 }}>
                    👁 {a.views?.toLocaleString() || 0}
                  </span>
                </Link>
              ))}
            </div>
          )}
          <Link to="/admin/articles" className="admin-crumb" style={{ display: 'block', marginTop: 10, fontSize: 12 }}>すべての記事を見る →</Link>
        </div>

        {/* 人気記事 */}
        <div className="admin-form-card">
          <h3>🔥 よく読まれている記事</h3>
          {stats.popular_articles.length === 0 ? (
            <div className="admin-empty" style={{ padding: 20 }}>データがありません</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {stats.popular_articles.map((a: any, i: number) => (
                <div key={a.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', borderRadius: 8, fontSize: 13 }}>
                  <span style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 800, fontSize: 16,
                    color: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#d97548' : 'var(--ink-3)', width: 24, textAlign: 'center' }}>
                    {i + 1}
                  </span>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</span>
                  <span style={{ fontSize: 11, color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>👁 {a.views?.toLocaleString() || 0}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 最近のお問い合わせ */}
        <div className="admin-form-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            📨 最近のお問い合わせ
            {c.contact_unread > 0 && (
              <span style={{ fontSize: 10.5, padding: '2px 8px', borderRadius: 999, background: '#ef4444', color: 'white', fontWeight: 700 }}>
                {c.contact_unread}件未読
              </span>
            )}
          </h3>
          {stats.recent_inquiries.length === 0 ? (
            <div className="admin-empty" style={{ padding: 20 }}>お問い合わせはありません</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {stats.recent_inquiries.map((inq: any) => (
                <Link key={inq.id} to={`/admin/contact`}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 10px', borderRadius: 8, textDecoration: 'none', color: 'inherit', fontSize: 13 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tint)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                      background: inq.status === 'unread' ? '#ef4444' : inq.status === 'replied' ? '#5a9d6e' : '#94a3b8',
                    }} />
                    {inq.name}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{new Date(inq.created_at).toLocaleDateString('ja-JP')}</span>
                </Link>
              ))}
            </div>
          )}
          <Link to="/admin/contact" className="admin-crumb" style={{ display: 'block', marginTop: 10, fontSize: 12 }}>すべて見る →</Link>
        </div>

        {/* 最近のユーザー */}
        <div className="admin-form-card">
          <h3>👥 最近登録したユーザー</h3>
          {stats.recent_users.length === 0 ? (
            <div className="admin-empty" style={{ padding: 20 }}>ユーザーがいません</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {stats.recent_users.map((u: any) => (
                <div key={u.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', borderRadius: 8, fontSize: 13 }}>
                  <img src={u.avatar} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', background: '#eee' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{u.email}</div>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>{new Date(u.registered_at).toLocaleDateString('ja-JP')}</span>
                </div>
              ))}
            </div>
          )}
          <Link to="/admin/users" className="admin-crumb" style={{ display: 'block', marginTop: 10, fontSize: 12 }}>すべてのユーザーを見る →</Link>
        </div>
      </div>
    </div>
  )
}
