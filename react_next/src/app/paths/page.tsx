import { api } from '@/lib/api';
import { moduleColor } from '@/lib/utils';
import Link from 'next/link';
export const revalidate = 60;
async function PathsPage() {
  const paths = await api.getLearningPaths();
  return (
    <div className="container" style={{paddingTop:'var(--spacing-xl)',paddingBottom:'var(--spacing-2xl)'}}>
      <nav className="breadcrumb"><Link href="/">ホーム</Link><span className="separator">›</span><span>学習パス</span></nav>
      <h1>学習パス</h1>
      {paths && paths.length > 0 ? (
        <div className="path-list">
          {paths.map((p: any) => {
            const color = p.accent_color || '#4CAF50';
            return (
              <Link key={p.id} href={`/learning/${p.id}`} className="path-card">
                <div className="path-card-header" style={{background:color}}>
                  <h3 className="path-card-title">{p.title}</h3>
                  <p className="path-card-subtitle">{p.target_audience}</p>
                </div>
                <div className="path-card-body">
                  <div className="path-card-meta"><span>📚 {p.steps?.length || 0}ステップ</span>{p.estimated_hours && <span>⏱ {p.estimated_hours}時間</span>}</div>
                  <p className="path-card-desc">{p.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : <div className="empty-state">学習パスがまだありません。</div>}
    </div>
  );
}
export default PathsPage;
