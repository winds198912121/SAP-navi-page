import { api } from '@/lib/api';
import Link from 'next/link';
export const revalidate = 60;
async function AdminVideos() {
  const items = (await api.getVideos({ per_page: 50 })) || [];
  return (
    <>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'var(--spacing-xl)'}}>
        <h1>🎬 動画管理</h1>
        <Link href="/admin/videos/new" className="btn btn-primary btn-sm">＋ 新規作成</Link>
      </div>
      {items.length > 0 ? (
        <table className="admin-table">
          <thead><tr><th>ID</th><th>タイトル</th><th>操作</th></tr></thead>
          <tbody>{items.map((item: any) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title || item.name || item.question?.slice(0,30) || '-'}</td>
              <td className="actions"><Link href={`/admin/videos/${item.id}/edit`} className="btn btn-sm btn-ghost">編集</Link></td>
            </tr>
          ))}</tbody>
        </table>
      ) : <p style={{color:'var(--color-text-lighter)',padding:'var(--spacing-2xl)',textAlign:'center'}}>データがまだありません。</p>}
    </>
  );
}
export default AdminVideos;
