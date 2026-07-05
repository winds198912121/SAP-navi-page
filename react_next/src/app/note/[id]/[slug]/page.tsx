import { api } from '@/lib/api'; import { formatDate } from '@/lib/utils';
import { notFound } from 'next/navigation'; import Link from 'next/link';
interface Props { params: Promise<{ id: string; slug: string }> }
export const revalidate = 60;
async function NotePage({ params }: Props) {
  const { id } = await params;
  const n = await api.getNote(Number(id));
  if (!n) notFound();
  return (
    <div className="container-narrow" style={{paddingTop:'var(--spacing-xl)',paddingBottom:'var(--spacing-2xl)'}}>
      <nav className="breadcrumb"><Link href="/">ホーム</Link><span className="separator">›</span><span>ノート</span></nav>
      <h1>{n.title}</h1>
      <div style={{color:'var(--color-text-lighter)',fontSize:'var(--text-sm)',marginBottom:'var(--spacing-lg)'}}>📅 {formatDate(n.date)}</div>
      <div dangerouslySetInnerHTML={{__html: n.content || n.post_content || ''}} />
    </div>
  );
}
export default NotePage;
