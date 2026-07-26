import { api } from '@/lib/api';
import { moduleColor, getModuleSlug, excerpt } from '@/lib/utils';
import Link from 'next/link';

export const revalidate = 60;

async function CoursesPage() {
  const courses = await api.getCourses({ per_page: 50 });
  return (
    <section className="section">
      <div className="section-head"><div><div className="label">Courses</div><h2>コース一覧</h2></div><div className="desc">SAP学習コース</div></div>
      {courses && courses.length > 0 ? (
        <div className="module-grid">
          {courses.map((c: any) => (
            <Link key={c.id} href={`/course/${c.id}`} className="mod-card" style={{cursor:'pointer', textDecoration:'none', color:'inherit'}}>
              <div className="mod-top"><div className="mod-icon">📚</div><span className="mod-code">コース</span></div>
              <div className="mod-name-ja">{c.title}</div>
              <div className="mod-desc">{excerpt(c.description, 80)}</div>
              <div className="mod-foot">
                {getModuleSlug(c) && <span className={`tag-mod ${getModuleSlug(c)}`}>{getModuleSlug(c).toUpperCase()}</span>}
              </div>
            </Link>
          ))}
        </div>
      ) : <div style={{padding:40,textAlign:'center',color:'var(--ink-3)'}}>コースがまだありません。</div>}
    </section>
  );
}

export default CoursesPage;
