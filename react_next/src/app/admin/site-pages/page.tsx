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
      <style jsx>{`
        .admin-table { width: 100%; border-collapse: collapse; background: var(--color-bg-card); border-radius: var(--radius-lg); overflow: hidden; }
        .admin-table th { text-align: left; padding: var(--spacing-sm) var(--spacing-md); background: var(--color-bg); font-size: var(--text-xs); font-weight: 700; color: var(--color-text-lighter); border-bottom: 1px solid var(--color-border); }
        .admin-table td { padding: var(--spacing-sm) var(--spacing-md); border-bottom: 1px solid var(--color-border-light); font-size: var(--text-sm); }
      `}</style>
    </>
  );
}
export default AdminSitePages;
