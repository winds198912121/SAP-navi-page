// ===========================================================
// Team — 執筆メンバー /team
// ===========================================================
import StaticPage from '../components/layout/StaticPage'

const MEMBERS = [
  { name: 'パンダ先生', role: 'SAP マスター講師', bio: 'SAP歴20年のベテラン。難しい概念をやさしく解説するのが得意。趣味は竹を食べること。', emoji: '🐼' },
  { name: 'たろうくん', role: 'SAP 学習者代表', bio: '24歳・SAP学習中の若手。読者の目線で「わからない」を代弁する。', emoji: '👨‍💻' },
  { name: 'タナカ', role: 'ABAP エンジニア', bio: 'バックエンド開発が専門。ABAP パフォーマンス改善の記事を担当。', emoji: '⚡' },
  { name: 'サトウ', role: 'PM / コンサルタント', bio: 'S/4HANA 移行プロジェクトを多数手がける。プロジェクト管理の記事を執筆。', emoji: '📋' },
]

export default function Team() {
  return (
    <StaticPage title="執筆メンバー" description="SAP パンダ先生 NAVI の執筆メンバー紹介。パンダ先生、たろうくん、ABAP エンジニア、PM コンサルタントが SAP 学習をサポートします。" path="/team">
      <p>SAP パンダ先生 NAVI は、現役 SAP コンサルタントやエンジニアが執筆しています。</p>
      <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
        {MEMBERS.map(m => (
          <div key={m.name} style={{ display: 'flex', gap: 16, padding: '16px 20px', background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line-1)' }}>
            <div style={{ fontSize: 40, lineHeight: 1 }}>{m.emoji}</div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--ink-0)' }}>{m.name}</div>
              <div style={{ fontSize: 12, color: 'var(--accent-deep)', marginBottom: 4 }}>{m.role}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.7 }}>{m.bio}</div>
            </div>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 24, fontSize: 13, color: 'var(--ink-2)' }}>随時メンバー募集中です。お問い合わせフォームからご連絡ください。</p>
    </StaticPage>
  )
}
