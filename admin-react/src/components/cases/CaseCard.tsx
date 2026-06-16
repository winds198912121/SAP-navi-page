// ===========================================================
// CaseCard — 案件卡片 (T5.1.2.2)
// 2 列卡片, 模块标签/薪资/期間/勤務地/技能
// ===========================================================

import type { SapCase } from '../../types'

const MOD_COLOR: Record<string, string> = {
  fi: '#2f6d44', co: '#2641a1', mm: '#a25411', sd: '#b62a4a', pp: '#4828a8',
  hr: '#8a6212', abap: '#1f6f6f', basis: '#4a432d', s4: '#1864a3',
}

export default function CaseCard({ c, matched, onOpen }: {
  c: SapCase
  matched: boolean
  onOpen: (c: SapCase) => void
}) {
  return (
    <article className={`case-card${matched ? ' matched' : ''}`} onClick={() => onOpen(c)}>
      {matched && <div className="case-match-ribbon">スキル一致</div>}
      <div className="case-card-top">
        <div className="case-mods">
          {c.mods.map(m => (
            <span key={m} className="case-mod" style={{ background: MOD_COLOR[m] }}>{m}</span>
          ))}
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
        <div><dt>勤務地</dt><dd>{c.location}<span className="case-remote"> · {c.remote}</span></dd></div>
        <div><dt>経験</dt><dd>{c.experience}</dd></div>
      </dl>
      <div className="case-skills">
        {c.skills_must.slice(0, 2).map((s, i) => (
          <span key={i} className="case-skill">{s}</span>
        ))}
      </div>
      <div className="case-card-foot">
        <span className="case-seats">募集 {c.seats} 名</span>
        <span className="case-open">詳細を見る →</span>
      </div>
    </article>
  )
}

export { MOD_COLOR }
