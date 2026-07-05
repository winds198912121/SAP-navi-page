import { api } from '@/lib/api';
import Link from 'next/link';
export const revalidate = 60;
async function AdminLessons() {
  const courses = (await api.getCourses({ per_page: 50 })) || [];
  const items = courses.flatMap((c: any) => (c.lessons || []).map((l: any) => ({...l, course_title: c.title})));
  return (
    <>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'var(--spacing-xl)'}}>
        <h1>📖 レッスン管理</h1>
      </div>
      <table className="admin-table">
        <thead><tr><th>ID</th><th>タイトル</th><th>コース</th><th>操作</th></tr></thead>
        <tbody>{items.map((item: any) => (
          <tr key={item.id}>
            <td>{item.id}</td><td>{item.title}</td><td>{item.course_title || '-'}</td>
            <td className="actions"><Link href={`/admin/lessons/${item.id}/edit`} className="btn btn-sm btn-ghost">編集</Link></td>
          </tr>
        ))}</tbody>
      </table>
    </>
  );
}
export default AdminLessons;
