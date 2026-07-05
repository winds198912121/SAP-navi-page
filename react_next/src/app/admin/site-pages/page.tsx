import { api } from '@/lib/api';
export const revalidate = 3600;
async function AdminSitePages() {
  const items = (await api.getPages()) || [];
  return (
    <>
      <h1 style={{marginBottom:'var(--spacing-xl)'}}>📃 固定ページ管理</h1>
      <table className="admin-table">
        <thead><tr><th>スラッグ</th><th>タイトル</th></tr></thead>
        <tbody>{items.map((p: any, i: number) => (
          <tr key={i}><td>{p.slug || p.post_name}</td><td>{p.title}</td></tr>
        ))}</tbody>
      </table>
    </>
  );
}
export default AdminSitePages;
