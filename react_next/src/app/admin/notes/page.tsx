import { api } from '@/lib/api';
import Link from 'next/link';
export const revalidate = 60;
async function AdminNotes() {
  const items = (await api.getNotes({ per_page: 50 })) || [];
  return (
    <>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'var(--spacing-xl)'}}>
        <h1>📝 ノート管理</h1>
        <Link href="/admin/notes/new" className="btn btn-primary btn-sm">＋ 新規作成</Link>
      </div>
      {items.length > 0 ? (
        <table className="admin-table">
          <thead><tr><th>ID</th><th>タイトル</th><th>操作</th></tr></thead>
          <tbody>{items.map((item: any) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title || item.name || item.question?.slice(0,30) || '-'}</td>
              <td className="actions"><Link href={`/admin/notes/${item.id}/edit`} className="btn btn-sm btn-ghost">編集</Link></td>
            </tr>
          ))}</tbody>
        </table>
      ) : <p style={{color:'var(--color-text-lighter)',padding:'var(--spacing-2xl)',textAlign:'center'}}>データがまだありません。</p>}
      <style jsx>{`
        .admin-table { width: 100%; border-collapse: collapse; background: var(--color-bg-card); border-radius: var(--radius-lg); overflow: hidden; }
        .admin-table th { text-align: left; padding: var(--spacing-sm) var(--spacing-md); background: var(--color-bg); font-size: var(--text-xs); font-weight: 700; color: var(--color-text-lighter); border-bottom: 1px solid var(--color-border); }
        .admin-table td { padding: var(--spacing-sm) var(--spacing-md); border-bottom: 1px solid var(--color-border-light); font-size: var(--text-sm); }
        .admin-table tr:hover td { background: var(--color-primary-bg); }
        .actions { display: flex; gap: var(--spacing-xs); }
      `}</style>
    </>
  );
}
export default AdminNotes;
