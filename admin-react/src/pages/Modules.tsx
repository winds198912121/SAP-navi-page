// ===========================================================
// ModulesPage — モジュール一覧ページ /modules
// 全 9 モジュールをカード表示、検索・フィルタ機能付き
// ===========================================================

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/layout/Seo'
import SiteHeader from '../components/layout/Header'
import SiteFooter from '../components/layout/Footer'
import FloatingPanda from '../components/layout/FloatingPanda'
import { useTheme } from '../hooks/useTheme'
import api from '../services/api'
import type { SapModule } from '../types'

export default function ModulesPage() {
  const [modules, setModules] = useState<SapModule[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterLevel, setFilterLevel] = useState('all')
  const { settings } = useTheme()

  useEffect(() => {
    api.getModules().then(res => {
      if (res.success && res.data) setModules(res.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = modules.filter(m => {
    const matchSearch = !search || m.name_ja.includes(search) || m.name_en.toLowerCase().includes(search.toLowerCase()) || m.code.toLowerCase().includes(search.toLowerCase())
    const matchLevel = filterLevel === 'all' || m.levels.includes(filterLevel)
    return matchSearch && matchLevel
  })

  return (
    <>
      <Seo
        title="SAP モジュール一覧"
        description="SAP の全 9 モジュールを解説。FI(財務会計)・CO(管理会計)・MM(購買管理)・SD(販売管理)・PP(生産計画)・HR(人事)・ABAP(開発)・Basis(基盤)・S/4HANA。初心者向け入門記事から上級者向けテクニックまで、モジュール別に学べる SAP 知識サイト。"
        path="/modules"
      />
      <div className="page-bg" />
      <SiteHeader active="modules" />
      <main style={{ position: 'relative', zIndex: 2 }}>
        <section className="section" id="modules-page">
          <div className="section-head" style={{ marginBottom: 20 }}>
            <div>
              <div className="label">Module Guide</div>
              <h2>モジュール一覧<span className="accent-mark">.</span></h2>
            </div>
            <div className="desc">
              SAP の 9 大モジュールを網羅。<br />
              気になるモジュールから始めよう。
            </div>
          </div>

          {/* Search + Filter */}
          <div style={{
            display: 'flex', gap: 12, marginBottom: 24,
            flexWrap: 'wrap', alignItems: 'center',
          }}>
            <input
              type="text"
              placeholder="モジュール名・キーワードで検索..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1, minWidth: 240, padding: '10px 14px',
                border: '1.5px solid var(--line-2)', borderRadius: 'var(--r-pill)',
                fontSize: 13.5, fontFamily: 'inherit', background: 'var(--bg-card)',
                outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--line-2)'}
            />
            <div style={{ display: 'flex', gap: 4 }}>
              {[
                { id: 'all', label: 'すべて' },
                { id: '初級', label: '初級' },
                { id: '中級', label: '中級' },
                { id: '上級', label: '上級' },
              ].map(l => (
                <button key={l.id}
                  onClick={() => setFilterLevel(l.id)}
                  style={{
                    padding: '6px 14px', borderRadius: 'var(--r-pill)',
                    border: '1.5px solid var(--line-2)', cursor: 'pointer',
                    fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                    background: filterLevel === l.id ? 'var(--accent)' : 'var(--bg-card)',
                    color: filterLevel === l.id ? '#fff' : 'var(--ink-1)',
                    transition: 'all .15s',
                  }}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Module Grid */}
          <div className="module-grid">
            {filtered.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>
                該当するモジュールが見つかりませんでした。
              </div>
            ) : filtered.map(m => (
              <Link key={m.code} to={`/category/${m.slug}`}
                className="mod-card"
                style={{ '--card-color': m.color, '--card-bg': m.bg_color } as React.CSSProperties}>
                <div className="mod-top">
                  <div className="mod-icon">{m.code}</div>
                </div>
                <div className="mod-name-ja">{m.name_ja}</div>
                <div className="mod-code">{m.name_en}</div>
                <div className="mod-desc">{m.description}</div>
                <div className="mod-foot">
                  <span className="count">{m.article_count}本</span>
                  <span>の記事</span>
                  <div className="level-tags">
                    {m.levels.map((lv, j) => (
                      <span key={j} className={`level-pill l${j + 1}`}>{lv}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
      {settings.showFloatingPanda && <FloatingPanda />}
    </>
  )
}
