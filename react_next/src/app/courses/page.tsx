import { api } from '@/lib/api';
import { moduleColor, excerpt } from '@/lib/utils';
import Link from 'next/link';
export const revalidate = 60;
async function CoursesPage() {
  const courses = await api.getCourses({ per_page: 50 });
  return (
    <div className="container" style={{paddingTop:'var(--spacing-xl)',paddingBottom:'var(--spacing-2xl)'}}>
      <nav className="breadcrumb"><Link href="/">ホーム</Link><span className="separator">›</span><span>コース一覧</span></nav>
      <h1>コース一覧</h1>
      {courses && courses.length > 0 ? (
        <div className="grid-3">
          {courses.map((c: any) => (
            <div key={c.id} className="card" style={{padding:'var(--spacing-lg)'}}>
              <h3 style={{marginBottom:'var(--spacing-sm)'}}><Link href={`/course/${c.id}`}>{c.title}</Link></h3>
              {c.module_slug && <span className="module-badge" style={{background:moduleColor(c.module_slug),display:'inline-block',marginBottom:'var(--spacing-sm)'}}>{c.module_slug.toUpperCase()}</span>}
              <p style={{fontSize:'var(--text-sm)',color:'var(--color-text-light)'}}>{excerpt(c.description, 80)}</p>
            </div>
          ))}
        </div>
      ) : <div className="empty-state">コースがまだありません。</div>}
    </div>
  );
}
export default CoursesPage;
