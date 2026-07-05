import { api } from '@/lib/api'; import Link from 'next/link';
export const revalidate = 60;
async function AdminArticles() {
  const items = await api.getArticles({ per_page: 50, status: 'all' }) || [];
  return (
    <>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'var(--spacing-xl)'}}>
        <h1>📄 記事管理</h1>
        <Link href="/admin/articles/new" className="btn btn-primary btn-sm">＋ 新規作成</Link>
      </div>
      <table className="admin-table">
        <thead><tr><th>ID</th><th>タイトル</th><th>モジュール</th><th>日付</th><th>操作</th></tr></thead>
        <tbody>{items.map((a: any) => (
          <tr key={a.id}>
            <td>{a.id}</td>
            <td><Link href={`/article/${a.id}/${a.slug||''}`}>{a.title}</Link></td>
            <td><span className="module-badge" style={{background:'var(--color-primary)',display:'inline-block'}}>{a.module_slug?.toUpperCase()}</span></td>
            <td>{a.date?.slice(0,10)}</td>
            <td className="actions"><Link href={`/admin/articles/${a.id}/edit`} className="btn btn-sm btn-ghost">編集</Link></td>
          </tr>
        ))}</tbody>
      </table>
    </>
  );
}
export default AdminArticles;
