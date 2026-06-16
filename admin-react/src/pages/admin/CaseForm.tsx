// ===========================================================
// CaseForm — 案件作成/編集 /admin/cases/new, /admin/cases/:id/edit
// ===========================================================

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'

const MODULES = ['FI', 'CO', 'MM', 'SD', 'PP', 'HR', 'ABAP', 'Basis', 'S/4']
const MOD_COLOR: Record<string, string> = {
  fi: '#2f6d44', co: '#2641a1', mm: '#a25411', sd: '#b62a4a', pp: '#4828a8',
  hr: '#8a6212', abap: '#1f6f6f', basis: '#4a432d', s4: '#1864a3', 's/4': '#1864a3',
}

export default function CaseForm() {
  const { id } = useParams(); const navigate = useNavigate(); const isEdit = !!id
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false); const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', blurb: '', rate_min: '', rate_max: '', period: '',
    location: '', remote: '', utilization: '週5', experience: '', company: '',
    seats: 1, urgent: false, scarce: false,
    mods: [] as string[], skills_must: [] as string[], skills_want: [] as string[],
  })
  const [skillMustInput, setSkillMustInput] = useState('')
  const [skillWantInput, setSkillWantInput] = useState('')

  useEffect(() => {
    if (!id) return; setLoading(true)
    api.client.get(`/cases/${id}`).then(({ data }) => {
      if (data.success && data.data) {
        const c = data.data
        setForm({
          title: c.title || '', blurb: c.blurb || '',
          rate_min: c.rate_min?.toString() || '', rate_max: c.rate_max?.toString() || '',
          period: c.period || '', location: c.location || '', remote: c.remote || '',
          utilization: c.utilization || '週5', experience: c.experience || '',
          company: c.company || '', seats: c.seats || 1,
          urgent: !!c.urgent, scarce: !!c.scarce,
          mods: c.mods || [], skills_must: c.skills_must || [], skills_want: c.skills_want || [],
        })
      }
    }).catch(() => setError('取得失敗')).finally(() => setLoading(false))
  }, [id])

  const handleChange = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }))

  const toggleMod = (m: string) => {
    setForm(prev => ({
      ...prev,
      mods: prev.mods.includes(m) ? prev.mods.filter(x => x !== m) : [...prev.mods, m],
    }))
  }

  const addSkill = (field: 'skills_must' | 'skills_want') => {
    const input = field === 'skills_must' ? skillMustInput : skillWantInput
    if (!input.trim()) return
    setForm(prev => ({ ...prev, [field]: [...prev[field], input.trim()] }))
    if (field === 'skills_must') setSkillMustInput(''); else setSkillWantInput('')
  }

  const removeSkill = (field: 'skills_must' | 'skills_want', idx: number) => {
    setForm(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== idx) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('タイトルは必須です。'); return }
    setSaving(true); setError('')
    try {
      if (isEdit) {
        const { data } = await api.client.put(`/cases/${id}`, form)
        if (data.success) navigate('/admin/cases'); else setError(data.message || '更新失敗')
      } else {
        const { data } = await api.client.post('/cases', form)
        if (data.success) navigate('/admin/cases'); else setError(data.message || '作成失敗')
      }
    } catch { setError('サーバーエラー') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="admin-page"><div className="admin-loading">読み込み中...</div></div>

  const inputS = { width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--line-2)', fontFamily: 'inherit', fontSize: 13, outline: 'none' } as React.CSSProperties

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <div className="admin-crumb"><Link to="/admin/cases">案件管理</Link><span className="sep"> › </span><span>{isEdit ? '編集' : '新規作成'}</span></div>
          <h1>{isEdit ? '案件を編集' : '新規案件作成'}</h1>
        </div>
      </div>
      {error && <div className="admin-error">{error}</div>}
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-card">
          <div className="admin-form-group">
            <label className="admin-label">タイトル <span className="admin-required">*</span></label>
            <input type="text" style={inputS} value={form.title} onChange={e => handleChange('title', e.target.value)} placeholder="案件タイトル" required />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">概要（PR文）</label>
            <textarea style={{ ...inputS, minHeight: 70, resize: 'vertical' }} value={form.blurb} onChange={e => handleChange('blurb', e.target.value)} placeholder="案件の簡単な説明" />
          </div>
        </div>

        <div className="admin-form-card">
          <h3>案件詳細</h3>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">モジュール</label>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {MODULES.map(m => (
                  <button key={m} type="button" onClick={() => toggleMod(m)}
                    style={{
                      padding: '4px 10px', borderRadius: 999, border: '1.5px solid', cursor: 'pointer',
                      fontSize: 11.5, fontWeight: 600, fontFamily: 'inherit',
                      background: form.mods.includes(m) ? (MOD_COLOR[m.toLowerCase()] || '#5a9d6e') : 'var(--bg-card)',
                      color: form.mods.includes(m) ? '#fff' : 'var(--ink-1)',
                      borderColor: form.mods.includes(m) ? 'transparent' : 'var(--line-2)',
                    }}>{m}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">最低単価（万円）</label>
              <input type="number" style={inputS} value={form.rate_min} onChange={e => handleChange('rate_min', e.target.value)} min={0} />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">最高単価（万円）</label>
              <input type="number" style={inputS} value={form.rate_max} onChange={e => handleChange('rate_max', e.target.value)} min={0} />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">募集人数</label>
              <input type="number" style={inputS} value={form.seats} onChange={e => handleChange('seats', parseInt(e.target.value) || 1)} min={1} />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">勤務地</label>
              <input type="text" style={inputS} value={form.location} onChange={e => handleChange('location', e.target.value)} placeholder="東京" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">リモート</label>
              <input type="text" style={inputS} value={form.remote} onChange={e => handleChange('remote', e.target.value)} placeholder="一部リモート" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">稼働形態</label>
              <input type="text" style={inputS} value={form.utilization} onChange={e => handleChange('utilization', e.target.value)} placeholder="週5" />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">期間</label>
              <input type="text" style={inputS} value={form.period} onChange={e => handleChange('period', e.target.value)} placeholder="6ヶ月〜" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">経験年数</label>
              <input type="text" style={inputS} value={form.experience} onChange={e => handleChange('experience', e.target.value)} placeholder="3年以上" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">会社名</label>
              <input type="text" style={inputS} value={form.company} onChange={e => handleChange('company', e.target.value)} placeholder="株式会社〜" />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--ink-1)' }}>
                <input type="checkbox" checked={form.urgent} onChange={e => handleChange('urgent', e.target.checked)} /> 急募
              </label>
            </div>
            <div className="admin-form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--ink-1)' }}>
                <input type="checkbox" checked={form.scarce} onChange={e => handleChange('scarce', e.target.checked)} /> 残り僅か
              </label>
            </div>
          </div>
        </div>

        <div className="admin-form-card">
          <h3>スキル</h3>
          <div className="admin-form-group">
            <label className="admin-label">必須スキル</label>
            <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
              {form.skills_must.map((s, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 10px', borderRadius: 999, background: 'var(--accent-soft)', color: 'var(--accent-deep)', fontSize: 12, fontWeight: 600 }}>
                  {s}
                  <span onClick={() => removeSkill('skills_must', i)} style={{ cursor: 'pointer', fontSize: 14, lineHeight: 1 }}>×</span>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input type="text" style={inputS} value={skillMustInput} onChange={e => setSkillMustInput(e.target.value)}
                placeholder="スキル名を入力" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill('skills_must'))} />
              <button type="button" className="admin-btn admin-btn-sm" onClick={() => addSkill('skills_must')}>追加</button>
            </div>
          </div>
          <div className="admin-form-group">
            <label className="admin-label">歓迎スキル</label>
            <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
              {form.skills_want.map((s, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 10px', borderRadius: 999, background: 'var(--bg-tint)', color: 'var(--ink-1)', fontSize: 12, fontWeight: 600 }}>
                  {s}
                  <span onClick={() => removeSkill('skills_want', i)} style={{ cursor: 'pointer', fontSize: 14, lineHeight: 1 }}>×</span>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input type="text" style={inputS} value={skillWantInput} onChange={e => setSkillWantInput(e.target.value)}
                placeholder="スキル名を入力" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill('skills_want'))} />
              <button type="button" className="admin-btn admin-btn-sm" onClick={() => addSkill('skills_want')}>追加</button>
            </div>
          </div>
        </div>

        <div className="admin-form-actions">
          <Link to="/admin/cases" className="admin-btn">キャンセル</Link>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? '保存中...' : (isEdit ? '更新する' : '作成する')}
          </button>
        </div>
      </form>
    </div>
  )
}
