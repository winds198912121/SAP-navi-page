// ===========================================================
// CasesSection — 案件セクションのメインコンテナ
// 技能マッチ + セレクトボックスフィルター + 案件カード + ページネーション
// ===========================================================

import { useState, useMemo, useEffect, useCallback } from 'react'
import type { SapCase } from '../../types'
import api from '../../services/api'
import SkillMatchBar from './SkillMatchBar'
import CaseCard from './CaseCard'
import CaseDetailModal from './CaseDetailModal'
import ApplyForm from './ApplyForm'

interface Props {
  allCases?: SapCase[]
  loading?: boolean
  onOpen?: (c: SapCase) => void
}

const RATE_RANGES = [
  { value: '〜60', label: '60万未満', min: 0, max: 59 },
  { value: '60-80', label: '60〜80万', min: 60, max: 80 },
  { value: '80-100', label: '80〜100万', min: 81, max: 100 },
  { value: '100〜', label: '100万以上', min: 100, max: 999 },
]

function normalizeLocation(loc: string): string {
  const l = loc.trim()
  if (l.includes('東京') || l === 'Tokyo') return '東京'
  if (l.includes('大阪')) return '大阪'
  if (l.includes('名古屋')) return '名古屋'
  if (l.includes('福岡')) return '福岡'
  if (l.includes('横浜')) return '横浜'
  return l
}

function parseExperienceNum(exp: string): number {
  const m = exp.match(/(\d+)/)
  return m ? parseInt(m[1]) : 0
}

function matchPeriod(period: string, filter: string): boolean {
  if (!period) return false
  const p = period.trim()
  if (filter === '〜3ヶ月') return p.includes('3ヶ月') && (p.includes('未満') || p.includes('以内'))
  if (filter === '3-6ヶ月') return (p.includes('3ヶ月') || p.includes('半年')) && !p.includes('未満') && !p.includes('1年')
  if (filter === '6-12ヶ月') return (p.includes('6ヶ月') || p.includes('半年') || p.includes('1年')) && !p.includes('未満') || p.includes('1年') && p.includes('未満')
  if (filter === '1年〜') return p.includes('1年〜') || p.includes('1年以上')
  if (filter === '長期') return p === '長期' || p.includes('長期')
  return false
}

interface Filters {
  location: string
  rate: string
  period: string
  exp: string
}

export default function CasesSection({ allCases: externalCases, loading: externalLoading, onOpen: externalOnOpen }: Props) {
  const [internalCases, setInternalCases] = useState<SapCase[]>([])
  const [internalLoading, setInternalLoading] = useState(true)
  const [picked, setPicked] = useState<string[]>([])
  const [filters, setFilters] = useState<Filters>({ location: '', rate: '', period: '', exp: '' })
  const [page, setPage] = useState(1)
  const [detail, setDetail] = useState<SapCase | null>(null)
  const [applyFor, setApplyFor] = useState<SapCase | null>(null)
  const perPage = 20

  const usesExternal = !!externalCases
  const allCases = usesExternal ? externalCases : internalCases
  const loading = usesExternal ? (externalLoading ?? false) : internalLoading

  useEffect(() => {
    if (usesExternal) return
    api.getCases({ per_page: 200 }).then(res => {
      if (res.success) setInternalCases(res.data)
    }).finally(() => setInternalLoading(false))
  }, [])

  useEffect(() => {
    document.body.style.overflow = (detail || applyFor) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [detail, applyFor])

  const locationOptions = useMemo(() => {
    const set = new Set<string>()
    allCases.forEach(c => { if (c.location) set.add(normalizeLocation(c.location)) })
    return Array.from(set).sort()
  }, [allCases])

  const isMatched = (c: SapCase) => picked.length > 0 && c.mods.some(m => picked.map(p => p.toLowerCase()).includes(m.toLowerCase()))

  const setFilter = useCallback((cat: keyof Filters, val: string) => {
    setFilters(prev => ({ ...prev, [cat]: val }))
    setPage(1)
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({ location: '', rate: '', period: '', exp: '' })
    setPicked([])
    setPage(1)
  }, [])

  const hasActiveFilters = !!filters.location || !!filters.rate || !!filters.period || !!filters.exp || picked.length > 0

  const filtered = useMemo(() => {
    let result = allCases
    if (filters.location) {
      result = result.filter(c => normalizeLocation(c.location) === filters.location)
    }
    if (filters.rate) {
      const range = RATE_RANGES.find(r => r.value === filters.rate)
      if (range) result = result.filter(c => c.rate_max >= range.min && c.rate_min <= range.max)
    }
    if (filters.period) {
      result = result.filter(c => matchPeriod(c.period, filters.period))
    }
    if (filters.exp) {
      result = result.filter(c => {
        const years = parseExperienceNum(c.experience)
        if (filters.exp === '〜3年') return years <= 3
        if (filters.exp === '3〜5年') return years >= 3 && years <= 5
        if (filters.exp === '5〜7年') return years >= 5 && years <= 7
        if (filters.exp === '7年以上') return years >= 7
        return false
      })
    }
    return [...result].sort((a, b) => (isMatched(b) ? 1 : 0) - (isMatched(a) ? 1 : 0))
  }, [allCases, filters, picked])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)
  const matchCount = picked.length === 0 ? filtered.length : filtered.filter(isMatched).length

  const handleOpen = (c: SapCase) => {
    if (externalOnOpen) { externalOnOpen(c); return }
    setDetail(c)
  }

  if (loading) {
    return <section className="section" id="cases" style={{ textAlign: 'center', color: 'var(--ink-3)' }}>読み込み中...</section>
  }

  const selectStyle: React.CSSProperties = {
    width: '100%', padding: '8px 12px', borderRadius: 'var(--r-md)',
    border: '1.5px solid var(--line-2)', background: 'var(--bg-card)',
    fontFamily: 'inherit', fontSize: 13, color: 'var(--ink-1)',
    outline: 'none', cursor: 'pointer',
  }

  return (
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

      <SkillMatchBar picked={picked} onToggle={(m) => {
        setPicked(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])
        setPage(1)
      }} matchCount={matchCount} />

      {/* Filter Dropdowns */}
      <div style={{
        marginTop: 16, padding: '16px 18px',
        background: 'var(--bg-card)', borderRadius: 'var(--r-lg)',
        border: '1px solid var(--line-1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-2)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            🔍 絞り込み検索
          </span>
          {hasActiveFilters && (
            <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: 'var(--accent-deep)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, textDecoration: 'underline', padding: 0 }}>
              クリア
            </button>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 10 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', marginBottom: 4 }}>勤務地</div>
            <select style={selectStyle} value={filters.location} onChange={e => setFilter('location', e.target.value)}>
              <option value="">すべて</option>
              {locationOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', marginBottom: 4 }}>月給</div>
            <select style={selectStyle} value={filters.rate} onChange={e => setFilter('rate', e.target.value)}>
              <option value="">すべて</option>
              {RATE_RANGES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', marginBottom: 4 }}>期間</div>
            <select style={selectStyle} value={filters.period} onChange={e => setFilter('period', e.target.value)}>
              <option value="">すべて</option>
              <option value="〜3ヶ月">〜3ヶ月</option>
              <option value="3-6ヶ月">3ヶ月〜6ヶ月</option>
              <option value="6-12ヶ月">6ヶ月〜1年</option>
              <option value="1年〜">1年〜</option>
              <option value="長期">長期</option>
            </select>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', marginBottom: 4 }}>経験年数</div>
            <select style={selectStyle} value={filters.exp} onChange={e => setFilter('exp', e.target.value)}>
              <option value="">すべて</option>
              <option value="〜3年">〜3年</option>
              <option value="3〜5年">3〜5年</option>
              <option value="5〜7年">5〜7年</option>
              <option value="7年以上">7年以上</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 16, marginBottom: 8 }}>
        <strong style={{ color: 'var(--ink-0)' }}>{filtered.length}</strong> 件の案件
        {hasActiveFilters && <span> （<button onClick={clearFilters} style={{ background: 'none', border: 'none', color: 'var(--accent-deep)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, textDecoration: 'underline', padding: 0 }}>条件を解除</button>）</span>}
      </div>

      <div className="case-grid">
        {paginated.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p>検索条件に一致する案件がありません</p>
          </div>
        ) : (
          paginated.map(c => (
            <CaseCard key={c.id} c={c} matched={isMatched(c)} onOpen={handleOpen} />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="admin-pagination" style={{ marginTop: 24 }}>
          <button className="btn sm" disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            style={{ opacity: page <= 1 ? 0.4 : 1, cursor: page <= 1 ? 'not-allowed' : 'pointer' }}>
            ← 前へ
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className="btn sm"
              style={{
                minWidth: 36, justifyContent: 'center',
                background: p === page ? 'var(--accent)' : 'var(--bg-card)',
                color: p === page ? 'white' : 'var(--ink-1)',
                borderColor: p === page ? 'var(--accent)' : 'var(--line-2)',
              }}>
              {p}
            </button>
          ))}
          <button className="btn sm" disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
            style={{ opacity: page >= totalPages ? 0.4 : 1, cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}>
            次へ →
          </button>
          <span style={{ fontSize: 12, color: 'var(--ink-3)', marginLeft: 8 }}>
            {page} / {totalPages} ページ
          </span>
        </div>
      )}

      {/* Detail & Apply modals */}
      {!externalOnOpen && detail && (
        <CaseDetailModal c={detail} onClose={() => setDetail(null)}
          onApply={(c) => { setDetail(null); setApplyFor(c) }} />
      )}
      {!externalOnOpen && applyFor && (
        <ApplyForm c={applyFor} onClose={() => setApplyFor(null)} />
      )}
    </section>
  )
}
