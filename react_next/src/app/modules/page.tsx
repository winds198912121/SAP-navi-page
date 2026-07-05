import { api } from '@/lib/api';
import { moduleColor, moduleName, MODULE_DESCS } from '@/lib/utils';
import Link from 'next/link';

export const revalidate = 3600;
async function ModulesPage() {
  const modules = await api.getModules();
  return (
    <div className="container" style={{paddingTop:'var(--spacing-xl)',paddingBottom:'var(--spacing-2xl)'}}>
      <nav className="breadcrumb"><Link href="/">ホーム</Link><span className="separator">›</span><span>SAPモジュール</span></nav>
      <h1>SAPモジュール</h1>
      <p style={{color:'var(--color-text-light)',marginBottom:'var(--spacing-xl)'}}>SAPの主要9モジュールを体系的に学べます。</p>
      <div className="module-grid">
        {modules?.map(mod => {
          const slug = mod.slug || '';
          return (
            <Link key={slug} href={`/category/${slug}`} className="module-card">
              <div className="module-icon" style={{background:moduleColor(slug)}}>{slug.slice(0,2).toUpperCase()}</div>
              <div className="module-info"><h3>{moduleName(slug)}</h3><p>{MODULE_DESCS[slug] || ''}</p></div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
export default ModulesPage;
