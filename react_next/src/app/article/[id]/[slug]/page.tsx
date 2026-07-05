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
