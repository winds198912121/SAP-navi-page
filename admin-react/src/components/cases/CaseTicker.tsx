// ===========================================================
// CaseTicker — 案件跑马灯 (T5.1.2.1)
// 横滚动显示最新案件, 悬停暂停, クリックで詳細表示
// ===========================================================

import type { SapCase } from '../../types'

const FALLBACK_TICKER: SapCase[] = [
  { id: 0, mods: ['fi', 'co'], title: 'グローバル製造業 / S4移行に伴う FI-CO コンサル', rate_min: 85, rate_max: 110, rate_label: '月85〜110万', hi: true, urgent: true, period: '6ヶ月〜', utilization: '週5', location: '東京', remote: '一部リモート', experience: '5年以上', seats: 2, scarce: false, skills_must: ['FI', 'CO', 'S/4HANA'], skills_want: ['PM経験'], blurb: '大手製造業のS/4HANA移行プロジェクト', company: '', created_at: '' },
  { id: 1, mods: ['abap'], title: 'アドオン開発リード / CDS・RAP 中心のモダン ABAP', rate_min: 75, rate_max: 95, rate_label: '月75〜95万', hi: true, urgent: true, period: '長期', utilization: '週5', location: '東京', remote: 'フルリモート', experience: '3年以上', seats: 1, scarce: false, skills_must: ['ABAP', 'CDS'], skills_want: ['RAP'], blurb: '', company: '', created_at: '' },
  { id: 2, mods: ['mm', 'sd'], title: '物流・小売 / MM-SD 保守運用 & 機能改善', rate_min: 65, rate_max: 80, rate_label: '月65〜80万', hi: false, urgent: false, period: '6ヶ月〜', utilization: '週5', location: '大阪', remote: '一部リモート', experience: '3年以上', seats: 1, scarce: false, skills_must: ['MM', 'SD'], skills_want: [], blurb: '', company: '', created_at: '' },
  { id: 3, mods: ['s4', 'fi'], title: '大手商社 / S/4HANA 導入 PMO・推進支援', rate_min: 90, rate_max: 110, rate_label: '月90〜110万', hi: true, urgent: false, period: '1年〜', utilization: '週5', location: '東京', remote: '一部リモート', experience: '7年以上', seats: 1, scarce: false, skills_must: ['FI', 'S/4HANA'], skills_want: ['PMO'], blurb: '', company: '', created_at: '' },
  { id: 4, mods: ['co'], title: '管理会計 / 原価計算まわりの設計支援', rate_min: 70, rate_max: 85, rate_label: '月70〜85万', hi: false, urgent: true, period: '3ヶ月〜', utilization: '週5', location: '名古屋', remote: '一部リモート', experience: '3年以上', seats: 2, scarce: false, skills_must: ['CO', '原価計算'], skills_want: [], blurb: '', company: '', created_at: '' },
  { id: 5, mods: ['basis'], title: 'SAP Basis 運用 / 権限・パッチ・監視', rate_min: 60, rate_max: 75, rate_label: '月60〜75万', hi: false, urgent: false, period: '長期', utilization: '週5', location: '東京', remote: 'リモート可', experience: '3年以上', seats: 1, scarce: false, skills_must: ['Basis'], skills_want: ['CLOUD'], blurb: '', company: '', created_at: '' },
  { id: 6, mods: ['pp', 'mm'], title: '製造業 / PP-MM 生産・購買プロセス改善', rate_min: 72, rate_max: 88, rate_label: '月72〜88万', hi: false, urgent: true, period: '6ヶ月〜', utilization: '週5', location: '福岡', remote: '一部リモート', experience: '3年以上', seats: 1, scarce: false, skills_must: ['PP', 'MM'], skills_want: [], blurb: '', company: '', created_at: '' },
  { id: 7, mods: ['sd'], title: 'BtoB販売 / SD 受注〜請求の機能拡張', rate_min: 68, rate_max: 82, rate_label: '月68〜82万', hi: false, urgent: false, period: '3ヶ月〜', utilization: '週5', location: '東京', remote: 'リモート可', experience: '3年以上', seats: 1, scarce: false, skills_must: ['SD'], skills_want: ['EDI'], blurb: '', company: '', created_at: '' },
]

const MOD_COLOR: Record<string, string> = {
  fi: '#2f6d44', co: '#2641a1', mm: '#a25411', sd: '#b62a4a', pp: '#4828a8',
  hr: '#8a6212', abap: '#1f6f6f', basis: '#4a432d', s4: '#1864a3',
}

export default function CaseTicker({ cases, onOpen }: {
  cases?: SapCase[]
  onOpen?: (c: SapCase) => void
}) {
  const tickerCases = cases && cases.length > 0 ? cases.slice(0, 8) : FALLBACK_TICKER
  const items = [...tickerCases, ...tickerCases]
  const maxRate = cases && cases.length > 0
    ? Math.max(...cases.map(c => c.rate_max), 0)
    : Math.max(...FALLBACK_TICKER.map(c => c.rate_max), 0)

  return (
    <div className="case-ticker" id="cases-top">
      <div className="ticker-head">
        <div className="ticker-flag">
          <span className="pulse" />
          SAP案件 募集中
        </div>
        <div className="ticker-count">
          <b>{cases?.length || FALLBACK_TICKER.length}</b>件の案件 — <span className="hi">最高 月{maxRate}万円</span>
        </div>
      </div>
      <div className="ticker-viewport">
        <div className="ticker-track">
          {items.map((c, i) => (
            <a key={i} className="ticker-pill" style={{ cursor: onOpen ? 'pointer' : 'default' }}
              onClick={(e) => { if (onOpen) { e.preventDefault(); onOpen(c) } }}>
              {c.urgent && <span className="tp-urgent">急募</span>}
              <span className="tp-mod" style={{ background: MOD_COLOR[c.mods[0]] || '#5a9d6e' }}>{c.mods[0]}</span>
              <span className="tp-title">{c.title}</span>
              <span className={`tp-rate${c.hi ? ' hi' : ''}`}>月{c.rate_min}万〜</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
