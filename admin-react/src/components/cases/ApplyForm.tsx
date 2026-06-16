// ===========================================================
// ApplyForm — 案件投递表单 (T5.1.2.4)
// 响应式表单含技能选择/简历上传/同意条款
// ===========================================================

import { useState } from 'react'
import type { SapCase } from '../../types'
import api from '../../services/api'

const MATCH_MODULES = ['FI', 'CO', 'MM', 'SD', 'PP', 'HR', 'ABAP', 'Basis', 'S/4']
const MOD_COLOR: Record<string, string> = {
  fi: '#2f6d44', co: '#2641a1', mm: '#a25411', sd: '#b62a4a', pp: '#4828a8',
  hr: '#8a6212', abap: '#1f6f6f', basis: '#4a432d', s4: '#1864a3',
}

export default function ApplyForm({ c, onClose }: { c: SapCase | null; onClose: () => void }) {
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [skills, setSkills] = useState<string[]>(c ? c.mods.slice() : [])
  const [fileName, setFileName] = useState('')
  if (!c) return null

  function toggleSkill(m: string) {
    setSkills(prev => prev.includes(m) ? prev.filter(x => x !== m) : prev.concat(m))
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!c) return
    setSubmitting(true)
    setError('')
    const fd = new FormData(e.currentTarget)
    skills.forEach(s => fd.append('skill_modules[]', s))

    try {
      const res = await api.applyToCase(c.id, fd)
      if (res.success) setDone(true)
      else setError(res.message || '応募に失敗しました。')
    } catch {
      setError('サーバーエラーが発生しました。')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="case-modal-overlay" onClick={onClose}>
      <div className="case-modal apply" onClick={e => e.stopPropagation()}>
        <button className="case-modal-x" onClick={onClose} aria-label="閉じる">×</button>
        {!done ? (
          <>
            <div className="apply-head">
              <div className="apply-step">応募フォーム</div>
              <h3>{c.title}</h3>
              <div className="apply-target-rate">
                月{c.rate_min}〜{c.rate_max}万円 · {c.remote}
              </div>
            </div>

            {error && (
              <div style={{
                background: 'var(--rose-soft)', color: 'var(--rose)',
                padding: '10px 14px', borderRadius: 'var(--r-md)', fontSize: 13, marginBottom: 16,
              }}>{error}</div>
            )}

            <form className="apply-form" onSubmit={submit}>
              <input type="hidden" name="case_id" value={c.id} />

              <div className="apply-row">
                <label className="apply-field">
                  <span>お名前 <i>必須</i></span>
                  <input type="text" name="name" required placeholder="山田 太郎" />
                </label>
                <label className="apply-field">
                  <span>メール <i>必須</i></span>
                  <input type="email" name="email" required placeholder="you@example.com" />
                </label>
              </div>

              <div className="apply-row">
                <label className="apply-field">
                  <span>電話番号</span>
                  <input type="tel" name="phone" placeholder="090-1234-5678" />
                </label>
                <label className="apply-field">
                  <span>希望単価（月）</span>
                  <input type="text" name="expected_rate" defaultValue={`${c.rate_min}〜${c.rate_max}万円`} />
                </label>
              </div>

              <div className="apply-row">
                <label className="apply-field">
                  <span>稼働開始</span>
                  <select name="start_timing" defaultValue="1m">
                    <option value="now">すぐに</option>
                    <option value="2w">2週間以内</option>
                    <option value="1m">1ヶ月以内</option>
                    <option value="2m">2ヶ月以降</option>
                    <option value="ask">相談したい</option>
                  </select>
                </label>
                <label className="apply-field">
                  <span>経験年数</span>
                  <select name="experience_years" defaultValue="3">
                    <option value="1">1〜2年</option>
                    <option value="3">3〜5年</option>
                    <option value="6">6〜9年</option>
                    <option value="10">10年以上</option>
                  </select>
                </label>
              </div>

              <div className="apply-field">
                <span>得意なモジュール</span>
                <div className="apply-skill-chips">
                  {MATCH_MODULES.map(m => (
                    <button type="button" key={m}
                      className={`apply-chip${skills.includes(m) ? ' on' : ''}`}
                      onClick={() => toggleSkill(m)}>{m}</button>
                  ))}
                </div>
              </div>

              <label className="apply-field">
                <span>自己PR・希望条件</span>
                <textarea name="self_pr" rows={3}
                  placeholder="これまでのご経験、得意領域、稼働・働き方の希望などを自由にご記入ください。" />
              </label>

              <div className="apply-field">
                <span>履歴書・職務経歴書を添付 <i className="opt">任意</i></span>
                <label className="apply-file">
                  <input type="file" name="resume" accept=".pdf,.doc,.docx,.xls,.xlsx"
                    onChange={e => setFileName(e.target.files?.[0]?.name || '')} />
                  <span className="apply-file-text">
                    {fileName || 'PDF / Word をドラッグ＆ドロップ、またはクリック'}
                  </span>
                </label>
              </div>

              <label className="apply-agree">
                <input type="checkbox" required />
                <span><a href="#">利用規約・個人情報の取り扱い</a>に同意します</span>
              </label>

              <button className="btn accent apply-submit" type="submit" disabled={submitting}>
                {submitting ? '送信中...' : 'この内容で応募する'}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>
          </>
        ) : (
          <div className="apply-done">
            <div className="apply-done-svg">
              <svg width="80" height="80" viewBox="0 0 100 100">
                <circle cx="50" cy="52" r="46" fill="#d8ead9" />
                <path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" />
                <g>
                  <path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" />
                  <path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" />
                </g>
                <circle cx="30" cy="44" r="4" fill="#fff" /><circle cx="30" cy="44" r="2.8" fill="#0e0a05" />
                <circle cx="70" cy="44" r="4" fill="#fff" /><circle cx="70" cy="44" r="2.8" fill="#0e0a05" />
                <ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" />
                <path d="M 40 67 Q 50 82 60 67 Q 50 70 40 67 Z" fill="#1a1612" />
              </svg>
            </div>
            <h3>応募ありがとう！🎋</h3>
            <p>
              <b>{c.title}</b> への応募を受け付けました。<br />
              担当から<b>1営業日以内</b>にご連絡します。
            </p>
            <button className="btn primary" type="button" onClick={onClose}>案件一覧に戻る</button>
          </div>
        )}
      </div>
    </div>
  )
}
