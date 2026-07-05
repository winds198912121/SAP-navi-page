import { api } from '@/lib/api';
import { moduleColor, moduleName, difficultyLabel, difficultyClass, formatDate, excerpt, MODULE_DESCS } from '@/lib/utils';
import Link from 'next/link';
import QuizClient from '@/components/quiz/QuizClient';

async function HomePage() {
  const [articles, modules, paths, cases, videos, todayQuiz] = await Promise.all([
    api.getArticles({ per_page: 3 }),
    api.getModules(),
    api.getLearningPaths(),
    api.getCases({ per_page: 5 }),
    api.getVideos({ per_page: 6 }),
    api.getTodayQuiz(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>SAP学習は<br />パンダ先生におまかせ</h1>
              <p className="hero-subtitle">未経験からSAPコンサルタントへ。日本最大級のSAP学習プラットフォーム。</p>
              <div className="hero-actions">
                <Link href="/register" className="btn btn-primary btn-lg">無料で始める</Link>
                <Link href="/modules" className="btn btn-outline btn-lg">モジュールを見る</Link>
              </div>
            </div>
            <div className="hero-visual"><div className="hero-panda-emoji">🐼</div></div>
          </div>
        </div>
      </section>

      {/* Case Ticker */}
      {cases && cases.length > 0 && (
        <div className="case-ticker">
          <div className="container">
            <div className="case-ticker-track">
              {cases.concat(cases).map((c, i) => (
                <div key={i} className="case-ticker-item">
                  <span className="badge badge-accent" style={{color:'white',background:'var(--color-accent)'}}>NEW</span>
                  <span>{c.title}</span>
                  <span style={{opacity:0.6}}>{c.location}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modules */}
      <section className="section">
        <div className="container">
          <div className="section-title"><h2>SAPモジュール</h2><p>9つの主要モジュールを学ぶ</p></div>
          <div className="module-grid">
            {modules?.map(mod => {
              const slug = mod.slug || '';
              return (
                <Link key={slug} href={`/category/${slug}`} className="module-card">
                  <div className="module-icon" style={{ background: moduleColor(slug) }}>{slug.slice(0,2).toUpperCase()}</div>
                  <div className="module-info">
                    <h3>{moduleName(slug)}</h3>
                    <p>{MODULE_DESCS[slug] || ''}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="section" style={{background:'var(--color-bg-alt)'}}>
        <div className="container">
          <div className="section-title"><h2>新着記事</h2><p>最新のSAP学習コンテンツ</p></div>
          {articles && articles.length > 0 ? (
            <div className="article-list">
              {articles.map(art => (
                <article key={art.id} className="article-card">
                  <div className="article-card-body">
                    <div className="article-card-meta">
                      {art.module_slug && <span className="module-badge" style={{background:moduleColor(art.module_slug)}}>{art.module_slug.toUpperCase()}</span>}
                      {art.difficulty && <span className={`badge ${difficultyClass(art.difficulty)}`}>{difficultyLabel(art.difficulty)}</span>}
                      {art.date && <span>{formatDate(art.date)}</span>}
                    </div>
                    <h3 className="article-card-title"><Link href={`/article/${art.id}/${art.slug || ''}`}>{art.title}</Link></h3>
                    <div className="article-card-excerpt">{excerpt(art.excerpt, 60)}</div>
                  </div>
                </article>
              ))}
            </div>
          ) : <div className="empty-state"><p>記事がまだありません。</p></div>}
          <div className="text-center mt-2"><Link href="/search" className="btn btn-outline">すべての記事を見る</Link></div>
        </div>
      </section>

      {/* Learning Paths */}
      {paths && paths.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-title"><h2>学習パス</h2><p>目的別にステップアップ</p></div>
            <div className="path-list">
              {paths.slice(0,3).map(p => (
                <Link key={p.id} href={`/learning/${p.id}`} className="path-card">
                  <div className="path-card-header" style={{background: p.accent_color || moduleColor(p.module || '')}}>
                    <h3 className="path-card-title">{p.title}</h3>
                    <p className="path-card-subtitle">{p.target_audience}</p>
                  </div>
                  <div className="path-card-body">
                    <div className="path-card-meta"><span>📚 {p.steps?.length || 0}ステップ</span>{p.estimated_hours && <span>⏱ {p.estimated_hours}時間</span>}</div>
                    <p className="path-card-desc">{p.description}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-2"><Link href="/paths" className="btn btn-outline">すべての学習パスを見る</Link></div>
          </div>
        </section>
      )}

      {/* Quiz */}
      {todayQuiz && (
        <section className="section" style={{background:'var(--color-bg-alt)'}}>
          <div className="container">
            <div className="section-title"><h2>今日のクイズ</h2><p>毎日1問、SAP知識をチェック</p></div>
            <QuizClient quiz={todayQuiz} />
          </div>
        </section>
      )}

      {/* Videos */}
      {videos && videos.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-title"><h2>おすすめ動画</h2><p>SAP学習に役立つYouTube動画</p></div>
            <div className="grid-3">
              {videos.map(v => (
                <div key={v.id} className="card">
                  {v.thumbnail_url && <img src={v.thumbnail_url} alt="" style={{width:'100%',aspectRatio:'16/9',objectFit:'cover'}} />}
                  <div className="card-body">
                    <h3 className="card-title">{v.title}</h3>
                    <p className="card-text">{v.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-2"><Link href="/video" className="btn btn-outline">すべての動画を見る</Link></div>
          </div>
        </section>
      )}

      <style jsx>{`
        .hero-section { background: linear-gradient(135deg, var(--color-primary-bg), var(--color-bg)); padding: var(--spacing-3xl) 0; min-height: 500px; display: flex; align-items: center; }
        .hero-content { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-2xl); align-items: center; }
        .hero-text h1 { font-size: 2.75rem; line-height: 1.2; }
        .hero-subtitle { font-size: var(--text-lg); color: var(--color-text-light); margin-bottom: var(--spacing-lg); }
        .hero-actions { display: flex; gap: var(--spacing-md); margin-bottom: var(--spacing-xl); }
        .hero-panda-emoji { font-size: 12rem; animation: float 3s ease-in-out infinite; }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        .case-ticker { background: var(--color-bg-dark); color: white; padding: var(--spacing-md) 0; overflow: hidden; }
        .case-ticker-track { display: flex; gap: var(--spacing-xl); animation: scroll 30s linear infinite; white-space: nowrap; }
        .case-ticker-item { display: inline-flex; align-items: center; gap: var(--spacing-md); font-size: var(--text-sm); }
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @media (max-width: 1024px) { .hero-content { grid-template-columns: 1fr; text-align: center; } .hero-actions { justify-content: center; } .hero-panda-emoji { display: none; } }
        @media (max-width: 768px) { .hero-text h1 { font-size: 1.75rem; } }
      `}</style>
    </>
  );
}

export default HomePage;
