// ===========================================================
// SkillMatchBar — 技能匹配筛选 (T5.2.1.1)
// 9 个模块按钮, 多选, 匹配数实时更新
// ===========================================================

const MATCH_MODULES = ['FI', 'CO', 'MM', 'SD', 'PP', 'HR', 'ABAP', 'Basis', 'S/4']
const MOD_COLOR: Record<string, string> = {
  fi: '#2f6d44', co: '#2641a1', mm: '#a25411', sd: '#b62a4a', pp: '#4828a8',
  hr: '#8a6212', abap: '#1f6f6f', basis: '#4a432d', s4: '#1864a3', 's/4': '#1864a3',
}

export default function SkillMatchBar({ picked, onToggle, matchCount }: {
  picked: string[]
  onToggle: (m: string) => void
  matchCount: number
}) {
  return (
    <div className="match-bar">
      <div className="match-left">
        <div className="match-q" style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-0)', marginBottom: 8 }}>
          あなたの得意モジュールは？
        </div>
        <div className="match-chips">
          {MATCH_MODULES.map(m => (
            <button key={m} type="button"
              className={`match-chip${picked.includes(m) ? ' on' : ''}`}
              style={picked.includes(m) ? { background: MOD_COLOR[m.toLowerCase()], borderColor: MOD_COLOR[m.toLowerCase()], color: '#fff' } : {}}
              onClick={() => onToggle(m)}>{m}</button>
          ))}
        </div>
      </div>
      <div className="match-result" style={{ textAlign: 'right' }}>
        <div className="match-count">
          <div className="mc-label" style={{ fontSize: 11, color: 'var(--ink-3)' }}>あなたに合う案件</div>
          <span className="mc-num" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: 'var(--accent)' }}>
            {matchCount}<small style={{ fontSize: 14 }}>件</small>
          </span>
        </div>
      </div>
    </div>
  )
}

export { MATCH_MODULES, MOD_COLOR }
