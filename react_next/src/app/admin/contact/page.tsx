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
    </>
  );
}
export default AdminContact;
