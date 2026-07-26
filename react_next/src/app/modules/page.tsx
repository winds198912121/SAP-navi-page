import { api } from '@/lib/api';
import { moduleColor, moduleName, MODULE_DESCS } from '@/lib/utils';
import Link from 'next/link';
export const revalidate = 3600;
async function ModulesPage() {
  const modules = await api.getModules();
  return (
    <section className="section">
      <div className="section-head">
        <div>
          <div className="label">Modules</div>
          <h2>SAPモジュール</h2>
        </div>
        <div className="desc">SAPの主要9モジュールを体系的に学べます。</div>
      </div>
      <div className="module-grid">
        {modules?.map((mod: any) => {
          const slug = mod.slug || '';
          const color = mod.color || moduleColor(slug);
          const bg = mod.bg_color || `${color}20`;
          return (
            <Link key={slug} href={`/category/${slug}`} className="mod-card" style={{ '--card-color': color, '--card-bg': bg } as React.CSSProperties}>
              <div className="mod-top">
                <div className="mod-icon">{slug.slice(0,2).toUpperCase()}</div>
                <span className="mod-code">{mod.code || slug.toUpperCase()}</span>
              </div>
              <div className="mod-name-ja">{mod.name_ja || moduleName(slug)}</div>
              <div className="mod-desc">{mod.description || MODULE_DESCS[slug] || ''}</div>
              <div className="mod-foot">
                <span className="count">{mod.article_count || 0} 記事</span>
                {mod.levels && (
                  <div className="level-tags">
                    {mod.levels.map((lvl: string, i: number) => (
                      <span key={i} className={`level-pill l${i + 1}`}>{lvl}</span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
export default ModulesPage;
