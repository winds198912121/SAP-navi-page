import { api } from '@/lib/api';
import { moduleColor } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props { params: Promise<{ id: string }> }
export const revalidate = 60;

async function CourseDetail({ params }: Props) {
  const { id } = await params;
  const [course, lessons] = await Promise.all([
    api.getCourse(Number(id)),
    api.getCourseLessons(Number(id)),
  ]);
  if (!course) notFound();

  return (
    <div className="container-narrow" style={{paddingTop:'var(--spacing-xl)',paddingBottom:'var(--spacing-2xl)'}}>
      <nav className="breadcrumb"><Link href="/">ホーム</Link><span className="separator">›</span><Link href="/courses">コース</Link><span className="separator">›</span><span>{course.title}</span></nav>
      <h1>{course.title}</h1>
      {course.module_slug && <span className="module-badge" style={{background:moduleColor(course.module_slug)}}>{course.module_slug.toUpperCase()}</span>}
      <div style={{marginTop:'var(--spacing-lg)',marginBottom:'var(--spacing-xl)'}} dangerouslySetInnerHTML={{__html: course.description || course.content || ''}} />
      {lessons && lessons.length > 0 && (
        <>
          <h2>レッスン</h2>
          <div style={{display:'flex',flexDirection:'column',gap:'var(--spacing-sm)'}}>
            {lessons.map((ls: any, i: number) => (
              <div key={ls.id} style={{display:'flex',alignItems:'center',gap:'var(--spacing-md)',padding:'var(--spacing-md)',background:'var(--color-bg-card)',border:'1px solid var(--color-border-light)',borderRadius:'var(--radius-md)'}}>
                <span style={{width:28,height:28,borderRadius:'50%',background:'var(--color-primary-bg)',color:'var(--color-primary)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'var(--text-sm)',flexShrink:0}}>{i+1}</span>
                <div style={{flex:1}}>
                  <strong><Link href={`/lesson/${ls.id}/${ls.slug||''}`} style={{color:'var(--color-text)'}}>{ls.title}</Link></strong>
                  {ls.duration && <div style={{fontSize:'var(--text-xs)',color:'var(--color-text-lighter)'}}>{ls.duration}</div>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
export default CourseDetail;
