import { api } from '@/lib/api';
export const revalidate = 60;
async function AdminDashboard() {
  const stats = await api.getArticles({}) as any[];
  return (
    <>
      <div style={{marginBottom:'var(--spacing-xl)'}}><h1>📊 ダッシュボード</h1></div>
      <div className="admin-stats">
        <div className="admin-stat-card"><div className="admin-stat-value">{stats?.length || 0}</div><div className="admin-stat-label">記事数</div></div>
        <div className="admin-stat-card"><div className="admin-stat-value">-</div><div className="admin-stat-label">コース数</div></div>
        <div className="admin-stat-card"><div className="admin-stat-value">-</div><div className="admin-stat-label">ユーザー数</div></div>
        <div className="admin-stat-card"><div className="admin-stat-value">-</div><div className="admin-stat-label">案件数</div></div>
      </div>
      <style jsx>{`
        .admin-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--spacing-md); }
        .admin-stat-card { background: var(--color-bg-card); border: 1px solid var(--color-border-light); border-radius: var(--radius-lg); padding: var(--spacing-lg); }
        .admin-stat-value { font-family: var(--font-heading); font-size: var(--text-3xl); font-weight: 900; color: var(--color-primary); }
        .admin-stat-label { font-size: var(--text-xs); color: var(--color-text-lighter); }
      `}</style>
    </>
  );
}
export default AdminDashboard;
