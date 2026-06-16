// ===========================================================
// KnowledgeList — ナレッジ一覧管理 /admin/knowledge
// ===========================================================

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import Pagination from '../../components/admin/Pagination'
import ImportModal from '../../components/admin/ImportModal'
import { exportToExcel, type ColumnDef } from '../../services/import-export'
import { SAP_MODULES } from '../../types'

const TYPE_LABELS: Record<string, string> = {
  concept: '概念',
  tcode: 'T-Code',
  best_practice: 'ベストプラクティス',
  glossary: 'SAP用語集',
  faq: 'SAP FAQ',
  tcode_dict: 'TCode辞典',
  error_code: '錯誤コード庫',
  config_guide: '配置指南',
  tutorial: '教程',
  interview: '面接題',
  career: '転職指南',
  special: '專題分類',
}

interface KnowledgeItem {
  id: number
  title: string
  type: string
  module: { slug: string; name: string } | null
  difficulty: { slug: string; name: string } | null
  created_at: string
  updated_at: string
  status?: string
}

export default function KnowledgeList() {
  const [items, setItems] = useState<KnowledgeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [moduleFilter, setModuleFilter] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [showImport, setShowImport] = useState(false)
  const perPage = 20

  const KNOWLEDGE_COLUMNS: ColumnDef[] = [
    { key: 'id', label: 'ID', width: 8 },
    { key: 'title', label: 'タイトル', width: 40 },
    { key: 'type_name', label: 'タイプ', width: 15 },
    { key: 'module_name', label: 'モジュール', width: 15 },
    { key: 'difficulty_name', label: '難易度', width: 10 },
    { key: 'excerpt', label: '内容', width: 50 },
    { key: 'status', label: 'ステータス', width: 10 },
    { key: 'created_at', label: '作成日', width: 15 },
    { key: 'updated_at', label: '更新日', width: 15 },
  ]

  const handleExport = async () => {
    try {
      const { data } = await api.client.get('/knowledge', { params: { per_page: 9999 } })
      const items = data.success ? (data.data || []) : []
      const rows = items.map((k: any) => ({
        id: k.id,
        title: k.title,
        type_name: k.type || '',
        module_name: k.module?.name || '',
        difficulty_name: k.difficulty?.name || '',
        excerpt: (k.excerpt || '').replace(/<[^>]*>/g, ''),
        status: k.status || 'publish',
        created_at: k.created_at?.slice(0, 10) || '',
        updated_at: k.updated_at?.slice(0, 10) || '',
      }))
      exportToExcel(rows, KNOWLEDGE_COLUMNS, `ナレッジ一覧_全${rows.length}件_${new Date().toISOString().slice(0, 10)}`)
    } catch {}
  }

  const handleImport = async (rows: Record<string, any>[]) => {
    let success = 0; let failed = 0; const errors: { row: number; message: string }[] = []
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i]; const rowNum = i + 2
      if (!r['タイトル']?.trim()) { failed++; errors.push({ row: rowNum, message: 'タイトルが空です' }); continue }
      try {
        await api.client.post('/knowledge', { title: r['タイトル'], excerpt: r['内容'] || '' })
        success++
      } catch (e: any) { failed++; errors.push({ row: rowNum, message: e.response?.data?.message || '保存失敗' }) }
    }
    if (success > 0) fetchItems()
    return { success, failed, errors }
  }

  const fetchItems = () => {
    setLoading(true)
    api.client.get('/knowledge', { params: { per_page: perPage, page, q: search || undefined, type: typeFilter || undefined, module: moduleFilter || undefined } })
      .then(({ data }) => {
        if (data.success) {
          setItems(data.data || [])
          setTotal(data.total || 0)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchItems() }, [page, typeFilter, moduleFilter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchItems()
  }


  const handleBatchStatus = async (statusStr: string) => {
    for (const id of selectedIds) {
      try { await api.client.put(`/knowledge/${id}`, { status: statusStr }) } catch {}
    }
    setItems(prev => prev.map(i => selectedIds.includes(i.id) ? { ...i, status: statusStr } : i))
    setSelectedIds([])
  }

  const paginated = items
  const allSelected = paginated.length > 0 && paginated.every((i: any) => selectedIds.includes(i.id))

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? paginated.map((i: any) => i.id) : [])
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await api.deleteKnowledge(deleteId)
      if (res.success) {
        setItems(prev => prev.filter(k => k.id !== deleteId))
        setTotal(prev => Math.max(0, prev - 1))
      }
    } catch {}
    setDeleting(false)
    setDeleteId(null)
  }

  useEffect(() => { setSelectedIds([]) }, [page])
  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>ナレッジ管理</h1>
          <p className="admin-page-desc">全 {total} 件のナレッジ</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="admin-btn" onClick={handleExport}>📤 エクスポート</button>
          <button className="admin-btn" onClick={() => setShowImport(true)}>📥 インポート</button>
          <Link to="/admin/knowledge/new" className="admin-btn admin-btn-primary">+ 新規ナレッジ</Link>
        </div>
      </div>

      {/* Filters + Search */}
      <form className="admin-search-bar" onSubmit={handleSearch}>
        <input type="text" className="admin-input" placeholder="ナレッジを検索..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className="admin-input admin-input-sm" value={typeFilter}
          onChange={e => { setTypeFilter(e.target.value); setPage(1) }}>
          <option value="">すべてのタイプ</option>
          {Object.entries(TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select className="admin-input admin-input-sm" value={moduleFilter}
          onChange={e => { setModuleFilter(e.target.value); setPage(1) }}>
          <option value="">すべてのモジュール</option>
          {SAP_MODULES.map(m => (
            <option key={m.slug} value={m.slug}>{m.code}</option>
          ))}
        </select>
        <button type="submit" className="admin-btn">検索</button>
      </form>

      {/* Table */}
      {loading ? (
        <div className="admin-loading">読み込み中...</div>
      ) : items.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">🎋</div>
          <p>まだナレッジがありません</p>
          <Link to="/admin/knowledge/new" className="admin-btn admin-btn-primary">最初のナレッジを作成</Link>
        </div>
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}><input type="checkbox" onChange={e => handleSelectAll(e.target.checked)} checked={allSelected} /></th>
                  <th>タイトル</th>
                  <th className="col-hide-tablet col-hide-mobile">タイプ</th>
                  <th className="col-hide-mobile">モジュール</th>
                  <th className="col-hide-mobile">難易度</th>
                  <th className="col-hide-tablet col-hide-mobile">更新日</th>
                  <th className="col-hide-mobile">ステータス</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {items.map(k => (
                  <tr key={k.id}>
                    <td><input type="checkbox" checked={selectedIds.includes(k.id)} onChange={e => setSelectedIds(prev => e.target.checked ? [...prev, k.id] : prev.filter(id => id !== k.id))} /></td>
                    <td className="admin-cell-title">{k.title}</td>
                    <td>{k.type ? <span className="admin-type-badge">{TYPE_LABELS[k.type] || k.type}</span> : '—'}</td>
                    <td>{k.module?.name || '—'}</td>
                    <td>{k.difficulty ? (
                      <span className={`admin-diff-lv l${k.difficulty.slug === 'beginner' ? 1 : k.difficulty.slug === 'intermediate' ? 2 : 3}`}>
                        {k.difficulty.name}
                      </span>
                    ) : '—'}</td>
                    <td className="admin-cell-date">{new Date(k.updated_at || k.created_at).toLocaleDateString('ja-JP')}</td>
                    <td>
                      <div className="admin-actions">
                        <Link to={`/admin/knowledge/${k.id}/edit`} className="admin-btn admin-btn-sm">編集</Link>
                        <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => setDeleteId(k.id)}>削除</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {selectedIds.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "var(--accent-soft)", borderRadius: "var(--r-md)", marginTop: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--accent-deep)" }}>{selectedIds.length} 件選択中</span>
              <button className="admin-btn admin-btn-sm admin-btn-primary" onClick={() => handleBatchStatus("publish")}>公開する</button>
              <button className="admin-btn admin-btn-sm" onClick={() => handleBatchStatus("draft")}>下書きにする</button>
              <button className="admin-btn admin-btn-sm" onClick={() => setSelectedIds([])} style={{ marginLeft: "auto" }}>解除</button>
            </div>
          )}
          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onChange={p => setPage(p)} />
          )}
        </>
      )}

      {showImport && <ImportModal columns={KNOWLEDGE_COLUMNS} templateFilename="ナレッジインポート" onImport={handleImport} onClose={() => { setShowImport(false); fetchItems() }} />}
      {/* Delete confirmation */}
      {deleteId && (
        <div className="admin-overlay" onClick={() => !deleting && setDeleteId(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>ナレッジを削除しますか？</h3>
            <p>この操作は取り消せません。削除されたナレッジはゴミ箱に移動されます。</p>
            <div className="admin-modal-actions">
              <button className="admin-btn" onClick={() => setDeleteId(null)} disabled={deleting}>キャンセル</button>
              <button className="admin-btn admin-btn-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? '削除中...' : '削除する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
