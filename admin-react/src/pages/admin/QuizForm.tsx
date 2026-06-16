// ===========================================================
// QuizForm — クイズ作成/編集 /admin/quizzes/new, /admin/quizzes/:id/edit
// ===========================================================

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'
import { SAP_MODULES } from '../../types'

interface Option { text: string; correct: boolean }

const DIFFICULTIES = [
  { slug: 'beginner', name: '初級' },
  { slug: 'intermediate', name: '中級' },
  { slug: 'advanced', name: '上級' },
]

export default function QuizForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')
  const [options, setOptions] = useState<Option[]>([
    { text: '', correct: false },
    { text: '', correct: false },
    { text: '', correct: false },
    { text: '', correct: false },
  ])
  const [explanation, setExplanation] = useState('')
  const [date, setDate] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [module, setModule] = useState('')
  const [status, setStatus] = useState('publish')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.client.get(`/quizzes/${id}`).then(({ data }) => {
      if (data.success && data.data) {
        const q = data.data
        setTitle(q.title || '')
        setOptions(q.options || [{ text: '', correct: false }, { text: '', correct: false }, { text: '', correct: false }, { text: '', correct: false }])
        setExplanation(q.explanation || '')
        setDate(q.date || '')
        setDifficulty(q.difficulty || '')
        setModule(q.module?.slug || '')
      }
    }).catch(() => setError('取得に失敗')).finally(() => setLoading(false))
  }, [id])

  const handleOptionText = (i: number, text: string) => {
    setOptions(prev => prev.map((o, j) => j === i ? { ...o, text } : o))
  }

  const handleCorrect = (i: number) => {
    setOptions(prev => prev.map((o, j) => ({ ...o, correct: j === i })))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) { setError('問題文は必須です。'); return }
    if (options.some(o => !o.text.trim())) { setError('すべての選択肢を入力してください。'); return }
    if (!options.some(o => o.correct)) { setError('正解を選択してください。'); return }
    setSaving(true); setError('')
    const payload = { title, options, explanation, date, difficulty, module, status }
    try {
      if (isEdit) {
        const { data } = await api.client.put(`/quizzes/${id}`, payload)
        if (data.success) navigate('/admin/quizzes'); else setError(data.message || '更新失敗')
      } else {
        const { data } = await api.client.post('/quizzes', payload)
        if (data.success) navigate('/admin/quizzes'); else setError(data.message || '作成失敗')
      }
    } catch { setError('サーバーエラー') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="admin-page"><div className="admin-loading">読み込み中...</div></div>

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <div className="admin-crumb">
            <Link to="/admin/quizzes">クイズ管理</Link>
            <span className="sep"> › </span><span>{isEdit ? '編集' : '新規作成'}</span>
          </div>
          <h1>{isEdit ? 'クイズを編集' : '新規クイズ作成'}</h1>
        </div>
      </div>
      {error && <div className="admin-error">{error}</div>}
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-card">
          <div className="admin-form-group">
            <label className="admin-label">問題文 <span className="admin-required">*</span></label>
            <textarea className="admin-input admin-textarea" value={title} onChange={e => setTitle(e.target.value)} rows={3} placeholder="クイズの問題文" required />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">選択肢 <span className="admin-required">*</span></label>
            {options.map((o, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-2)', width: 20 }}>{String.fromCharCode(65 + i)}</span>
                <input type="text" className="admin-input" value={o.text} onChange={e => handleOptionText(i, e.target.value)}
                  placeholder={`選択肢 ${String.fromCharCode(65 + i)}`} style={{ flex: 1 }} />
                <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <input type="radio" name="correct" checked={o.correct} onChange={() => handleCorrect(i)} />
                  正解
                </label>
              </div>
            ))}
          </div>

          <div className="admin-form-group">
            <label className="admin-label">解説</label>
            <textarea className="admin-input admin-textarea" value={explanation} onChange={e => setExplanation(e.target.value)} rows={3} placeholder="正解の解説" />
          </div>
        </div>

        <div className="admin-form-card">
          <h3>設定</h3>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">モジュール</label>
              <select className="admin-input" value={module} onChange={e => setModule(e.target.value)}>
                <option value="">選択なし</option>
                {SAP_MODULES.map(m => <option key={m.slug} value={m.slug}>{m.code} · {m.name_ja}</option>)}
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">難易度</label>
              <select className="admin-input" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                <option value="">選択なし</option>
                {DIFFICULTIES.map(d => <option key={d.slug} value={d.slug}>{d.name}</option>)}
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">実施日</label>
              <input type="date" className="admin-input" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">ステータス</label>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" onClick={() => setStatus("publish")}
                  style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: "1.5px solid", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600,
                    background: status === "publish" ? "var(--accent)" : "var(--bg-card)",
                    color: status === "publish" ? "white" : "var(--ink-1)",
                    borderColor: status === "publish" ? "var(--accent)" : "var(--line-2)" }}>
                  公開
                </button>
                <button type="button" onClick={() => setStatus("draft")}
                  style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: "1.5px solid", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600,
                    background: status === "draft" ? "var(--ink-3)" : "var(--bg-card)",
                    color: status === "draft" ? "white" : "var(--ink-1)",
                    borderColor: status === "draft" ? "var(--ink-3)" : "var(--line-2)" }}>
                  下書き
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-form-actions">
          <Link to="/admin/quizzes" className="admin-btn">キャンセル</Link>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? '保存中...' : (isEdit ? '更新する' : '作成する')}
          </button>
        </div>
      </form>
    </div>
  )
}
