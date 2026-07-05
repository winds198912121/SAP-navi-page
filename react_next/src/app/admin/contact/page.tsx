import { api } from '@/lib/api';
export const revalidate = 60;
async function AdminContact() {
  const items = (await api.getArticles({})) || [];
  return (
    <>
      <h1 style={{marginBottom:'var(--spacing-xl)'}}>✉️ お問い合わせ管理</h1>
      <table className="admin-table">
        <thead><tr><th>ID</th><th>名前</th><th>メール</th><th>日付</th></tr></thead>
        <tbody>{items.map((a: any) => (
          <tr key={a.id}><td>{a.id}</td><td>{a.title}</td><td>-</td><td>{a.date?.slice(0,10)}</td></tr>
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
export default AdminContact;
