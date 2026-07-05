import { api } from '@/lib/api';
import Link from 'next/link';
export const revalidate = 60;
async function AdminQuizzes() {
  let items: any[] = [];
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_BASE + '/quizzes');
    const json = await res.json();
    items = json.data || json;
  } catch {}
  return (
    <>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'var(--spacing-xl)'}}>
        <h1>❓ クイズ管理</h1>
        <Link href="/admin/quizzes/new" className="btn btn-primary btn-sm">＋ 新規作成</Link>
      </div>
      <table className="admin-table">
        <thead><tr><th>ID</th><th>問題</th><th>操作</th></tr></thead>
        <tbody>{items.map((item: any) => (
          <tr key={item.id}>
            <td>{item.id}</td><td>{item.question?.slice(0,40)}</td>
            <td className="actions"><Link href={`/admin/quizzes/${item.id}/edit`} className="btn btn-sm btn-ghost">編集</Link></td>
          </tr>
        ))}</tbody>
      </table>
    </>
  );
}
export default AdminQuizzes;
