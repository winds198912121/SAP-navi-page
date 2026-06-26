// ===========================================================
// LearningPathForm — 学習パス作成/編集
// ステップのコンテンツ選択 → モーダルダイアログ
// ===========================================================

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'
import { SAP_MODULES } from '../../types'

interface StepData {
  title: string; time: string
  step_id?: number; course_ids?: number[]; knowledge_ids?: number[]; article_ids?: number[]
}
interface ItemOption { id: number; title: string; module?: { slug: string; name: string } | null }

const ACCENT_COLORS = [
  { label: 'SAP Green', value: '#5a9d6e' }, { label: 'Orange', value: '#d97548' },
  { label: 'Rose', value: '#d96570' }, { label: 'Blue', value: '#3b82f6' },
  { label: 'Purple', value: '#8b5cf6' }, { label: 'Pink', value: '#ec4899' },
]

// ============================================================
export default function LearningPathForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [allCourses, setAllCourses] = useState<ItemOption[]>([])
  const [allKnowledge, setAllKnowledge] = useState<ItemOption[]>([])
  const [allArticles, setAllArticles] = useState<ItemOption[]>([])
  const [showModal, setShowModal] = useState(false)
  const [modalStepIdx, setModalStepIdx] = useState(0)
  const [form, setForm] = useState({
    title: '', audience: '', description: '', duration: '', accent: '#5a9d6e',
  })
  const [steps, setSteps] = useState<StepData[]>([
    { title: '', time: '30 min', course_ids: [], knowledge_ids: [], article_ids: [] },
  ])

  useEffect(() => {
    api.client.get('/courses', { params: { per_page: 999 } }).then(({ data }) => {
      if (data.success) setAllCourses(data.data || [])
    }).catch(() => {})
    api.client.get('/knowledge', { params: { per_page: 999 } }).then(({ data }) => {
      if (data.success) setAllKnowledge(data.data || [])
    }).catch(() => {})
    api.client.get('/articles', { params: { per_page: 999 } }).then(({ data }) => {
      if (data.success) setAllArticles(data.data || [])
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.getLearningPath(parseInt(id)).then(res => {
      if (res.success && res.data) {
        const d = res.data
        setForm({ title: d.title || '', audience: d.audience || '', description: d.description || '', duration: d.duration || '', accent: d.accent || '#5a9d6e' })
        if (d.steps && d.steps.length > 0) {
          setSteps(d.steps.map((s: any) => ({
            title: s.title || '', time: s.time || '30 min', step_id: s.id || s.step_id || 0,
            course_ids: s.course_ids || [], knowledge_ids: s.knowledge_ids || [], article_ids: s.article_ids || [],
          })))
        }
      }
    }).catch(() => setError('読み込みに失敗しました')).finally(() => setLoading(false))
  }, [id])

  const handleFormChange = (f: string, v: string) => setForm(prev => ({ ...prev, [f]: v }))
  const handleStepChange = (idx: number, f: 'title' | 'time', v: string) => setSteps(prev => prev.map((s, i) => i === idx ? { ...s, [f]: v } : s))
  const addStep = () => setSteps(prev => [...prev, { title: '', time: '30 min', course_ids: [], knowledge_ids: [], article_ids: [] }])
  const removeStep = (idx: number) => setSteps(prev => prev.filter((_, i) => i !== idx))

  const handleModalAdd = (type: 'course' | 'knowledge' | 'article', newItems: ItemOption[]) => {
    setSteps(prev => prev.map((s, i) => {
      if (i !== modalStepIdx) return s
      const key = type === 'course' ? 'course_ids' : type === 'knowledge' ? 'knowledge_ids' : 'article_ids'
      const existing = (s as any)[key] || []
      const newIds = newItems.map(item => item.id).filter((id: number) => !existing.includes(id))
      return { ...s, [key]: [...existing, ...newIds] }
    }))
  }

  const getAllSelected = (step: StepData) => {
    const items: { id: number; title: string; type: string; color: string }[] = []
    for (const id of step.course_ids || []) { const c = allCourses.find(x => x.id === id); if (c) items.push({ id: c.id, title: c.title, type: 'course', color: '#5a9d6e' }) }
    for (const id of step.knowledge_ids || []) { const c = allKnowledge.find(x => x.id === id); if (c) items.push({ id: c.id, title: c.title, type: 'knowledge', color: '#3b82f6' }) }
    for (const id of step.article_ids || []) { const c = allArticles.find(x => x.id === id); if (c) items.push({ id: c.id, title: c.title, type: 'article', color: '#8b5cf6' }) }
    return items
  }

  const removeSelected = (si: number, t: string, itemId: number) => {
    setSteps(prev => prev.map((s, i) => {
      if (i !== si) return s
      if (t === 'course') return { ...s, course_ids: (s.course_ids || []).filter(id => id !== itemId) }
      if (t === 'knowledge') return { ...s, knowledge_ids: (s.knowledge_ids || []).filter(id => id !== itemId) }
      return { ...s, article_ids: (s.article_ids || []).filter(id => id !== itemId) }
    }))
  }

  const moveSelected = (si: number, t: string, itemId: number, dir: 'up' | 'down') => {
    setSteps(prev => prev.map((s, i) => {
      if (i !== si) return s
      const key = t === 'course' ? 'course_ids' : t === 'knowledge' ? 'knowledge_ids' : 'article_ids'
      const ids = [...((s as any)[key] || [])]
      const idx = ids.indexOf(itemId)
      if (idx < 0) return s
      if (dir === 'up' && idx > 0) [ids[idx - 1], ids[idx]] = [ids[idx], ids[idx - 1]]
      else if (dir === 'down' && idx < ids.length - 1) [ids[idx], ids[idx + 1]] = [ids[idx + 1], ids[idx]]
      return { ...s, [key]: ids }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('タイトルは必須です'); return }
    const validSteps = steps.filter(s => s.title.trim())
    if (validSteps.length === 0) { setError('少なくとも1つのステップが必要です'); return }
    setSaving(true); setError('')
    try {
      const payload = { ...form, steps: validSteps.map((s, i) => ({ step_title: s.title, step_time: s.time, step_id: s.step_id || 0, course_ids: s.course_ids || [], knowledge_ids: s.knowledge_ids || [], article_ids: s.article_ids || [] })) }
      if (isEdit) {
        const res = await api.updateLearningPath(parseInt(id!), payload)
        if (res.success) navigate('/admin/learning-paths')
        else setError(res.message || '更新に失敗しました')
      } else {
        const res = await api.createLearningPath(payload)
        if (res.success) navigate('/admin/learning-paths')
        else setError(res.message || '作成に失敗しました')
      }
    } catch { setError('サーバーエラー') }
    finally { setSaving(false) }
  }

  if (loading) return (<div className="admin-page"><div className="admin-loading">読み込み中...</div></div>)

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <div className="admin-crumb">
            <Link to="/admin/learning-paths">学習パス管理</Link><span className="sep"> › </span>
            <span>{isEdit ? '編集' : '新規作成'}</span>
          </div>
          <h1>{isEdit ? '学習パスを編集' : '新規学習パス作成'}</h1>
        </div>
      </div>
      {error && <div className="admin-error">{error}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-card">
          <h3>基本情報</h3>
          <div className="admin-form-group">
            <label className="admin-label">タイトル <span className="admin-required">*</span></label>
            <input type="text" className="admin-input" value={form.title}
              onChange={e => handleFormChange('title', e.target.value)} placeholder="SAP 超入門パス" required />
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">対象者</label>
              <input type="text" className="admin-input" value={form.audience}
                onChange={e => handleFormChange('audience', e.target.value)} placeholder="SAP未経験者" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">所要時間</label>
              <input type="text" className="admin-input" value={form.duration}
                onChange={e => handleFormChange('duration', e.target.value)} placeholder="2週間" />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group" style={{ flex: 3 }}>
              <label className="admin-label">説明</label>
              <textarea className="admin-input admin-textarea" value={form.description}
                onChange={e => handleFormChange('description', e.target.value)} placeholder="Description..." rows={3} />
            </div>
            <div className="admin-form-group" style={{ flex: 1 }}>
              <label className="admin-label">アクセントカラー</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                {ACCENT_COLORS.map(c => (
                  <button key={c.value} type="button" onClick={() => handleFormChange('accent', c.value)}
                    style={{ width: 32, height: 32, borderRadius: '50%', border: form.accent === c.value ? '3px solid var(--ink-0)' : '2px solid var(--line-2)', background: c.value, cursor: 'pointer' }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="admin-form-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>学習ステップ</h3>
            <button type="button" className="admin-btn admin-btn-sm" onClick={addStep}>+ ステップ追加</button>
          </div>

          {steps.map((step, si) => {
            const selected = getAllSelected(step)
            return (
              <div key={si} style={{ background: 'var(--bg-1)', borderRadius: 'var(--r-md)', border: '1px solid var(--line-2)', padding: '16px 18px', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', background: form.accent, color: 'white', fontSize: 12, fontWeight: 700, display: 'grid', placeItems: 'center', flexShrink: 0 }}>{si + 1}</span>
                  <div style={{ flex: 1, display: 'flex', gap: 10 }}>
                    <input type="text" className="admin-input" value={step.title}
                      onChange={e => handleStepChange(si, 'title', e.target.value)}
                      placeholder={`Step ${si + 1} title`} style={{ flex: 2 }} />
                    <input type="text" className="admin-input" value={step.time}
                      onChange={e => handleStepChange(si, 'time', e.target.value)}
                      placeholder="30 min" style={{ width: 100 }} />
                  </div>
                  <button type="button" className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => removeStep(si)}
                    disabled={steps.length <= 1} style={{ padding: '4px 10px', fontSize: 12 }}>×</button>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>選択中: {selected.length}件</span>
                    <button type="button" className="admin-btn admin-btn-sm admin-btn-primary"
                      onClick={() => { setModalStepIdx(si); setShowModal(true); }}>
                      📋 コンテンツを選択
                    </button>
                  </div>

                  {selected.length === 0 ? (
                    <div style={{ fontSize: 13, color: 'var(--ink-3)', padding: '16px 0', textAlign: 'center', border: '1px dashed var(--line-2)', borderRadius: 'var(--r-md)' }}>
                      「コンテンツを選択」からコース・ナレッジ・公開記事を追加してください
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {selected.map((item, idx) => (
                        <div key={`${item.type}-${item.id}`} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'var(--bg-card)', borderRadius: 'var(--r-sm)', border: '1px solid var(--line-1)' }}>
                          <span style={{ width: 22, height: 22, borderRadius: '50%', background: form.accent, color: 'white', fontSize: 10, fontWeight: 700, display: 'grid', placeItems: 'center', flexShrink: 0 }}>{idx + 1}</span>
                          <span style={{ fontSize: 9.5, fontWeight: 700, padding: '1px 7px', borderRadius: 'var(--r-pill)', background: item.color + '22', color: item.color, flexShrink: 0 }}>
                            {item.type === 'course' ? 'コース' : item.type === 'knowledge' ? 'ナレッジ' : '記事'}
                          </span>
                          <span style={{ flex: 1, fontSize: 12.5, fontWeight: 500 }}>{item.title}</span>
                          <div style={{ display: 'flex', gap: 1 }}>
                            <button type="button" onClick={() => moveSelected(si, item.type, item.id, 'up')} disabled={idx === 0}
                              style={{ padding: '1px 4px', border: 'none', background: 'none', cursor: 'pointer', opacity: idx === 0 ? 0.2 : 0.5, fontSize: 12 }}>▲</button>
                            <button type="button" onClick={() => moveSelected(si, item.type, item.id, 'down')} disabled={idx === selected.length - 1}
                              style={{ padding: '1px 4px', border: 'none', background: 'none', cursor: 'pointer', opacity: idx === selected.length - 1 ? 0.2 : 0.5, fontSize: 12 }}>▼</button>
                          </div>
                          <button type="button" onClick={() => removeSelected(si, item.type, item.id)}
                            style={{ padding: '1px 4px', border: 'none', background: 'none', cursor: 'pointer', opacity: 0.4, fontSize: 12 }}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <button type="button" className="admin-btn" onClick={addStep}>+ Step</button>
          </div>
        </div>

        <div className="admin-form-actions">
          <Link to="/admin/learning-paths" className="admin-btn">キャンセル</Link>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? '保存中...' : (isEdit ? '更新する' : '作成する')}
          </button>
        </div>
      </form>

      {/* ===== Content Select Modal via Portal ===== */}
      {showModal && createPortal(
        <ContentPicker
          allCourses={allCourses}
          allKnowledge={allKnowledge}
          allArticles={allArticles}
          selectedCourseIds={steps[modalStepIdx]?.course_ids || []}
          selectedKnowledgeIds={steps[modalStepIdx]?.knowledge_ids || []}
          selectedArticleIds={steps[modalStepIdx]?.article_ids || []}
          onAdd={handleModalAdd}
          onClose={() => setShowModal(false)}
        />,
        document.body
      )}
    </div>
  )
}

// ============================================================
// ContentPicker — via portal to body, no CSS class dependencies
// ============================================================
function ContentPicker({
  allCourses, allKnowledge, allArticles,
  selectedCourseIds, selectedKnowledgeIds, selectedArticleIds,
  onAdd, onClose,
}: {
  allCourses: ItemOption[]; allKnowledge: ItemOption[]; allArticles: ItemOption[]
  selectedCourseIds: number[]; selectedKnowledgeIds: number[]; selectedArticleIds: number[]
  onAdd: (type: 'course' | 'knowledge' | 'article', items: ItemOption[]) => void
  onClose: () => void
}) {
  const [tab, setTab] = useState<'course' | 'knowledge' | 'article'>('course')
  const [search, setSearch] = useState('')
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [filterModules, setFilterModules] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  const toggleFilterModule = (slug: string) => {
    setFilterModules(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]); setPage(1)
  }

  const list = tab === 'course' ? allCourses : tab === 'knowledge' ? allKnowledge : allArticles
  const selectedIds = tab === 'course' ? selectedCourseIds : tab === 'knowledge' ? selectedKnowledgeIds : selectedArticleIds
  const TAB_COLORS: Record<string, string> = { course: '#5a9d6e', knowledge: '#3b82f6', article: '#8b5cf6' }
  const hue = TAB_COLORS[tab]

  const filtered = list.filter(item => {
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false
    if (filterModules.length > 0) {
      const itemModule = item.module?.slug
      if (!itemModule || !filterModules.includes(itemModule)) return false
    }
    return true
  })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const doAdd = (type: 'course' | 'knowledge' | 'article', ids: number[]) => {
    const items = list.filter(item => ids.includes(item.id))
    if (items.length) onAdd(type, items)
    setChecked({})
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        width: 'min(700px, 94vw)', maxHeight: '85vh', display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px 0', borderBottom: '1px solid #e0ddd5' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#2a2317' }}>コンテンツを選択</h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#999', padding: '0 4px' }}>✕</button>
          </div>
          <div style={{ display: 'flex', gap: 0 }}>
            {['course', 'knowledge', 'article'].map(t => {
              const active = tab === t
              return (
                <button key={t} onClick={() => { setTab(t as any); setSearch(''); setChecked({}); setPage(1) }}
                  style={{
                    flex: 1, padding: '10px 0', border: 'none', background: 'transparent',
                    cursor: 'pointer', fontSize: 13, fontWeight: active ? 700 : 500,
                    color: active ? TAB_COLORS[t] : '#999',
                    borderBottom: active ? `2.5px solid ${TAB_COLORS[t]}` : '2.5px solid transparent',
                  }}>
                  {t === 'course' ? '📚 コース' : t === 'knowledge' ? '📖 ナレッジ' : '📰 公開記事'} ({list.length})
                </button>
              )
            })}
          </div>
        </div>

        {/* Search */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #f0eee8' }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder='検索...' autoFocus
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 13, boxSizing: 'border-box' }} />
        </div>

        {/* Module filter chips */}
        <div style={{ padding: '8px 20px', borderBottom: '1px solid #f0eee8' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#999', marginBottom: 6 }}>モジュールで絞り込み</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {SAP_MODULES.map(m => {
              const active = filterModules.includes(m.slug)
              return (
                <button key={m.slug} onClick={() => toggleFilterModule(m.slug)}
                  style={{
                    fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999,
                    border: active ? 'none' : '1px solid #ddd',
                    background: active ? (m.bg_color || '#e8f5e9') : 'transparent',
                    color: active ? (m.color || '#2a2317') : '#999',
                    cursor: 'pointer',
                  }}>
                  {m.code}
                </button>
              )
            })}
            {filterModules.length > 0 && (
              <button onClick={() => setFilterModules([])}
                style={{ fontSize: 10, padding: '3px 8px', borderRadius: 999, border: 'none', background: '#f5f5f5', color: '#999', cursor: 'pointer' }}>
                解除
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 8px', minHeight: 200 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#999', fontSize: 13 }}>該当するコンテンツがありません</div>
          ) : paged.map(item => {
            const sel = selectedIds.includes(item.id)
            const chk = !!checked[String(item.id)]
            return (
              <div key={item.id} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px', borderRadius: 8, fontSize: 13, marginBottom: 2,
                background: sel ? '#fde8e8' : chk ? '#e8f5e9' : 'transparent',
                borderLeft: sel ? '3px solid #dc3545' : '3px solid transparent',
              }}>
                {!sel ? (
                  <input type="checkbox" checked={chk} onChange={() => setChecked(prev => ({ ...prev, [String(item.id)]: !prev[String(item.id)] }))}
                    style={{ accentColor: hue }} />
                ) : <span style={{ color: '#dc3545', width: 16, textAlign: 'center' }}>✓</span>}
                <span style={{
                  flex: 1, cursor: sel ? 'default' : 'pointer',
                  color: sel ? '#dc3545' : '#2a2317', fontWeight: sel ? 600 : 400,
                  textDecoration: sel ? 'none' : 'none',
                }} onClick={() => {
                  if (!sel) doAdd(tab as any, [item.id])
                }}>
                  {item.title}
                </span>
                {item.module && <span style={{ fontSize: 11, color: '#999' }}>{item.module.name}</span>}
                {sel && <span style={{ fontSize: 10, color: '#dc3545', fontWeight: 600 }}>追加済 ✓</span>}
              </div>
            )
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: '6px 20px', borderTop: '1px solid #f0eee8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
              style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #ddd', background: page <= 1 ? '#f5f5f5' : '#fff', color: page <= 1 ? '#ccc' : '#2a2317', cursor: page <= 1 ? 'default' : 'pointer', fontSize: 12 }}>
              ‹ 前へ
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                style={{
                  width: 28, height: 28, borderRadius: 6, border: p === page ? 'none' : '1px solid #ddd',
                  background: p === page ? hue : '#fff', color: p === page ? '#fff' : '#2a2317',
                  cursor: 'pointer', fontSize: 12, fontWeight: p === page ? 700 : 400,
                }}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
              style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #ddd', background: page >= totalPages ? '#f5f5f5' : '#fff', color: page >= totalPages ? '#ccc' : '#2a2317', cursor: page >= totalPages ? 'default' : 'pointer', fontSize: 12 }}>
              次へ ›
            </button>
          </div>
        )}

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #e0ddd5', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: 13 }}>キャンセル</button>
          <button onClick={() => {
            const ids = Object.entries(checked).filter(([, v]) => v).map(([k]) => parseInt(k))
            if (ids.length) doAdd(tab as any, ids)
          }} disabled={!Object.values(checked).some(v => v)}
            style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: !Object.values(checked).some(v => v) ? '#ccc' : hue, color: '#fff', cursor: !Object.values(checked).some(v => v) ? 'default' : 'pointer', fontSize: 13, fontWeight: 600 }}>
            選択を追加 ({Object.values(checked).filter(v => v).length})
          </button>
        </div>
      </div>
    </div>
  )
}
