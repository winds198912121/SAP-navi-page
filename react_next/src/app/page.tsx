import { api } from '@/lib/api';
import { moduleColor, getModuleSlug, getDifficultySlug, getArticleDate, difficultyLabel, formatDate, excerpt, MODULE_DESCS, getPathField } from '@/lib/utils';
import Link from 'next/link';
import QuizClient from '@/components/quiz/QuizClient';
import HeroCta from '@/components/home/HeroCta';
import HeroScene from '@/components/home/HeroScene';
import CasesSection from '@/components/home/CasesSection';

const TOP10 = [
  '【保存版】SAP用語集 — はじめての100単語',
  'BAPI とは何か、なぜ使うのか — 5分で理解',
  'Fiori vs SAP GUI — 結局どう使い分ける？',
  'T-Code 早見表（よく使う 50 個）',
  'ABAP オブジェクト指向 完全入門',
  'MMの移動タイプ、覚えるならこの10個',
  'S/4HANA 1909 → 2023 アップグレード手順',
  '新人コンサルが最初に読むべき本ベスト5',
  'BW/4HANA で BI 案件に挑戦するには',
  'パンダ先生に聞く：転職タイミングの見極め方',
];

async function HomePage() {
  let [articles, modules, paths, cases, videos, todayQuiz] = await Promise.all([
    api.getArticles({ per_page: 3 }),
    api.getModules(),
    api.getLearningPaths(),
    api.getCases({ per_page: 5 }),
    api.getVideos({ per_page: 8 }),
    api.getTodayQuiz(),
  ]);
  // Fallback: use seed data when API is unavailable
  if (!articles || articles.length === 0) articles = [ { id:1,title:'【保存版】SAP用語集 — はじめての100単語',slug:'sap-glossary',excerpt:'SAPに出てくる専門用語を100個厳選',module:{slug:'fi',name:'財務会計'},difficulty:{slug:'beginner',name:'初級'},reading_time:15,views:12500,created_at:new Date().toISOString(),author:{display_name:'パンダ先生'} }, { id:2,title:'BAPI とは何か、なぜ使うのか',slug:'bapi-intro',excerpt:'SAPの拡張開発でよく聞くBAPIを5分で解説',module:{slug:'abap',name:'ABAP'},difficulty:{slug:'intermediate',name:'中級'},reading_time:5,views:8200,created_at:new Date().toISOString(),author:{display_name:'パンダ先生'} }, { id:3,title:'Fiori vs SAP GUI — 結局どう使い分ける？',slug:'fiori-vs-gui',excerpt:'モダンFioriとクラシックGUIの比較',module:{slug:'s4',name:'S/4HANA'},difficulty:{slug:'beginner',name:'初級'},reading_time:8,views:6100,created_at:new Date().toISOString(),author:{display_name:'パンダ先生'} }, ];
  if (!modules || modules.length === 0) modules = [ {slug:'fi',code:'FI',name_ja:'財務会計',name_en:'Financial Accounting',description:'会計帳簿、決算、勘定科目。',color:'#2f6d44',bg_color:'#d8ead9',article_count:48,levels:['初級','中級','上級']}, {slug:'co',code:'CO',name_ja:'管理会計',name_en:'Controlling',description:'原価計算、利益分析、予算管理。',color:'#2641a1',bg_color:'#dde4fc',article_count:32,levels:['初級','中級']}, {slug:'mm',code:'MM',name_ja:'購買・在庫',name_en:'Material Management',description:'購買依頼から入庫まで。',color:'#a25411',bg_color:'#fde0c2',article_count:41,levels:['初級','中級','上級']}, {slug:'sd',code:'SD',name_ja:'販売管理',name_en:'Sales & Distribution',description:'受注、出荷、請求。',color:'#b62a4a',bg_color:'#ffdfe6',article_count:36,levels:['初級','中級','上級']}, {slug:'pp',code:'PP',name_ja:'生産計画',name_en:'Production Planning',description:'MRP、BOM、製造指示。',color:'#4828a8',bg_color:'#e4dffb',article_count:22,levels:['中級','上級']}, {slug:'hr',code:'HR',name_ja:'人事管理',name_en:'Human Resources',description:'人事マスタ、給与、勤怠。',color:'#8a6212',bg_color:'#fee9b3',article_count:18,levels:['初級','中級']}, {slug:'abap',code:'ABAP',name_ja:'開発言語',name_en:'ABAP',description:'SAP独自の開発言語。',color:'#1f6f6f',bg_color:'#cfecec',article_count:54,levels:['初級','中級','上級']}, {slug:'basis',code:'Basis',name_ja:'基盤管理',name_en:'Basis',description:'システム運用、権限、パッチ。',color:'#4a432d',bg_color:'#e3e1d8',article_count:26,levels:['中級','上級']}, {slug:'s4',code:'S/4',name_ja:'S/4HANA',name_en:'Next-gen ERP',description:'次世代ERP。',color:'#1864a3',bg_color:'#d1ecf9',article_count:39,levels:['初級','中級','上級']} ];
  if (!paths || paths.length === 0) paths = [ {id:1,audience:'新人さん向け',title:'SAPって何？からはじめる入門コース',description:'初日からつまずきがちな用語と基本フローをやさしく整理。',accent:'#5a9d6e',duration:'約3週間',steps:[{title:'SAPの世界観を知る',time:'20 min',},{title:'GUI操作の基本',time:'30 min',},{title:'マスタとトランザクション',time:'40 min',},{title:'はじめての仕訳入力',time:'45 min',}]}, {id:2,audience:'コンサル中級',title:'プロジェクトで通用する設計力',description:'Fit/Gap、業務プロセス設計、カスタマイズ判断。',accent:'#d97548',duration:'約6週間',steps:[{title:'要件定義の進め方',time:'50 min',},{title:'組織構造の設計',time:'60 min',},{title:'マスタ設計のコツ',time:'45 min',},{title:'テストシナリオ作成',time:'40 min',}]}, {id:3,audience:'開発者向け',title:'ABAP × S/4HANA モダン開発',description:'CDS Views、AMDP、RAP — 新世代のABAP開発。',accent:'#d96570',duration:'約8週間',steps:[{title:'モダンABAP構文',time:'40 min',},{title:'CDS Views入門',time:'55 min',},{title:'ODataサービス公開',time:'50 min',},{title:'Fiori連携の基礎',time:'60 min',}]} ];
  if (!videos || videos.length === 0) videos = [ {id:1,title:'SAPとは？初心者向け解説',youtube_id:'dQw4w9WgXcQ',duration:'15:32',module:{slug:'fi',name:'財務会計'}}, {id:2,title:'FIモジュール入門',youtube_id:'dQw4w9WgXcQ',duration:'22:18',module:{slug:'fi',name:'財務会計'}}, {id:3,title:'MM購買プロセスを完全理解',youtube_id:'dQw4w9WgXcQ',duration:'18:45',module:{slug:'mm',name:'購買管理'}}, {id:4,title:'ABAPプログラミング超入門',youtube_id:'dQw4w9WgXcQ',duration:'35:00',module:{slug:'abap',name:'開発言語'}}, {id:5,title:'S/4HANA の新機能',youtube_id:'dQw4w9WgXcQ',duration:'12:30',module:{slug:'s4',name:'S/4HANA'}}, {id:6,title:'SD販売管理の全体像',youtube_id:'dQw4w9WgXcQ',duration:'20:10',module:{slug:'sd',name:'販売管理'}} ];

  return (
    <>
      <div className="page-bg" />

      {/* Hero */}
      <section className="hero">
        <div className="hero-text">
          <div className="hero-eyebrow">
            <span className="ico">P</span>
            パンダ先生 × たろうくんと、SAPを学ぼう
          </div>
          <h1>
            SAPの世界を、<br />
            <span className="wave-under">もっと身近に</span>。
          </h1>
          <p className="lead">
            財務・購買・販売・生産・人事 — むずかしい SAP のしくみを、
            パンダ先生がやさしく解説。たろうくん（24歳・SAP学習中）と一緒に、
            「わからない…！」から「なるほど！」へ。
          </p>
          <HeroCta />
          <div className="hero-stats">
            <div className="hero-stat"><div className="v">{(articles?.length || 48).toLocaleString()}<small>本</small></div><div className="l">公開記事</div></div>
            <div className="hero-stat"><div className="v">{modules?.length || 9}<small>モジュール</small></div><div className="l">主要モジュール網羅</div></div>
            <div className="hero-stat"><div className="v">24,800<small>+</small></div><div className="l">月間読者</div></div>
          </div>
        </div>
        <HeroScene />
      </section>

      <CasesSection />

      {/* Modules */}
      <section className="section" id="modules">
        <div className="section-head">
          <div>
            <div className="label">Modules Guide</div>
            <h2>モジュール別ガイド<span className="accent-mark">.</span></h2>
          </div>
          <div className="desc">
            SAP の世界は広い。<br />
            でも大丈夫、パンダ先生がモジュールごとに案内します。
          </div>
        </div>
        <div className="module-grid">
          {modules?.map((m: any) => {
            const slug = m.slug || '';
            const color = m.color || moduleColor(slug);
            const bg = m.bg_color || `${color}20`;
            return (
              <Link key={slug} href={`/category/${slug}`} className="mod-card"
                style={{ '--card-color': color, '--card-bg': bg } as React.CSSProperties}>
                <div className="mod-top">
                  <div className="mod-icon">{m.code || slug.toUpperCase()}</div>
                </div>
                <div className="mod-name-ja">{m.name_ja || slug.toUpperCase()}</div>
                <div className="mod-code">{m.name_en || ''} · {m.code || slug.toUpperCase()}</div>
                <div className="mod-desc">{m.description || ''}</div>
                <div className="mod-foot">
                  <span className="count">{m.article_count || 0}本<span>の記事</span></span>
                  {(m.levels || []).length > 0 && (
                    <div className="level-tags">
                      {m.levels.map((lv: string, j: number) => (<span key={j} className={`level-pill l${j + 1}`}>{lv}</span>))}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Learning Paths */}
      <section className="section" id="paths">
        <div className="section-head">
          <div>
            <div className="label">Learning Path</div>
            <h2>あなたに合わせた学習パス<span className="accent-mark">.</span></h2>
          </div>
          <div className="desc">
            バラバラの記事じゃなくて、目的別に組まれたコース。<br />
            順番に読めば、自然と SAP がわかってくる。
          </div>
        </div>
        <div className="path-grid">
          {(paths && paths.length > 0 ? paths.slice(0, 3) : []).map((p: any, i: number) => {
            const accent = p.accent || (i === 0 ? '#5a9d6e' : i === 1 ? '#d97548' : '#d96570');
            return (
              <Link key={p.id} href={`/learning/${p.id}`}
                className={`path-card${i === 0 ? ' p1' : i === 1 ? ' p2' : i === 2 ? ' p3' : ''}`}
                style={{ textDecoration: 'none', '--accent-color': accent } as React.CSSProperties}>
                <div className="num">{String(i + 1).padStart(2, '0')}</div>
                <div className="audience">{getPathField(p, 'target_audience') || p.audience || '全レベル'}</div>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                {(p.steps || []).length > 0 && (
                  <div className="path-steps">
                    {(p.steps || []).slice(0, 4).map((s: any, j: number) => (
                      <div key={j} className="path-step">
                        <span className="step-num">{j + 1}</span>
                        <span className="step-title">{s.title}</span>
                        <span className="step-time">{s.time || ''}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="path-meta">
                  <span>📚 {p.steps?.length || 0}ステップ · {p.duration || ''}</span>
                  <span className="arrow">パスを開始 →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Articles + Ranking */}
      <section className="section" id="articles" style={{ background: 'var(--bg-1)' }}>
        <div className="section-head">
          <div>
            <div className="label">Latest Articles</div>
            <h2>新着記事<span className="accent-mark">.</span></h2>
          </div>
          <div className="desc">毎週更新。読むだけで SAP 力が上がる記事を厳選。</div>
        </div>
        <div className="articles-grid">
          <div className="article-list">
            {articles && articles.length > 0 ? (
              articles.map((art: any) => {
                const modSlug = getModuleSlug(art);
                const diffSlug = getDifficultySlug(art);
                const diffLevel = diffSlug === 'beginner' ? 'l1' : diffSlug === 'intermediate' ? 'l2' : 'l3';
                return (
                  <Link key={art.id} href={`/article/${art.id}/${art.slug || ''}`}
                    className="article-row" style={{ textDecoration: 'none', display: 'grid' }}>
                    <div className="article-thumb" style={{ background: modSlug ? moduleColor(modSlug) + '22' : 'var(--bg-tint)' }}>
                      <svg viewBox="0 0 120 88" style={{ width: '100%', height: '100%' }}>
                        <rect width="120" height="88" fill={modSlug ? moduleColor(modSlug) + '22' : 'var(--bg-tint)'} />
                        <text x="60" y="48" fontSize="22" fontWeight="800" fill={modSlug ? moduleColor(modSlug) : 'var(--ink-3)'} textAnchor="middle" fontFamily="monospace">
                          {modSlug?.toUpperCase() || '?'}
                        </text>
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="article-meta-top">
                        {modSlug && <span className={`tag-mod ${modSlug}`}>{modSlug.toUpperCase()}</span>}
                        {diffSlug && <span className={`tag-diff ${diffLevel}`}>{difficultyLabel(diffSlug)}</span>}
                      </div>
                      <h3>{art.title}</h3>
                      <div className="excerpt">{excerpt(art.excerpt, 80)}</div>
                      <div className="article-meta-bot">
                        <span>{art.author?.display_name || art.author?.displayName || 'パンダ先生'}</span>
                        <span>·</span>
                        <span>{formatDate(getArticleDate(art))}</span>
                        <span>·</span>
                        <span>{art.reading_time || 5} min read</span>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>読み込み中...</div>
            )}
          </div>
          <div>
            <div className="top10">
              <div className="top10-head">
                <span className="badge">RANKING</span>
                <h3>よく読まれている記事</h3>
              </div>
              {TOP10.map((t, i) => (
                <div key={i} className="top10-item">
                  <div className="rank-num">{String(i + 1).padStart(2, '0')}</div>
                  <div><h4>{t}</h4></div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Link href="/search" className="btn btn-sm">すべての記事を見る</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz */}
      {todayQuiz && (
        <section className="section">
          <div className="section-head">
            <div>
              <div className="label">Daily Quiz</div>
              <h2>今日のクイズ<span className="accent-mark">.</span></h2>
            </div>
            <div className="desc">毎日1問、SAP知識をチェック</div>
          </div>
          <QuizClient quiz={todayQuiz} />
        </section>
      )}

      {/* YouTube */}
      {videos && videos.length > 0 && (
        <section className="section">
          <div className="section-head">
            <div>
              <div className="label">YouTube</div>
              <h2>パンダ先生の動画講座<span className="accent-mark">.</span></h2>
            </div>
            <div className="desc">SAP の操作画面を動画で確認。通勤・隙間時間に。</div>
          </div>
          <div className="yt-section">
            <div className="yt-videos">
              {videos.slice(0, 4).map((v: any) => (
                <a key={v.id} href={v.youtube_id ? `https://youtube.com/watch?v=${v.youtube_id}` : '#'} target="_blank" rel="noopener noreferrer" className="yt-vid" style={{ textDecoration: 'none' }}>
                  <div className="vid-thumb">
                    {v.youtube_id ? <img src={`https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg`} alt={v.title} /> : <div style={{ width: '100%', height: '100%', background: 'var(--bg-tint)', display: 'grid', placeItems: 'center', color: 'var(--ink-3)', fontSize: 24 }}>📹</div>}
                  </div>
                  <div className="vid-info"><h4>{v.title}</h4><span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{v.duration || ''}</span></div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="section">
        <div className="newsletter">
          <div className="nl-mascot" style={{ fontSize: '4rem', lineHeight: 1, textAlign: 'center' }}>🐼</div>
          <div className="nl-text">
            <h3>週末のニュースレター 🎋</h3>
            <p>一週間の SAP ニュース、新着記事、パンダ先生の独り言を、土曜の朝にお届け。</p>
          </div>
          <form className="nl-form" action="#">
            <input type="email" name="email" placeholder="your@email.com" required />
            <button className="btn primary" type="submit">登録</button>
          </form>
        </div>
      </section>
    </>
  );
}

export default HomePage;
