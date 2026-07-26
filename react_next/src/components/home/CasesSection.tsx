'use client'
// ===========================================================
// CasesSection — 首页案件区（跑马灯 + 案件卡片 + フリーランス悩み）
// ===========================================================
import { useState, useEffect } from 'react'
import Link from 'next/link'

const PUBLIC_API = '/wp-json/sap/v1'

const MOD_COLOR: Record<string, string> = {
  fi: '#2f6d44', co: '#2641a1', mm: '#a25411', sd: '#b62a4a',
  pp: '#4828a8', hr: '#8a6212', abap: '#1f6f6f', basis: '#4a432d', s4: '#1864a3',
}

const FALLBACK_CASES = [
  { id: 1, mods: ['FI', 'CO'], title: 'グローバル製造業 / S4移行に伴う FI-CO コンサル', rate_min: 85, rate_max: 110, rate_label: '月85〜110万', hi: true, urgent: true, period: '6ヶ月〜', utilization: '週5', location: '東京', remote: '一部リモート', experience: '5年以上', seats: 2, scarce: false, skills_must: ['FI', 'CO', 'S/4HANA'], skills_want: ['PM経験'], blurb: '大手製造業のS/4HANA移行プロジェクト', company: '', created_at: '' },
  { id: 2, mods: ['ABAP'], title: 'アドオン開発リード / CDS・RAP 中心のモダン ABAP', rate_min: 75, rate_max: 95, rate_label: '月75〜95万', hi: true, urgent: true, period: '長期', utilization: '週5', location: '東京', remote: 'フルリモート', experience: '3年以上', seats: 1, scarce: false, skills_must: ['ABAP', 'CDS'], skills_want: ['RAP'], blurb: '', company: '', created_at: '' },
  { id: 3, mods: ['MM', 'SD'], title: '物流・小売 / MM-SD 保守運用 & 機能改善', rate_min: 65, rate_max: 80, rate_label: '月65〜80万', hi: false, urgent: false, period: '6ヶ月〜', utilization: '週5', location: '大阪', remote: '一部リモート', experience: '3年以上', seats: 1, scarce: false, skills_must: ['MM', 'SD'], skills_want: [], blurb: '', company: '', created_at: '' },
  { id: 4, mods: ['S/4', 'FI'], title: '大手商社 / S/4HANA 導入 PMO・推進支援', rate_min: 90, rate_max: 110, rate_label: '月90〜110万', hi: true, urgent: false, period: '1年〜', utilization: '週5', location: '東京', remote: '一部リモート', experience: '7年以上', seats: 1, scarce: false, skills_must: ['FI', 'S/4HANA'], skills_want: ['PMO'], blurb: '', company: '', created_at: '' },
  { id: 5, mods: ['CO'], title: '管理会計 / 原価計算まわりの設計支援', rate_min: 70, rate_max: 85, rate_label: '月70〜85万', hi: false, urgent: true, period: '3ヶ月〜', utilization: '週5', location: '名古屋', remote: '一部リモート', experience: '3年以上', seats: 2, scarce: false, skills_must: ['CO', '原価計算'], skills_want: [], blurb: '', company: '', created_at: '' },
  { id: 6, mods: ['Basis'], title: 'SAP Basis 運用 / 権限・パッチ・監視', rate_min: 60, rate_max: 75, rate_label: '月60〜75万', hi: false, urgent: false, period: '長期', utilization: '週5', location: '東京', remote: 'リモート可', experience: '3年以上', seats: 1, scarce: false, skills_must: ['Basis'], skills_want: ['CLOUD'], blurb: '', company: '', created_at: '' },
  { id: 7, mods: ['PP', 'MM'], title: '製造業 / PP-MM 生産・購買プロセス改善', rate_min: 72, rate_max: 88, rate_label: '月72〜88万', hi: false, urgent: true, period: '6ヶ月〜', utilization: '週5', location: '福岡', remote: '一部リモート', experience: '3年以上', seats: 1, scarce: false, skills_must: ['PP', 'MM'], skills_want: [], blurb: '', company: '', created_at: '' },
  { id: 8, mods: ['SD'], title: 'BtoB販売 / SD 受注〜請求の機能拡張', rate_min: 68, rate_max: 82, rate_label: '月68〜82万', hi: false, urgent: false, period: '3ヶ月〜', utilization: '週5', location: '東京', remote: 'リモート可', experience: '3年以上', seats: 1, scarce: false, skills_must: ['SD'], skills_want: ['EDI'], blurb: '', company: '', created_at: '' },
]

export default function CasesSection() {
  const [allCases, setAllCases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<any>(null)

  useEffect(() => {
    fetch(`${PUBLIC_API}/cases?per_page=200`).then(r => r.json()).then(d => {
      if (d.success && d.data?.length > 0) setAllCases(d.data)
      else setAllCases(FALLBACK_CASES)
    }).catch(() => setAllCases(FALLBACK_CASES)).finally(() => setLoading(false))
  }, [])

  if (loading || allCases.length === 0) return null

  const maxRate = Math.max(...allCases.map((c: any) => c.rate_max), 0)

  return (
    <>
      {/* Case Ticker */}
      <div className="case-ticker" id="cases-top">
        <div className="ticker-head">
          <div className="ticker-flag"><span className="pulse" />📋 案件ピックアップ</div>
          <div className="ticker-count"><b>{allCases.length}</b> 件の案件 — <span className="hi">最高 月{maxRate}万円</span></div>
          <Link href="/cases" className="ticker-cta" style={{ textDecoration: 'none' }}>すべて見る →</Link>
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

      {/* Case Cards */}
      <section className="section" id="cases">
        <div className="section-head">
          <div>
            <div className="label">SAP Freelance · 案件情報</div>
            <h2>学んだら、稼ごう<span className="accent-mark">。</span></h2>
          </div>
          <div className="desc">パンダ先生で学んだ知識を、そのまま収入に。<br />SAP 常駐／フリーランス案件を厳選掲載。</div>
        </div>
        <div className="case-grid">
          {allCases.slice(0, 4).map((c: any) => (
            <article key={c.id} className="case-card" onClick={() => setDetail(c)}>
              <div className="case-card-top">
                <div className="case-mods">{(c.mods || []).map((m: string) => <span key={m} className="case-mod" style={{ background: MOD_COLOR[m.toLowerCase()] || '#5a9d6e' }}>{m}</span>)}</div>
                <div className="case-flags">{c.urgent && <span className="flag urgent">急募</span>}{c.scarce && <span className="flag scarce">残り{c.seats}枠</span>}</div>
              </div>
              <h3 className="case-title">{c.title}</h3>
              <div className="case-rate-row">
                <div className={`case-rate${c.hi ? ' hi' : ''}`}><span className="unit">月</span><span className="num">{c.rate_min}〜{c.rate_max}</span><span className="unit">万円</span></div>
                {c.hi && <span className="case-hi-badge">高単価</span>}
              </div>
              <dl className="case-meta">
                <div><dt>期間</dt><dd>{c.period}</dd></div>
                <div><dt>勤務地</dt><dd>{c.location}<span> · {c.remote}</span></dd></div>
                <div><dt>経験</dt><dd>{c.experience}</dd></div>
              </dl>
              <div className="case-skills">{(c.skills_must || []).slice(0, 2).map((s: string, i: number) => <span key={i} className="case-skill">{s}</span>)}</div>
              <div className="case-card-foot"><span>募集 {c.seats} 名</span><span className="case-open">詳細を見る →</span></div>
            </article>
          ))}
        </div>
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Link href="/cases" className="btn" style={{ textDecoration: 'none' }}>すべての案件を見る →</Link>
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
              <div className={`case-rate big${detail.hi ? ' hi' : ''}`}><span className="unit">月額</span><span className="num">{detail.rate_min}〜{detail.rate_max}</span><span className="unit">万円</span>{detail.hi && <span className="case-hi-badge">高単価</span>}</div>
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
              <h4>必須スキル</h4><ul className="case-skill-list must">{(detail.skills_must || []).map((s: string, i: number) => <li key={i}>{s}</li>)}</ul>
              <h4>歓迎スキル</h4><ul className="case-skill-list want">{(detail.skills_want || []).map((s: string, i: number) => <li key={i}>{s}</li>)}</ul>
            </div>
            <div className="case-sensei-note">
              <div style={{ fontSize: 48, lineHeight: 1, marginRight: 10 }}>🐼</div>
              <div><strong>パンダ先生より</strong> この案件、あなたの経歴と相性が良さそう。まずは応募して話を聞いてみよう。<b>応募 = 即決定ではない</b>から、気軽に第一歩を踏み出してOKだよ。🎋</div>
            </div>
            <div className="case-modal-foot">
              <button className="btn" type="button" onClick={() => setDetail(null)}>一覧に戻る</button>
              <button className="btn accent" type="button" onClick={() => setDetail(null)}>この案件に応募する →</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
