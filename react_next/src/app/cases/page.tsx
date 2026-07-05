import { api } from '@/lib/api'; import { moduleColor } from '@/lib/utils'; import Link from 'next/link';
export const revalidate = 60;
async function CasesPage() {
  const cases = await api.getCases({ per_page: 20 });
  return (
    <div className="container" style={{paddingTop:'var(--spacing-xl)',paddingBottom:'var(--spacing-2xl)'}}>
      <nav className="breadcrumb"><Link href="/">ホーム</Link><span className="separator">›</span><span>案件一覧</span></nav>
      <h1>案件一覧</h1>
      {cases && cases.length > 0 ? (
        <div className="case-grid">
          {cases.map((c: any) => (
            <div key={c.id} className="case-card">
              <h3 className="case-card-title">{c.title}</h3>
              <div className="case-card-meta">
                <span>💰 {c.salary_range || '要相談'}</span>
                <span>📍 {c.location || '未定'}</span>
                {c.company && <span>🏢 {c.company}</span>}
              </div>
              {c.module_slug && <span className="module-badge" style={{background:moduleColor(c.module_slug),display:'inline-block',marginBottom:'var(--spacing-sm)'}}>{c.module_slug.toUpperCase()}</span>}
              <p className="case-card-desc">{c.description || c.excerpt}</p>
            </div>
          ))}
        </div>
      ) : <div className="empty-state">現在募集中の案件はありません。</div>}
    </div>
  );
}
export default CasesPage;
