import { api } from '@/lib/api';
import Link from 'next/link';
export const revalidate = 3600;
async function MembershipPage() {
  const plans = await api.getMembershipPlans();
  return (
    <div className="container" style={{paddingTop:'var(--spacing-xl)',paddingBottom:'var(--spacing-2xl)'}}>
      <div className="section-title"><h2>会員プラン</h2><p>あなたに最適なプランをお選びください</p></div>
      <div className="grid-3" style={{maxWidth:900,margin:'0 auto'}}>
        {plans?.map((p: any) => (
          <div key={p.id} className="card" style={{textAlign:'center',padding:'var(--spacing-xl)'}}>
            <h3>{p.name}</h3>
            <div style={{fontFamily:'var(--font-heading)',fontSize:'2.5rem',fontWeight:900,color:'var(--color-primary)'}}>¥{Number(p.price).toLocaleString()}</div>
            <div style={{fontSize:'var(--text-sm)',color:'var(--color-text-lighter)',marginBottom:'var(--spacing-lg)'}}>/ {p.interval || '月'}</div>
            <p style={{fontSize:'var(--text-sm)',color:'var(--color-text-light)'}}>{p.description}</p>
            {p.features && <ul style={{listStyle:'none',padding:0,textAlign:'left',margin:'var(--spacing-lg) 0'}}>{p.features.map((f: string, i: number) => <li key={i} style={{padding:4,fontSize:'var(--text-sm)'}}>✅ {f}</li>)}</ul>}
            <Link href="/login" className="btn btn-primary btn-block">購読する</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
export default MembershipPage;
