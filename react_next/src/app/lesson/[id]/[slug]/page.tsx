import { api } from '@/lib/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
interface Props { params: Promise<{ id: string; slug: string }> }
export const revalidate = 60;
async function LessonPage({ params }: Props) {
  const { id } = await params;
  const lesson = await api.getLesson(Number(id));
  if (!lesson) notFound();
  return (
    <div className="container-narrow" style={{paddingTop:'var(--spacing-xl)',paddingBottom:'var(--spacing-2xl)'}}>
      <nav className="breadcrumb"><Link href="/">ホーム</Link><span className="separator">›</span><span>{lesson.title}</span></nav>
      <h1>{lesson.title}</h1>
      <div style={{marginTop:'var(--spacing-lg)'}} dangerouslySetInnerHTML={{__html: lesson.content || lesson.post_content || ''}} />
    </div>
  );
}
export default LessonPage;
