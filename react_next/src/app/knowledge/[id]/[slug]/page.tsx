import { api } from '@/lib/api'; import { moduleColor } from '@/lib/utils';
import { notFound } from 'next/navigation'; import Link from 'next/link';
interface Props { params: Promise<{ id: string; slug: string }> }
export const revalidate = 60;
async function KnowledgePage({ params }: Props) {
  const { id } = await params;
  const k = await api.getKnowledgeDetail(Number(id));
  if (!k) notFound();
  return (
    <div className="container-narrow" style={{paddingTop:'var(--spacing-xl)',paddingBottom:'var(--spacing-2xl)'}}>
      <nav className="breadcrumb"><Link href="/">ホーム</Link><span className="separator">›</span><span>{k.title}</span></nav>
      <h1>{k.title}</h1>
      {k.module_slug && <span className="module-badge" style={{background:moduleColor(k.module_slug),display:'inline-block',marginBottom:'var(--spacing-md)'}}>{k.module_slug.toUpperCase()}</span>}
      <div dangerouslySetInnerHTML={{__html: k.content || k.post_content || ''}} />
    </div>
  );
}
export default KnowledgePage;
