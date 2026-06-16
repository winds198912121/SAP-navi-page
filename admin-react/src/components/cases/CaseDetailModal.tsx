// ===========================================================
// CaseDetailModal — 案件详情模态框 (T5.1.2.3)
// 模态框展示所有字段, 熊猫先生推荐语
// ===========================================================

import type { SapCase } from '../../types'
import { MOD_COLOR } from './CaseCard'

export default function CaseDetailModal({ c, onClose, onApply }: {
  c: SapCase | null
  onClose: () => void
  onApply: (c: SapCase) => void
}) {
  if (!c) return null
  return (
    <div className="case-modal-overlay" onClick={onClose}>
      <div className="case-modal detail" onClick={e => e.stopPropagation()}>
        <button className="case-modal-x" onClick={onClose} aria-label="閉じる">×</button>
        <div className="case-detail-head">
          <div className="case-mods">
            {c.mods.map(m => (
              <span key={m} className="case-mod" style={{ background: MOD_COLOR[m] }}>{m}</span>
            ))}
            {c.urgent && <span className="flag urgent">急募</span>}
            {c.scarce && <span className="flag scarce">残り{c.seats}枠</span>}
          </div>
          <h3>{c.title}</h3>
          <div className={`case-rate big${c.hi ? ' hi' : ''}`}>
            <span className="unit">月額</span>
            <span className="num">{c.rate_min}〜{c.rate_max}</span>
            <span className="unit">万円</span>
            {c.hi && <span className="case-hi-badge">高単価</span>}
          </div>
        </div>

        <p className="case-blurb">{c.blurb}</p>

        <div className="case-detail-grid">
          <div className="case-spec"><span className="k">契約期間</span><span className="v">{c.period}</span></div>
          <div className="case-spec"><span className="k">稼働形態</span><span className="v">{c.utilization}</span></div>
          <div className="case-spec"><span className="k">勤務地</span><span className="v">{c.location}（{c.remote}）</span></div>
          <div className="case-spec"><span className="k">必要経験</span><span className="v">{c.experience}</span></div>
          <div className="case-spec"><span className="k">募集人数</span><span className="v">{c.seats} 名</span></div>
        </div>

        <div className="case-skill-block">
          <h4>必須スキル</h4>
          <ul className="case-skill-list must">
            {c.skills_must.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
          <h4>歓迎スキル</h4>
          <ul className="case-skill-list want">
            {c.skills_want.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>

        <div className="case-sensei-note">
          <div className="case-sensei-svg">
            <svg width="48" height="48" viewBox="0 0 100 100">
              <circle cx="50" cy="52" r="46" fill="#d8ead9" />
              <circle cx="50" cy="52" r="42" fill="#fff" />
              <path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" />
              <g>
                <path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" />
                <path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" />
              </g>
              <circle cx="30" cy="44" r="3.4" fill="#fff" /><circle cx="30" cy="44" r="2.4" fill="#0e0a05" />
              <circle cx="70" cy="44" r="3.4" fill="#fff" /><circle cx="70" cy="44" r="2.4" fill="#0e0a05" />
              <ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" />
              <path d="M 42 68 Q 50 78 58 68" fill="#1a1612" />
            </svg>
          </div>
          <div>
            <strong>パンダ先生より</strong>
            この案件、あなたの経歴と相性が良さそう。まずは応募して話を聞いてみよう。
            <b>応募 = 即決定ではない</b>から、気軽に第一歩を踏み出してOKだよ。🎋
          </div>
        </div>

        <div className="case-modal-foot">
          <button className="btn" type="button" onClick={onClose}>一覧に戻る</button>
          <button className="btn accent" type="button" onClick={() => onApply(c)}>
            この案件に応募する
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
