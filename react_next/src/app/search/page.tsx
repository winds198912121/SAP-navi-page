import { api } from '@/lib/api';
import { moduleColor, difficultyLabel, difficultyClass, excerpt } from '@/lib/utils';
import Link from 'next/link';

async function SearchPage({ searchParams: sp }: { searchParams: Promise<Record<string, string>> }) {
  const { q, module: mod, difficulty, sort } = await sp;
  const query = q || '';
  const params: Record<string, any> = {};
  if (query) params.q = query;
  if (mod) params.module = mod;
  if (difficulty) params.difficulty = difficulty;
  params.per_page = 20;
  const [results, modules] = await Promise.all([api.searchArticles(query, params), api.getModules()]);

  return (
    <div className="container" style={{paddingTop:'var(--spacing-xl)',paddingBottom:'var(--spacing-2xl)'}}>
      <h1>記事検索</h1>
      <form action="/search" method="GET" className="search-form-inline" style={{display:'flex',maxWidth:600,gap:'var(--spacing-sm)',marginBottom:'var(--spacing-xl)'}}>
        <input type="search" name="q" defaultValue={query} placeholder="キーワードを入力..." required className="form-input" />
        <button type="submit" className="btn btn-primary">検索</button>
      </form>
      {query && (
        <>
          <div className="filter-bar">
            <Link href={`/search?q=${encodeURIComponent(query)}`} className={`filter-btn ${!mod ? 'active' : ''}`}>すべて</Link>
            {modules?.map((m: any) => (
              <Link key={m.slug} href={`/search?q=${encodeURIComponent(query)}&module=${m.slug}`}
                className={`filter-btn ${mod === m.slug ? 'active' : ''}`}>{m.slug?.toUpperCase()}</Link>
            ))}
          </div>
          <p style={{color:'var(--color-text-lighter)',fontSize:'var(--text-sm)',marginBottom:'var(--spacing-lg)'}}>「{query}」の検索結果 {results?.length || 0}件</p>
          {results && results.length > 0 ? (
            <div className="article-list">
              {results.map((art: any) => (
                <article key={art.id} className="article-card">
                  <div className="article-card-body">
                    <div className="article-card-meta">
                      {art.module_slug && <span className="module-badge" style={{background:moduleColor(art.module_slug)}}>{art.module_slug.toUpperCase()}</span>}
                      {art.difficulty && <span className={`badge ${difficultyClass(art.difficulty)}`}>{difficultyLabel(art.difficulty)}</span>}
                    </div>
                    <h3 className="article-card-title"><Link href={`/article/${art.id}/${art.slug||''}`}>{art.title}</Link></h3>
                    <div className="article-card-excerpt">{excerpt(art.excerpt, 60)}</div>
                  </div>
                </article>
              ))}
            </div>
          ) : <div className="empty-state"><div className="empty-state-icon">🔍</div><p>該当する記事が見つかりませんでした。</p></div>}
        </>
      )}
    </div>
  );
}
export default SearchPage;
