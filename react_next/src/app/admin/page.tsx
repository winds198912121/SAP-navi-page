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
    </>
  );
}
export default AdminDashboard;
