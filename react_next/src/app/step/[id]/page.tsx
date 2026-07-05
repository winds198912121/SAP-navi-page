import { api } from '@/lib/api';
import { notFound } from 'next/navigation'; import Link from 'next/link';
interface Props { params: Promise<{ id: string }> }
export const revalidate = 60;
async function StepPage({ params }: Props) {
  const { id } = await params;
  const s = await api.getStep(Number(id));
  if (!s) notFound();
  return (
    <div className="container-narrow" style={{paddingTop:'var(--spacing-xl)',paddingBottom:'var(--spacing-2xl)'}}>
      <nav className="breadcrumb"><Link href="/">ホーム</Link><span className="separator">›</span><Link href="/paths">学習パス</Link><span className="separator">›</span><span>{s.title}</span></nav>
      <h1>{s.title}</h1>
      <p style={{color:'var(--color-text-light)'}}>{s.description}</p>
      <div style={{marginTop:'var(--spacing-lg)'}} dangerouslySetInnerHTML={{__html: s.content || ''}} />
    </div>
  );
}
export default StepPage;
