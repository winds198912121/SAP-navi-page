import { api } from '@/lib/api';
import { moduleColor, difficultyLabel, difficultyClass, formatDate, stripHtml } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Reactions from '@/components/article/Reactions';

interface Props { params: Promise<{ id: string; slug: string }> }
export const revalidate = 60;

async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await api.getArticle(Number(id));
  if (!article) notFound();

  const content = article.content || '';
  const isLocked = false; // Server-side, we show full content

  return (
    <article className="article-detail">
      <div className="article-hero" style={{background:`linear-gradient(135deg, ${moduleColor(article.module_slug||'')}15, var(--color-bg))`}}>
        <div className="container">
          <div className="article-header">
            <nav className="breadcrumb">
              <Link href="/">ホーム</Link>
              <span className="separator">›</span>
              {article.module_slug && <><Link href={`/category/${article.module_slug}`}>{article.module_slug.toUpperCase()}</Link><span className="separator">›</span></>}
              <span>{article.title?.slice(0,30)}</span>
            </nav>
            <h1>{article.title}</h1>
            <div className="article-header-meta">
              {article.module_slug && <span className="module-badge" style={{background:moduleColor(article.module_slug)}}>{article.module_slug.toUpperCase()}</span>}
              {article.difficulty && <span className={`badge ${difficultyClass(article.difficulty)}`}>{difficultyLabel(article.difficulty)}</span>}
              {article.date && <span>📅 {formatDate(article.date)}</span>}
              <span>📖 {article.reading_time || 5}分で読めます</span>
              {article.author_name && <span>✍️ {article.author_name}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="article-body container">
        <aside className="article-toc">
          <div className="article-toc-inner">
            <div className="article-toc-title">目次</div>
            <Toc content={content} />
          </div>
        </aside>
        <div className="article-content" dangerouslySetInnerHTML={{ __html: content }} />
      </div>

      <div className="container">
        <Reactions articleId={Number(id)} reactions={article.reactions} />
      </div>

      <style jsx>{`
        .article-detail { padding-bottom: var(--spacing-2xl); }
        .article-hero { padding: var(--spacing-2xl) 0; margin-bottom: var(--spacing-xl); }
        .article-header { text-align: center; max-width: var(--container-narrow); margin: 0 auto; }
        .article-header h1 { font-size: var(--text-4xl); }
        .article-header-meta { display: flex; justify-content: center; gap: var(--spacing-md); flex-wrap: wrap; font-size: var(--text-sm); color: var(--color-text-light); margin-top: var(--spacing-md); }
        .article-body { display: grid; grid-template-columns: 220px 1fr; gap: var(--spacing-xl); margin-top: var(--spacing-xl); }
        .article-toc { position: sticky; top: calc(var(--header-height) + var(--spacing-lg)); align-self: start; }
        .article-toc-inner { background: var(--color-bg-card); border: 1px solid var(--color-border-light); border-radius: var(--radius-lg); padding: var(--spacing-md); }
        .article-toc-title { font-family: var(--font-heading); font-size: var(--text-sm); font-weight: 700; margin-bottom: var(--spacing-sm); padding-bottom: var(--spacing-sm); border-bottom: 1px solid var(--color-border-light); }
        .article-content { font-size: var(--text-base); line-height: 1.9; }
        .article-content :global(h2) { margin-top: var(--spacing-2xl); padding-bottom: var(--spacing-sm); border-bottom: 2px solid var(--color-primary-bg); }
        .article-content :global(h3) { margin-top: var(--spacing-xl); }
        .article-content :global(p) { margin-bottom: var(--spacing-lg); }
        .article-content :global(img) { border-radius: var(--radius-lg); margin: var(--spacing-lg) 0; max-width: 100%; height: auto; }
        .article-content :global(pre) { background: #1a1a2e; color: #e0e0e0; padding: var(--spacing-lg); border-radius: var(--radius-md); overflow-x: auto; font-family: var(--font-mono); font-size: var(--text-sm); margin: var(--spacing-lg) 0; }
        .article-content :global(code) { font-family: var(--font-mono); background: var(--color-primary-bg); padding: 2px 6px; border-radius: var(--radius-sm); }
        .article-content :global(pre code) { background: none; padding: 0; }
        .article-content :global(blockquote) { border-left: 4px solid var(--color-primary); margin: var(--spacing-lg) 0; padding: var(--spacing-md) var(--spacing-lg); background: var(--color-primary-bg); border-radius: 0 var(--radius-md) var(--radius-md) 0; }
        @media (max-width: 1024px) { .article-body { grid-template-columns: 1fr; } .article-toc { display: none; } }
      `}</style>
    </article>
  );
}

function Toc({ content }: { content: string }) {
  const headings = content.match(/<h[23][^>]*id="([^"]*)"[^>]*>(.*?)<\/h[23]>/g) || [];
  return (
    <ul className="toc-list" style={{listStyle:'none',padding:0,margin:0}}>
      {headings.map((h, i) => {
        const id = h.match(/id="([^"]*)"/)?.[1] || `h-${i}`;
        const text = stripHtml(h.match(/>([^<]*)</)?.[1] || '');
        const isH3 = h.startsWith('<h3');
        return (
          <li key={i} style={{margin:0}}>
            <a href={`#${id}`} style={{display:'block',padding:'4px 0',fontSize:'var(--text-xs)',color:'var(--color-text-light)',borderBottom:'1px solid var(--color-border-light)',paddingLeft: isH3 ? '16px' : '0'}}>{text}</a>
          </li>
        );
      })}
    </ul>
  );
}

export default ArticlePage;
