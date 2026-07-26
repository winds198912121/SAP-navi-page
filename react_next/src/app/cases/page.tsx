'use client'
// ===========================================================
// CasesPage — 案件専用ページ /cases
// ===========================================================
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import LoginModal from '@/components/auth/LoginModal'

const PUBLIC_API = '/wp-json/sap/v1'

const MOD_COLOR: Record<string, string> = {
  fi: '#2f6d44', co: '#2641a1', mm: '#a25411', sd: '#b62a4a', pp: '#4828a8',
  hr: '#8a6212', abap: '#1f6f6f', basis: '#4a432d', s4: '#1864a3',
}

const MATCH_MODULES = ['FI', 'CO', 'MM', 'SD', 'PP', 'HR', 'ABAP', 'Basis', 'S/4']

const FALLBACK_CASES = [
  { id: 1, mods: ['FI', 'CO'], title: 'グローバル製造業 / S4移行に伴う FI-CO コンサル', rate_min: 85, rate_max: 110, rate_label: '月85〜110万', hi: true, urgent: true, period: '6ヶ月〜', utilization: '週5', location: '東京', remote: '一部リモート', experience: '5年以上', seats: 2, scarce: false, skills_must: ['FI', 'CO', 'S/4HANA'], skills_want: ['PM経験'], blurb: '大手製造業のS/4HANA移行プロジェクト。COからFIまで幅広い知識を活かせます。', company: '', created_at: new Date().toISOString() },
  { id: 2, mods: ['ABAP'], title: 'アドオン開発リード / CDS・RAP 中心のモダン ABAP', rate_min: 75, rate_max: 95, rate_label: '月75〜95万', hi: true, urgent: true, period: '長期', utilization: '週5', location: '東京', remote: 'フルリモート', experience: '3年以上', seats: 1, scarce: false, skills_must: ['ABAP', 'CDS'], skills_want: ['RAP'], blurb: 'CDS View/RAPを使ったモダンABAP開発。100%リモート可。', company: '大手SIer', created_at: new Date().toISOString() },
  { id: 3, mods: ['MM', 'SD'], title: '物流・小売 / MM-SD 保守運用 & 機能改善', rate_min: 65, rate_max: 80, rate_label: '月65〜80万', hi: false, urgent: false, period: '6ヶ月〜', utilization: '週5', location: '大阪', remote: '一部リモート', experience: '3年以上', seats: 1, scarce: false, skills_must: ['MM', 'SD'], skills_want: [], blurb: '大手小売業のMM/SD保守運用案件。安定して長く働けます。', company: '', created_at: new Date().toISOString() },
  { id: 4, mods: ['S/4', 'FI'], title: '大手商社 / S/4HANA 導入 PMO・推進支援', rate_min: 90, rate_max: 110, rate_label: '月90〜110万', hi: true, urgent: false, period: '1年〜', utilization: '週5', location: '東京', remote: '一部リモート', experience: '7年以上', seats: 1, scarce: false, skills_must: ['FI', 'S/4HANA'], skills_want: ['PMO'], blurb: '商社S/4導入のPMO。上流から携われるレア案件。', company: '', created_at: new Date().toISOString() },
  { id: 5, mods: ['CO'], title: '管理会計 / 原価計算まわりの設計支援', rate_min: 70, rate_max: 85, rate_label: '月70〜85万', hi: false, urgent: true, period: '3ヶ月〜', utilization: '週5', location: '名古屋', remote: '一部リモート', experience: '3年以上', seats: 2, scarce: false, skills_must: ['CO', '原価計算'], skills_want: [], blurb: '製造業の原価計算設計支援。CO経験者急募。', company: '', created_at: new Date().toISOString() },
  { id: 6, mods: ['Basis'], title: 'SAP Basis 運用 / 権限・パッチ・監視', rate_min: 60, rate_max: 75, rate_label: '月60〜75万', hi: false, urgent: false, period: '長期', utilization: '週5', location: '東京', remote: 'リモート可', experience: '3年以上', seats: 1, scarce: false, skills_must: ['Basis'], skills_want: ['CLOUD'], blurb: '大手企業のSAP Basis運用保守。落ち着いた環境です。', company: '', created_at: new Date().toISOString() },
  { id: 7, mods: ['PP', 'MM'], title: '製造業 / PP-MM 生産・購買プロセス改善', rate_min: 72, rate_max: 88, rate_label: '月72〜88万', hi: false, urgent: true, period: '6ヶ月〜', utilization: '週5', location: '福岡', remote: '一部リモート', experience: '3年以上', seats: 1, scarce: false, skills_must: ['PP', 'MM'], skills_want: [], blurb: '製造業のPP/MMプロセス改善。九州在住の方歓迎。', company: '', created_at: new Date().toISOString() },
  { id: 8, mods: ['SD'], title: 'BtoB販売 / SD 受注〜請求の機能拡張', rate_min: 68, rate_max: 82, rate_label: '月68〜82万', hi: false, urgent: false, period: '3ヶ月〜', utilization: '週5', location: '東京', remote: 'リモート可', experience: '3年以上', seats: 1, scarce: false, skills_must: ['SD'], skills_want: ['EDI'], blurb: 'SDモジュールの機能拡張案件。EDI連携経験者は歓迎。', company: '', created_at: new Date().toISOString() },
]

const RATE_RANGES = [
  { value: '〜60', label: '60万未満', min: 0, max: 59 },
  { value: '60-80', label: '60〜80万', min: 60, max: 80 },
  { value: '80-100', label: '80〜100万', min: 81, max: 100 },
  { value: '100〜', label: '100万以上', min: 100, max: 999 },
]

const WORRIES = [
  { q: '案件探しが、とにかく大変…', a: '希望条件を一度登録すれば、合う案件だけスカウトでお届け。探す時間をゼロに。', tag: '探す手間' },
  { q: '単価交渉、正直ニガテ。', a: '相場と実績をもとに、担当が代わりに交渉。「言い出せず安く受ける」をなくします。', tag: '単価' },
  { q: 'ブランク・年齢が不安。', a: '40代・復帰組の決定実績多数。経験の棚卸しから一緒に。學び直しはパンダ先生で。', tag: 'キャリア' },
  { q: '自分の市場価値がわからない。', a: '登録すると無料で「単価診断」。今のスキルがいくらになるか、客観的に把握できます。', tag: '価値' },
]

function normalizeLocation(loc: string): string {
  const l = loc.trim()
  if (l.includes('東京')) return '東京'
  if (l.includes('大阪')) return '大阪'
  if (l.includes('名古屋')) return '名古屋'
  if (l.includes('福岡')) return '福岡'
  return l
}

export default function CasesPage() {
  const [allCases, setAllCases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [picked, setPicked] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ location: '', rate: '', period: '', exp: '' })
  const [detail, setDetail] = useState<any>(null)
  const [showLogin, setShowLogin] = useState(false)
  const perPage = 20

  useEffect(() => {
    fetch(`${PUBLIC_API}/cases?per_page=200`).then(r => r.json()).then(d => {
      if (d.success && d.data?.length > 0) setAllCases(d.data)
      else setAllCases(FALLBACK_CASES)
    }).catch(() => setAllCases(FALLBACK_CASES)).finally(() => setLoading(false))
  }, [])

  const locationOptions = useMemo(() => {
    const set = new Set<string>()
    allCases.forEach((c: any) => { if (c.location) set.add(normalizeLocation(c.location)) })
    return Array.from(set).sort()
  }, [allCases])

  const isMatched = (c: any) => picked.length > 0 && c.mods.some((m: string) => picked.map(p => p.toLowerCase()).includes(m.toLowerCase()))

  const filtered = useMemo(() => {
    let result = allCases
    if (filters.location) result = result.filter((c: any) => normalizeLocation(c.location) === filters.location)
    if (filters.rate) { const r = RATE_RANGES.find(x => x.value === filters.rate); if (r) result = result.filter((c: any) => c.rate_max >= r.min && c.rate_min <= r.max) }
    if (filters.exp) {
      result = result.filter((c: any) => {
        const m = (c.experience || '').match(/(\d+)/); const y = m ? parseInt(m[1]) : 0
        if (filters.exp === '〜3年') return y <= 3
        if (filters.exp === '3〜5年') return y >= 3 && y <= 5
        if (filters.exp === '5〜7年') return y >= 5 && y <= 7
        if (filters.exp === '7年以上') return y >= 7
        return false
      })
    }
    return [...result].sort((a: any, b: any) => (isMatched(b) ? 1 : 0) - (isMatched(a) ? 1 : 0))
  }, [allCases, filters, picked])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)
  const matchCount = picked.length === 0 ? filtered.length : filtered.filter(isMatched).length

  const selectStyle: React.CSSProperties = { width: '100%', padding: '8px 12px', borderRadius: 'var(--r-md)', border: '1.5px solid var(--line-2)', background: 'var(--bg-card)', fontFamily: 'inherit', fontSize: 13, color: 'var(--ink-1)', outline: 'none', cursor: 'pointer' }
  const inputStyle: React.CSSProperties = { padding: '10px 14px', border: '1.5px solid var(--line-2)', borderRadius: 'var(--r-md)', fontSize: 14, outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' }

  const [applyFor, setApplyFor] = useState<any>(null)
  const [registerDone, setRegisterDone] = useState(false)
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', phone: '', expected_rate: '', experience_years: '', self_pr: '' })
  const [regSkills, setRegSkills] = useState<string[]>([])
  const [regSubmitting, setRegSubmitting] = useState(false)

  if (loading) return (<><div className="page-bg" /><div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>読み込み中...</div></>)

  return (
    <>
      <div className="page-bg" />

      {/* Case Ticker */}
      <div className="case-ticker" id="cases-top">
        <div className="ticker-head">
          <div className="ticker-flag"><span className="pulse" />SAP案件 募集中</div>
          <div className="ticker-count"><b>{allCases.length}</b>件の案件 — <span className="hi">最高 月{Math.max(...allCases.map((c: any) => c.rate_max || 0), 0)}万円</span></div>
        </div>
        <div className="ticker-viewport">
          <div className="ticker-track">
            {allCases.concat(allCases).map((c: any, i: number) => (
              <a key={i} className="ticker-pill" style={{ cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); setDetail(c) }}>
                {c.urgent && <span className="tp-urgent">急募</span>}
                <span className="tp-mod" style={{ background: MOD_COLOR[(c.mods?.[0] || '').toLowerCase()] || '#5a9d6e' }}>{c.mods?.[0] || ''}</span>
                <span>{c.title}</span>
                <span className={`tp-rate${c.hi ? ' hi' : ''}`}>月{c.rate_min}万〜</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Section */}
      <section className="section" id="cases">
        <div className="section-head">
          <div>
            <div className="label">SAP Freelance · 案件情報</div>
            <h2>学んだら、稼ごう<span className="accent-mark">。</span></h2>
          </div>
          <div className="desc">
            パンダ先生で学んだ知識を、そのまま収入に。<br />
            元請直請・中間マージン最小の SAP 常駐／フリーランス案件を厳選掲載。
          </div>
        </div>

        {/* Skill Match Bar */}
        <div className="match-bar">
          <div className="match-left">
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-0)', marginBottom: 8 }}>あなたの得意モジュールは？</div>
            <div className="match-chips">
              {MATCH_MODULES.map(m => (
                <button key={m} type="button" className={`match-chip${picked.includes(m) ? ' on' : ''}`}
                  style={picked.includes(m) ? { background: MOD_COLOR[m.toLowerCase()] || '#5a9d6e', borderColor: MOD_COLOR[m.toLowerCase()] || '#5a9d6e', color: '#fff' } : {}}
                  onClick={() => { setPicked(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]); setPage(1) }}>{m}</button>
              ))}
            </div>
          </div>
          <div className="match-result" style={{ textAlign: 'right' }}>
            <div className="match-count">
              <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>あなたに合う案件</div>
              <span style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: 28, color: 'var(--accent)' }}>
                {matchCount}<small style={{ fontSize: 14 }}>件</small>
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ marginTop: 16, padding: '16px 18px', background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line-1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-2)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>🔍 絞り込み検索</span>
            {(!!filters.location || !!filters.rate || !!filters.period || !!filters.exp || picked.length > 0) && (
              <button onClick={() => { setFilters({ location: '', rate: '', period: '', exp: '' }); setPicked([]); setPage(1) }} style={{ background: 'none', border: 'none', color: 'var(--accent-deep)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, textDecoration: 'underline', padding: 0 }}>クリア</button>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 10 }}>
            <div><div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', marginBottom: 4 }}>勤務地</div>
              <select style={selectStyle} value={filters.location} onChange={e => { setFilters(p => ({ ...p, location: e.target.value })); setPage(1) }}><option value="">すべて</option>{locationOptions.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
            <div><div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', marginBottom: 4 }}>月給</div>
              <select style={selectStyle} value={filters.rate} onChange={e => { setFilters(p => ({ ...p, rate: e.target.value })); setPage(1) }}><option value="">すべて</option>{RATE_RANGES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}</select></div>
            <div><div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', marginBottom: 4 }}>期間</div>
              <select style={selectStyle} value={filters.period} onChange={e => { setFilters(p => ({ ...p, period: e.target.value })); setPage(1) }}><option value="">すべて</option><option value="〜3ヶ月">〜3ヶ月</option><option value="3-6ヶ月">3ヶ月〜6ヶ月</option><option value="6-12ヶ月">6ヶ月〜1年</option><option value="1年〜">1年〜</option><option value="長期">長期</option></select></div>
            <div><div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', marginBottom: 4 }}>経験年数</div>
              <select style={selectStyle} value={filters.exp} onChange={e => { setFilters(p => ({ ...p, exp: e.target.value })); setPage(1) }}><option value="">すべて</option><option value="〜3年">〜3年</option><option value="3〜5年">3〜5年</option><option value="5〜7年">5〜7年</option><option value="7年以上">7年以上</option></select></div>
          </div>
        </div>

        {/* Results */}
        <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 16, marginBottom: 8 }}>
          <strong style={{ color: 'var(--ink-0)' }}>{filtered.length}</strong> 件の案件
          {(!!filters.location || !!filters.rate || !!filters.period || !!filters.exp || picked.length > 0) && (
            <span>（<button onClick={() => { setFilters({ location: '', rate: '', period: '', exp: '' }); setPicked([]); setPage(1) }} style={{ background: 'none', border: 'none', color: 'var(--accent-deep)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, textDecoration: 'underline', padding: 0 }}>条件を解除</button>）</span>
          )}
        </div>

        <div className="case-grid">
          {paginated.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}><div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div><p>検索条件に一致する案件がありません</p></div>
          ) : (
            paginated.map((c: any) => (
              <article key={c.id} className={`case-card${isMatched(c) ? ' matched' : ''}`} onClick={() => setDetail(c)}>
                {isMatched(c) && <div className="case-match-ribbon">スキル一致</div>}
                <div className="case-card-top">
                  <div className="case-mods">
                    {(c.mods || []).map((m: string) => <span key={m} className="case-mod" style={{ background: MOD_COLOR[m.toLowerCase()] || '#5a9d6e' }}>{m}</span>)}
                  </div>
                  <div className="case-flags">
                    {c.urgent && <span className="flag urgent">急募</span>}
                    {c.scarce && <span className="flag scarce">残り{c.seats}枠</span>}
                  </div>
                </div>
                <h3 className="case-title">{c.title}</h3>
                <div className="case-rate-row">
                  <div className={`case-rate${c.hi ? ' hi' : ''}`}>
                    <span className="unit">月</span>
                    <span className="num">{c.rate_min}〜{c.rate_max}</span>
                    <span className="unit">万円</span>
                  </div>
                  {c.hi && <span className="case-hi-badge">高単価</span>}
                </div>
                <dl className="case-meta">
                  <div><dt>期間</dt><dd>{c.period}</dd></div>
                  <div><dt>勤務地</dt><dd>{c.location}<span> · {c.remote}</span></dd></div>
                  <div><dt>経験</dt><dd>{c.experience}</dd></div>
                </dl>
                <div className="case-skills">
                  {(c.skills_must || []).slice(0, 2).map((s: string, i: number) => <span key={i} className="case-skill">{s}</span>)}
                </div>
                <div className="case-card-foot">
                  <span>募集 {c.seats} 名</span>
                  <span className="case-open">詳細を見る →</span>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="admin-pagination" style={{ marginTop: 24 }}>
            <button className="btn sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ opacity: page <= 1 ? 0.4 : 1, cursor: page <= 1 ? 'not-allowed' : 'pointer' }}>← 前へ</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className="btn sm" style={{ minWidth: 36, justifyContent: 'center', background: p === page ? 'var(--accent)' : 'var(--bg-card)', color: p === page ? 'white' : 'var(--ink-1)', borderColor: p === page ? 'var(--accent)' : 'var(--line-2)' }}>{p}</button>
            ))}
            <button className="btn sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={{ opacity: page >= totalPages ? 0.4 : 1, cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}>次へ →</button>
            <span style={{ fontSize: 12, color: 'var(--ink-3)', marginLeft: 8 }}>{page} / {totalPages} ページ</span>
          </div>
        )}
      </section>

      {/* FreelanceWorries */}
      <section className="section" id="worries">
        <div className="section-head">
          <div>
            <div className="label">Freelancer&apos;s Real Talk</div>
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
              <div className="worry-q">{`「${w.q}」`}</div>
              <div className="worry-a">
                <span style={{ fontWeight: 600, color: 'var(--accent-deep)', display: 'block', marginBottom: 4 }}>パンダ先生の答え</span>
                {w.a}
              </div>
            </div>
          ))}
        </div>
        <div className="worries-cta">
          <div style={{ fontSize: 80, lineHeight: 1 }}>🐼</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-deep)' }}>まずは登録だけでもOK 🎋</div>
            <h3 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: 26, color: 'var(--ink-0)', margin: '8px 0' }}>{`「いつか」を、今日の一歩に。`}</h3>
            <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.7 }}>登録は無料・3分。合わなければ断ってOK。あなたの SAP スキルは、ちゃんとお金になります。</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button className="btn accent" type="button" onClick={() => setApplyFor({ id: 0, title: 'フリーランス登録' })}>案件を見て登録する →</button>
              <Link href="/paths" className="btn ghost" style={{ textDecoration: 'none' }}>まず学習パスでスキルを固める</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {detail && (
        <div className="case-modal-overlay" onClick={() => setDetail(null)}>
          <div className="case-modal detail" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <button className="case-modal-x" onClick={() => setDetail(null)}>×</button>
            <div className="case-detail-head">
              <div className="case-mods" style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
                {(detail.mods || []).map((m: string) => <span key={m} className="case-mod" style={{ background: MOD_COLOR[m.toLowerCase()] || '#5a9d6e' }}>{m}</span>)}
                {detail.urgent && <span className="flag urgent">急募</span>}
                {detail.scarce && <span className="flag scarce">残り{detail.seats}枠</span>}
              </div>
              <h3 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: 18, color: 'var(--ink-0)', margin: '0 0 10px' }}>{detail.title}</h3>
              <div className={`case-rate big${detail.hi ? ' hi' : ''}`}>
                <span className="unit">月額</span>
                <span className="num">{detail.rate_min}〜{detail.rate_max}</span>
                <span className="unit">万円</span>
                {detail.hi && <span className="case-hi-badge">高単価</span>}
              </div>
            </div>
            <p className="case-blurb">{detail.blurb}</p>
            <div className="case-detail-grid">
              <div className="case-spec"><span className="k">契約期間</span><span className="v">{detail.period}</span></div>
              <div className="case-spec"><span className="k">稼働形態</span><span className="v">{detail.utilization}</span></div>
              <div className="case-spec"><span className="k">勤務地</span><span className="v">{detail.location}（{detail.remote}）</span></div>
              <div className="case-spec"><span className="k">必要経験</span><span className="v">{detail.experience}</span></div>
              <div className="case-spec"><span className="k">募集人数</span><span className="v">{detail.seats} 名</span></div>
            </div>
            <div className="case-skill-block">
              <h4>必須スキル</h4>
              <ul className="case-skill-list must">{(detail.skills_must || []).map((s: string, i: number) => <li key={i}>{s}</li>)}</ul>
              <h4>歓迎スキル</h4>
              <ul className="case-skill-list want">{(detail.skills_want || []).map((s: string, i: number) => <li key={i}>{s}</li>)}</ul>
            </div>
            <div className="case-sensei-note">
              <div style={{ fontSize: 48, lineHeight: 1, marginRight: 10 }}>🐼</div>
              <div><strong>パンダ先生より</strong> この案件、あなたの経歴と相性が良さそう。まずは応募して話を聞いてみよう。<b>応募 = 即決定ではない</b>から、気軽に第一歩を踏み出してOKだよ。🎋</div>
            </div>
            <div className="case-modal-foot">
              <button className="btn" type="button" onClick={() => setDetail(null)}>一覧に戻る</button>
              <button className="btn accent" type="button" onClick={() => { setShowLogin(true) }}>
                この案件に応募する
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  )
}
