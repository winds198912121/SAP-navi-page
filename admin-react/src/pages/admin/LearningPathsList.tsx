// ===========================================================
// LearningPathsList — 学習パス一覧管理 /admin/learning-paths
// ===========================================================

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import Pagination from '../../components/admin/Pagination'

interface PathItem {
  id: number
  title: string
  audience: string
  description: string
  steps: { title: string; time: string }[]
  duration: string
  accent: string
  article_count: number
  created_at: string
  status?: string
}

export default function LearningPathsList() {
  const [paths, setPaths] = useState<PathItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const perPage = 20

  const fetchPaths = () => {
    setLoading(true)
    api.getLearningPaths().then(res => {
      if (res.success && res.data) {
        const all = res.data as PathItem[]
        setTotal(all.length)
        const start = (page - 1) * perPage
        setPaths(all.slice(start, start + perPage))
      }
    }).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { fetchPaths() }, [page])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await api.deleteLearningPath(deleteId)
      if (res.success) {
        setPaths(prev => prev.filter(p => p.id !== deleteId))
        setTotal(prev => Math.max(0, prev - 1))
      }
    } catch {}
    setDeleting(false)
    setDeleteId(null)
  }

  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>学習パス管理</h1>
          <p className="admin-page-desc">全 {total} 件の学習パス</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/admin/learning-paths/new" className="admin-btn admin-btn-primary">+ 新規学習パス</Link>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">読み込み中...</div>
      ) : paths.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">🎋</div>
          <p>まだ学習パスがありません</p>
          <Link to="/admin/learning-paths/new" className="admin-btn admin-btn-primary">最初の学習パスを作成</Link>
        </div>
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>タイトル</th>
                  <th className="col-hide-mobile">対象</th>
                  <th className="col-hide-mobile">ステップ</th>
                  <th className="col-hide-tablet">時間</th>
                  <th className="col-hide-tablet col-hide-mobile">記事数</th>
                  <th className="col-hide-tablet col-hide-mobile">作成日</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {paths.map(p => (
                  <tr key={p.id}>
                    <td className="admin-cell-title">{p.title}</td>
                    <td className="col-hide-mobile">{p.audience || '—'}</td>
                    <td className="col-hide-mobile">{(p.steps || []).length}</td>
                    <td className="col-hide-tablet">{p.duration || '—'}</td>
                    <td className="col-hide-tablet col-hide-mobile">{p.article_count || 0}</td>
                    <td className="admin-cell-date col-hide-tablet col-hide-mobile">{new Date(p.created_at).toLocaleDateString('ja-JP')}</td>
                    <td>
                      <div className="admin-actions">
                        <Link to={`/admin/learning-paths/${p.id}/edit`} className="admin-btn admin-btn-sm">編集</Link>
                        <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => setDeleteId(p.id)}>削除</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onChange={p => setPage(p)} />
          )}
        </>
      )}

      {deleteId && (
        <div className="admin-overlay" onClick={() => !deleting && setDeleteId(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>学習パスを削除しますか？</h3>
            <p>関連する全ステップも削除されます。この操作は取り消せません。</p>
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
