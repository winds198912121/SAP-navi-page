import { api } from '@/lib/api';
import Link from 'next/link';
import { notFound } from 'next/navigation';
interface Props { params: Promise<{ id: string }> }
export const revalidate = 60;
async function LearningPathPage({ params }: Props) {
  const { id } = await params;
  const [path, steps] = await Promise.all([api.getLearningPath(Number(id)), api.getPathSteps(Number(id))]);
  if (!path) notFound();
  const color = path.accent_color || '#4CAF50';
  return (
    <div className="container-narrow" style={{paddingTop:'var(--spacing-xl)',paddingBottom:'var(--spacing-2xl)'}}>
      <nav className="breadcrumb"><Link href="/">ホーム</Link><span className="separator">›</span><Link href="/paths">学習パス</Link><span className="separator">›</span><span>{path.title}</span></nav>
      <div style={{background:`${color}15`,borderRadius:'var(--radius-xl)',padding:'var(--spacing-xl)',borderLeft:`4px solid ${color}`}}>
        <h1 style={{marginBottom:'var(--spacing-sm)'}}>{path.title}</h1>
        <p style={{color:'var(--color-text-light)'}}>{path.description}</p>
        <div style={{display:'flex',gap:'var(--spacing-lg)',marginTop:'var(--spacing-md)',fontSize:'var(--text-sm)',color:'var(--color-text-lighter)'}}>
          <span>🎯 {path.target_audience || '全レベル'}</span>
          <span>📚 {steps?.length || 0}ステップ</span>
          {path.estimated_hours && <span>⏱ {path.estimated_hours}時間</span>}
        </div>
      </div>
      {steps && steps.length > 0 && (
        <div style={{marginTop:'var(--spacing-2xl)'}}>
          <h2>学習ステップ</h2>
          <div style={{display:'flex',flexDirection:'column',gap:'var(--spacing-md)'}}>
            {steps.map((step: any, i: number) => (
              <div key={step.id || i} style={{display:'flex',gap:'var(--spacing-md)',alignItems:'flex-start'}}>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                  <div style={{width:36,height:36,borderRadius:'50%',background:color,color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'var(--text-sm)',flexShrink:0}}>{i+1}</div>
                  {i < steps.length-1 && <div style={{width:2,flex:1,background:`${color}40`,minHeight:20}}></div>}
                </div>
                <div style={{flex:1,background:'var(--color-bg-card)',border:'1px solid var(--color-border-light)',borderRadius:'var(--radius-lg)',padding:'var(--spacing-md)'}}>
                  <h4 style={{marginBottom:4}}>{step.title}</h4>
                  <p style={{fontSize:'var(--text-sm)',color:'var(--color-text-light)',marginBottom:'var(--spacing-sm)'}}>{step.description}</p>
                  <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                    {step.articles?.map((a: any) => <Link key={a.id} href={`/article/${a.id}/${a.slug||''}`} className="badge badge-primary" style={{fontSize:11}}>📄 {a.title}</Link>)}
                    {step.courses?.map((c: any) => <Link key={c.id} href={`/course/${c.id}`} className="badge badge-accent" style={{fontSize:11}}>📚 {c.title}</Link>)}
                    {step.knowledge?.map((k: any) => <Link key={k.id} href={`/knowledge/${k.id}/${k.slug||''}`} className="badge" style={{background:'#E8EAF6',color:'#283593',fontSize:11}}>💡 {k.title}</Link>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
export default LearningPathPage;
