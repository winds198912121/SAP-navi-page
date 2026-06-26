// ===========================================================
// NoteList — 记事一覧（管理画面）
// ===========================================================

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function NoteList() {
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotes = () => {
    setLoading(true)
    api.client.get('/notes', { params: { per_page: 999, status: 'all' } }).then(({data}) => {
      if (data.success) setNotes(data.data || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { fetchNotes() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('この記事を削除しますか？')) return
    const res = await api.deleteNote(id)
    if (res.success) fetchNotes()
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)' }}>読み込み中...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)' }}>记事一覧</h2>
        <Link to="/admin/notes/new" className="btn accent" style={{ textDecoration: 'none' }}>＋ 新規記事追加</Link>
      </div>
      {notes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>記事がありません。</div>
      ) : (
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th><th>タイトル</th><th>モジュール</th><th>作成日</th><th>操作</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((n: any) => (
              <tr key={n.id}>
                <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{n.id}</td>
                <td style={{ fontWeight: 500 }}>{n.title}</td>
                <td>{n.module?.slug?.toUpperCase() || '—'}</td>
                <td style={{ fontSize: 12, color: 'var(--ink-2)' }}>{new Date(n.created_at).toLocaleDateString('ja-JP')}</td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/admin/notes/${n.id}/edit`} className="btn sm" style={{ textDecoration: 'none' }}>編集</Link>
                    <a href={`/note/${n.id}/${n.slug}`} target="_blank" rel="noopener noreferrer" className="btn sm" style={{ textDecoration: 'none' }}>表示</a>
                    <button className="btn sm danger" onClick={() => handleDelete(n.id)}>削除</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
