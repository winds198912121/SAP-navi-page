import { api } from '@/lib/api';
import { moduleColor, moduleName, difficultyLabel, difficultyClass, formatDate, excerpt } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props { params: Promise<{ slug: string }> }
export const revalidate = 60;

async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const [articles, modules] = await Promise.all([
    api.getModuleArticles(slug, { per_page: 20 }),
    api.getModules(),
  ]);
  if (!articles) notFound();

  return (
    <div className="container" style={{paddingTop:'var(--spacing-xl)',paddingBottom:'var(--spacing-2xl)'}}>
      <nav className="breadcrumb"><Link href="/">ホーム</Link><span className="separator">›</span><span>{moduleName(slug)}</span></nav>
      <h1>{moduleName(slug)}</h1>
      <p style={{color:'var(--color-text-light)',marginBottom:'var(--spacing-xl)'}}>全{articles.length}記事</p>
      <div className="filter-bar">
        {modules?.map(m => (
          <Link key={m.slug} href={`/category/${m.slug}`}
            className={`filter-btn ${slug === m.slug ? 'active' : ''}`}
            style={slug === m.slug ? {background:moduleColor(m.slug),borderColor:moduleColor(m.slug),color:'white'} : {}}>
            {m.slug?.toUpperCase()}
          </Link>
        ))}
      </div>
      {articles.length > 0 ? (
        <div className="article-list">
          {articles.map((art: any) => (
            <article key={art.id} className="article-card">
              <div className="article-card-body">
                <div className="article-card-meta">
                  <span className="module-badge" style={{background:moduleColor(slug)}}>{slug.toUpperCase()}</span>
                  {art.difficulty && <span className={`badge ${difficultyClass(art.difficulty)}`}>{difficultyLabel(art.difficulty)}</span>}
                  {art.date && <span>{formatDate(art.date)}</span>}
                </div>
                <h3 className="article-card-title"><Link href={`/article/${art.id}/${art.slug||''}`}>{art.title}</Link></h3>
                <div className="article-card-excerpt">{excerpt(art.excerpt, 60)}</div>
              </div>
            </article>
          ))}
        </div>
      ) : <div className="empty-state">記事がまだありません。</div>}
    </div>
  );
}
export default CategoryPage;
