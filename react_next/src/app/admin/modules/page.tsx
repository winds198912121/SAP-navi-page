import { api } from '@/lib/api'; import { moduleName } from '@/lib/utils';
export const revalidate = 3600;
async function AdminModules() {
  const items = (await api.getModules()) || [];
  return (
    <>
      <h1 style={{marginBottom:'var(--spacing-xl)'}}>🔧 モジュール管理</h1>
      <table className="admin-table">
        <thead><tr><th>スラッグ</th><th>名前</th><th>記事数</th></tr></thead>
        <tbody>{items.map((m: any) => (
          <tr key={m.slug}><td>{m.slug}</td><td>{moduleName(m.slug)}</td><td>{m.article_count || 0}</td></tr>
        ))}</tbody>
      </table>
    </>
  );
}
export default AdminModules;
