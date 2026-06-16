// ===========================================================
// HOME — Hero, Modules, Paths, Articles, Quiz, YouTube, Newsletter
// ===========================================================

const { useState: useStateH, useEffect: useEffectH } = React;

// ---------- Hero ----------
function Hero() {
  return (
    <section className="hero">
      <div className="hero-text">
        <div className="hero-eyebrow">
          <span className="ico">P</span>
          パンダ先生 × たろうくんと、SAPを学ぼう
          <span className="dot"></span>
        </div>
        <h1>
          SAPの世界を、<br/>
          <span className="wave-under">もっと身近に</span><span className="accent-mark">。</span>
        </h1>
        <p className="lead">
          財務・購買・販売・生産・人事 — むずかしい SAP のしくみを、
          パンダ先生がやさしく解説。たろうくん（24歳・SAP学習中）と一緒に、
          「わからない…！」から「なるほど！」へ。
        </p>
        <div className="hero-ctas">
          <button className="btn primary" type="button">
            学習パスを見る
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button>
          <button className="btn" type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
            記事を探す
          </button>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="v">316<small>本</small></div>
            <div className="l">公開記事</div>
          </div>
          <div className="hero-stat">
            <div className="v">9<small>モジュール</small></div>
            <div className="l">主要モジュール網羅</div>
          </div>
          <div className="hero-stat">
            <div className="v">24,800<small>+</small></div>
            <div className="l">月間読者</div>
          </div>
        </div>
      </div>
      <div className="hero-scene">
        <div className="floor"></div>
        <div className="blackboard">
          <ChalkBoard />
        </div>
        <div className="hero-panda-wrap">
          <PandaSensei pose="pointer" mood="happy" />
        </div>
        <div className="hero-student-wrap">
          <Student pose="cheer" mood="happy" />
        </div>
        <div className="hero-callouts">
          <div className="callout c1">
            <div className="em" style={{ background: '#2f6d44' }}>FI</div>
            <div>
              財務会計
              <small>新着 3 本</small>
            </div>
          </div>
          <div className="callout c2">
            <div className="em" style={{ background: '#1f6f6f' }}>{'<>'}</div>
            <div>
              ABAP入門
              <small>初心者向け</small>
            </div>
          </div>
          <div className="callout c3">
            <div className="em" style={{ background: '#b62a4a' }}>SD</div>
            <div>
              受注プロセス
              <small>人気 ★</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChalkBoard() {
  return (
    <>
      <div className="chalk-text title">📐 今日のテーマ：仕訳のしくみ</div>
      <div className="chalk-text formula" style={{ top: 48 }}>
        <span className="yel">借方</span> = <span className="pink">貸方</span>
      </div>
      <div className="chalk-text formula" style={{ top: 74, fontSize: 13 }}>
        現金 100 / <span className="grn">売上 100</span>
      </div>
      <svg viewBox="0 0 100 80" preserveAspectRatio="none" style={{ position: 'absolute', top: 38, right: 10, width: '38%', height: '52%' }}>
        {/* T-account diagram in chalk */}
        <line x1="50" y1="14" x2="50" y2="76" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />
        <line x1="10" y1="24" x2="90" y2="24" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />
        <text x="25" y="20" fontSize="7" fill="rgba(255,224,132,0.95)" fontFamily="Caveat" fontWeight="700">借方</text>
        <text x="62" y="20" fontSize="7" fill="rgba(255,179,196,0.95)" fontFamily="Caveat" fontWeight="700">貸方</text>
        <text x="20" y="40" fontSize="6.5" fill="rgba(255,255,255,0.85)" fontFamily="Caveat">現金 100</text>
        <text x="55" y="40" fontSize="6.5" fill="rgba(184,232,176,0.95)" fontFamily="Caveat">売上 100</text>
        <text x="20" y="58" fontSize="6.5" fill="rgba(255,255,255,0.75)" fontFamily="Caveat">受取手形 50</text>
        <text x="55" y="58" fontSize="6.5" fill="rgba(184,232,176,0.85)" fontFamily="Caveat">受取利息 50</text>
        {/* small arrow */}
        <path d="M 30 68 Q 45 76 60 68" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" strokeDasharray="2,2" />
        <path d="M 56 66 L 62 68 L 58 72" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" strokeLinecap="round" />
      </svg>
      {/* chalk dust at bottom */}
      <div style={{ position: 'absolute', left: 6, right: 6, bottom: 4, height: 6, background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.08))', borderRadius: 4 }}></div>
    </>
  );
}

// ---------- Modules grid ----------
function ModulesSection() {
  return (
    <section className="section" id="modules">
      <div className="section-head">
        <div>
          <div className="label">Module Guide</div>
          <h2>モジュール別ガイド<span className="accent-mark">.</span></h2>
        </div>
        <div className="desc">
          自分の担当 / 興味のあるモジュールから始めよう。<br/>
          すべて 初級 → 上級 まで段階的に整理されています。
        </div>
      </div>
      <Reveal>
        <div className="module-grid">
          {SAP_MODULES.map((m, i) => (
            <a key={m.code} href={`category.html?m=${m.slug}`}
              className="mod-card"
              style={{ '--card-color': m.color, '--card-bg': m.bg }}>
              <div className="mod-top">
                <div className="mod-icon">{m.code}</div>
              </div>
              <div className="mod-peek"><PandaPeek /></div>
              <div className="mod-name-ja">{m.ja}</div>
              <div className="mod-code">{m.en}</div>
              <div className="mod-desc">{m.desc}</div>
              <div className="mod-foot">
                <span className="count">{m.count}本</span>
                <span>の記事</span>
                <div className="level-tags">
                  {m.levels.map((lv, j) => (
                    <span key={j} className={"level-pill l" + (j+1)}>{lv}</span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

// ---------- Learning Paths ----------
function PathsSection() {
  const paths = [
    {
      audience: '新人さん向け', title: 'SAPって何？からはじめる入門コース',
      desc: '初日からつまずきがちな用語と基本フローをやさしく整理。3週間で全体像をつかむ。',
      steps: [
        { t: 'SAPの世界観を知る', m: '20 min' },
        { t: 'GUI 操作の基本', m: '30 min' },
        { t: 'マスタとトランザクション', m: '40 min' },
        { t: 'はじめての仕訳入力', m: '45 min' }
      ],
      duration: '約 3 週間 · 12 本'
    },
    {
      audience: 'コンサル中級', title: 'プロジェクトで通用する設計力',
      desc: 'Fit/Gap、業務プロセス設計、カスタマイズ判断。経験 1〜3 年目のあなたに。',
      steps: [
        { t: '要件定義の進め方', m: '50 min' },
        { t: '組織構造の設計', m: '60 min' },
        { t: 'マスタ設計のコツ', m: '45 min' },
        { t: 'テストシナリオ作成', m: '40 min' }
      ],
      duration: '約 6 週間 · 18 本'
    },
    {
      audience: '開発者向け', title: 'ABAP × S/4HANA モダン開発',
      desc: 'CDS Views、AMDP、RAP — 新世代の ABAP 開発作法をパンダ先生と一緒に。',
      steps: [
        { t: 'モダン ABAP 構文', m: '40 min' },
        { t: 'CDS Views 入門', m: '55 min' },
        { t: 'OData サービス公開', m: '50 min' },
        { t: 'Fiori 連携の基礎', m: '60 min' }
      ],
      duration: '約 8 週間 · 24 本'
    }
  ];
  return (
    <section className="section" id="paths">
      <div className="section-head">
        <div>
          <div className="label">Learning Path</div>
          <h2>あなたに合わせた学習パス<span className="accent-mark">.</span></h2>
        </div>
        <div className="desc">
          バラバラの記事じゃなくて、目的別に組まれたコース。<br/>
          順番に読めば、自然と SAP がわかってくる。
        </div>
      </div>
      <Reveal>
        <div className="path-grid">
          {paths.map((p, i) => (
            <div key={i} className={"path-card p" + (i+1)}>
              <div className="num">{String(i+1).padStart(2,'0')}</div>
              <div className="audience">{p.audience}</div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <div className="path-steps">
                {p.steps.map((s, j) => (
                  <div key={j} className="path-step">
                    <span className="step-num">{j+1}</span>
                    <span>{s.t}</span>
                    <span className="step-time">{s.m}</span>
                  </div>
                ))}
              </div>
              <div className="path-meta">
                <span>{p.duration}</span>
                <span className="arrow">パスを開始 →</span>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

// ---------- Articles + Top10 ----------
const LATEST_ARTICLES = [
  { mod: 'FI', modLabel: '財務会計', diff: 1, title: '「仕訳」って結局なに？借方・貸方の覚え方をパンダ先生が一発で解説',
    excerpt: '簿記の本を読んでも頭に入らない…そんなあなたへ。覚えるべきは「左右がイコール」というたった一つのルールだけ。',
    author: 'パンダ先生', date: '3日前', mins: 6, views: '12.4k', cover: 'fi', scene: 'class' },
  { mod: 'ABAP', modLabel: 'ABAP', diff: 2, title: 'SELECT 文のパフォーマンス改善 — INDEX を使うべき5つの場面',
    excerpt: '本番環境で動かないコードはコードじゃない。実例コード付きで、明日から効く ABAP の高速化テクニックを。',
    author: 'タナカ', date: '5日前', mins: 12, views: '8.7k', cover: 'abap', scene: 'learning' },
  { mod: 'MM', modLabel: '購買・在庫', diff: 1, title: '購買依頼 → 注文 → 入庫 → 請求 — MM の基本フロー完全図解',
    excerpt: '伝票がどう変わっていくのか、図でつかむ。新人配属時に「これ知ってる前提」とされがちなあの流れを。',
    author: 'パンダ先生', date: '1週間前', mins: 8, views: '15.2k', cover: 'mm', scene: 'blackboard' },
  { mod: 'S/4', modLabel: 'S/4HANA', diff: 3, title: 'ECC からの移行プロジェクト — 失敗パターン7選と対策',
    excerpt: 'Brownfield か Greenfield か。現役 PM が語る、ふつうの記事には書いてない泥臭い話。',
    author: 'サトウ', date: '1週間前', mins: 15, views: '9.1k', cover: 's4', scene: 'class' },
  { mod: 'CO', modLabel: '管理会計', diff: 2, title: '原価センタと利益センタ、ぶっちゃけ何が違うの？',
    excerpt: '似てるけど別物。組織構造をどう設計すべきか、現場の意思決定とどう繋がるかを実例で。',
    author: 'パンダ先生', date: '10日前', mins: 7, views: '6.5k', cover: 'co', scene: 'highfive' }
];

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
  'パンダ先生に聞く：転職タイミングの見極め方'
];

function ArticlesSection() {
  return (
    <section className="section" id="articles">
      <div className="section-head">
        <div>
          <div className="label">Latest</div>
          <h2>新着記事<span className="accent-mark">.</span></h2>
        </div>
        <div className="desc">
          毎週 月・木 に新しい記事を公開。<br/>
          パンダ先生 + 執筆チームがじっくり書いています。
        </div>
      </div>
      <div className="articles-grid">
        <div className="article-list">
          {LATEST_ARTICLES.map((a, i) => (
            <a key={i} className="article-row" href={`article.html?scene=${a.scene || 'class'}`}>
              <div className="article-thumb"><ArticleCoverSVG type={a.cover} /></div>
              <div>
                <div className="article-meta-top">
                  <span className={"tag-mod " + a.cover}>{a.mod}</span>
                  <span className={"tag-diff l" + a.diff}>
                    {a.diff === 1 ? '初級' : a.diff === 2 ? '中級' : '上級'}
                  </span>
                  <span>· {a.date}</span>
                </div>
                <h3>{a.title}</h3>
                <p className="excerpt">{a.excerpt}</p>
                <div className="article-meta-bot">
                  <span className="author">
                    <span className="author-av"></span>
                    {a.author}
                  </span>
                  <span>📖 {a.mins} min read</span>
                  <span className="views">{a.views}</span>
                </div>
              </div>
            </a>
          ))}
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <button className="btn" type="button">もっと記事を見る →</button>
          </div>
        </div>

        <div className="top10">
          <div className="top10-head">
            <span className="badge">TOP 10</span>
            <h3>今週の人気記事</h3>
          </div>
          {TOP10.map((t, i) => (
            <a key={i} className={"top10-item t" + (i+1)} href="article.html">
              <div className="rank-num">{String(i+1).padStart(2,'0')}</div>
              <div>
                <h4>{t}</h4>
                <div className="meta">
                  <span>{['FI','ABAP','S/4','基本','ABAP','MM','S/4','キャリア','BW','キャリア'][i]}</span>
                  <span>·</span>
                  <span>{[24.1, 18.5, 16.2, 14.8, 12.3, 11.9, 10.4, 9.8, 8.7, 7.5][i]}k views</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Quiz ----------
const QUIZ_QUESTIONS = [
  {
    q: '次のうち、SAP FI モジュールの主要な仕訳タイプとして「ない」ものはどれ？',
    options: [
      'SA：一般仕訳',
      'KR：仕入先請求書',
      'DR：得意先請求書',
      'XX：在庫移動仕訳'
    ],
    correct: 3,
    explain: '「XX」というドキュメントタイプは標準にはありません。在庫移動は FI ではなく MM 領域の話で、勘定タイプとは別物。FI の伝票タイプ（SA/KR/DR等）と MM の移動タイプ（101/261等）は混同しがち！'
  },
  {
    q: 'ABAP で SELECT ... INTO TABLE を高速に動かすコツとして「正しくない」のは？',
    options: [
      'WHERE 句にキー項目を入れる',
      'INTO CORRESPONDING FIELDS を使う',
      '必要な列だけ取得する',
      '内部テーブルを事前に CLEAR する'
    ],
    correct: 1,
    explain: 'INTO CORRESPONDING FIELDS はマッピング処理が入るので「遅くなる」原因に！カラム順をきっちり合わせた構造で INTO TABLE するのが速いです。'
  }
];

function QuizSection() {
  const [qi, setQi] = useStateH(0);
  const [picked, setPicked] = useStateH(null);
  const Q = QUIZ_QUESTIONS[qi];
  const reveal = picked !== null;

  function pick(i) {
    if (reveal) return;
    setPicked(i);
  }
  function next() {
    setQi((qi + 1) % QUIZ_QUESTIONS.length);
    setPicked(null);
  }

  return (
    <section className="section" id="quiz">
      <div className="section-head">
        <div>
          <div className="label">Daily Quiz</div>
          <h2>パンダ先生の<span className="accent-mark">今日の一問</span></h2>
        </div>
        <div className="desc">
          5秒でわかる、SAP のあるあるクイズ。<br/>
          連続正解で「パンダバッジ」がもらえるよ。
        </div>
      </div>
      <Reveal>
      <div className="quiz-card">
        <div className="quiz-left">
          <div className="quiz-eyebrow">
            <span className="sun"></span>
            今日の問題 · No.{String(qi + 318).padStart(3,'0')}
          </div>
          <div className="question-num">2026.05.22 · 難易度 ★★☆</div>
          <h3>{Q.q}</h3>
          <div className="quiz-options">
            {Q.options.map((opt, i) => {
              const isCorrect = i === Q.correct;
              let cls = "quiz-opt";
              if (reveal) {
                if (i === picked && isCorrect) cls += " selected correct";
                else if (i === picked && !isCorrect) cls += " selected wrong";
                else if (isCorrect) cls += " show-correct";
              }
              return (
                <button key={i} className={cls} onClick={() => pick(i)} type="button">
                  <span className="letter">{String.fromCharCode(65 + i)}</span>
                  <span>{opt}</span>
                  {reveal && isCorrect && <span className="check">✓</span>}
                  {reveal && i === picked && !isCorrect && <span className="check">✕</span>}
                </button>
              );
            })}
          </div>
          {reveal && (
            <div className="quiz-explain">
              <div className="panda-mini"><PandaAvatar size={32} mouth={picked === Q.correct ? 'happy' : 'flat'} /></div>
              <div>
                <strong>{picked === Q.correct ? '正解！🎋 ' : 'おしい！'}</strong>
                {Q.explain}
              </div>
            </div>
          )}
          <div className="quiz-bot">
            <span>正解率：<strong style={{ color: 'var(--ink-0)', fontFamily: 'var(--font-display)' }}>62%</strong></span>
            <span>·</span>
            <span>連続正解 <span className="streak">7問</span></span>
            <span style={{ marginLeft: 'auto' }}>
              {reveal && (
                <button className="btn sm primary" onClick={next} type="button">
                  次の問題 →
                </button>
              )}
            </span>
          </div>
        </div>
        <div className="quiz-right">
          <span className="qmark q1">?</span>
          <span className="qmark q2">?</span>
          <span className="qmark q3">?</span>
          <div className="thought">パンダ先生と一緒に考えよう！</div>
          <div className="panda-quiz">
            <PandaThinking />
          </div>
        </div>
      </div>
      </Reveal>
    </section>
  );
}

// ---------- YouTube Section ----------
const YT_VIDEOS = [
  { title: '【完全保存版】SAP FI 入門 — 仕訳から決算まで30分で総ざらい', mins: '32:14', views: '124k' },
  { title: 'ABAP最適化テクニック10選 — 1時間で実務レベルに', mins: '58:42', views: '87k' },
  { title: '実演：S/4HANA Fiori で受注入力やってみた', mins: '18:30', views: '56k' },
  { title: 'パンダ先生のSAPコンサル転職相談室 #12', mins: '24:08', views: '42k' }
];

function YTVidThumb({ i }) {
  const palettes = [
    ['#2c1d4a', '#5a3a8a'],
    ['#1a3d3a', '#3a7a6e'],
    ['#3d2a1f', '#7a5a3a'],
    ['#3a1a3a', '#7a3a6e']
  ];
  const [c1, c2] = palettes[i % palettes.length];
  return (
    <svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`yt${i}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect width="160" height="90" fill={`url(#yt${i})`} />
      <g opacity="0.18" stroke="white" fill="none" strokeWidth="0.5">
        {[...Array(8)].map((_, k) => <line key={k} x1="0" y1={k * 12} x2="160" y2={k * 12} />)}
      </g>
      <g transform="translate(20 22) scale(0.45)">
        <PandaPeek color="#1a1612" />
      </g>
      <text x="156" y="86" fontSize="7" fontWeight="700" fill="white" textAnchor="end"
        fontFamily="JetBrains Mono">SAP × Panda</text>
    </svg>
  );
}

function YouTubeSection() {
  return (
    <section className="section" id="youtube">
      <Reveal>
      <div className="yt-section">
        <div className="yt-grid">
          <div className="yt-intro">
            <div className="yt-logo">
              <div className="yt-icon">
                <svg width="14" height="10" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
              </div>
              YouTube · パンダ先生 SAP チャンネル
            </div>
            <h2>動画でも、もっと身近に。</h2>
            <p>
              文字で読むより、見て聞いて理解したいあなたへ。<br/>
              毎週 火・金 に新しい動画を公開しています。<br/>
              実機デモ、解説アニメ、転職相談、SAPあるある — 全部あります。
            </p>
            <div className="yt-stats">
              <div>
                <div className="v">28.4k</div>
                <div className="l">登録者</div>
              </div>
              <div>
                <div className="v">142本</div>
                <div className="l">動画</div>
              </div>
              <div>
                <div className="v">1.2M</div>
                <div className="l">総再生数</div>
              </div>
            </div>
            <button className="btn accent" type="button" style={{ marginTop: 18 }}>
              チャンネル登録
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </button>
          </div>
          <div className="yt-videos">
            {YT_VIDEOS.map((v, i) => (
              <div key={i} className="yt-vid">
                <div className="thumb">
                  <YTVidThumb i={i} />
                  <div className="play-ico">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                  <div className="duration">{v.mins}</div>
                </div>
                <div className="vid-info">
                  <h4>{v.title}</h4>
                  <div className="meta">
                    <span>{v.views} views</span>
                    <span>·</span>
                    <span>{['2日前','5日前','1週間前','2週間前'][i]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </Reveal>
    </section>
  );
}

// ---------- Newsletter ----------
function NewsletterSection() {
  const [v, setV] = useStateH('');
  return (
    <section className="section">
      <Reveal>
      <div className="newsletter">
        <div className="nl-mascot">
          <PandaAvatar size={80} mouth="happy" />
        </div>
        <div className="nl-text">
          <h3>週末のニュースレター 🎋</h3>
          <p>
            一週間の SAP ニュース、新着記事、パンダ先生の独り言を、土曜の朝にお届け。<br/>
            登録は無料、いつでも解除できます。
          </p>
        </div>
        <form className="nl-form" onSubmit={(e) => { e.preventDefault(); alert('登録ありがとう！🎋 '); setV(''); }}>
          <input type="email" placeholder="your@email.com" value={v} onChange={(e) => setV(e.target.value)} required />
          <button className="btn primary" type="submit">登録</button>
        </form>
      </div>
      </Reveal>
    </section>
  );
}

// ---------- Page wrapper ----------
const HOME_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "bamboo",
  "reading": 1,
  "showFloatingPanda": true,
  "intensity": "medium"
}/*EDITMODE-END*/;

function Home() {
  const [t, setTweak] = useTheme(HOME_TWEAK_DEFAULTS);
  return (
    <>
      <div className="page-bg"></div>
      <SiteHeader active="home" />
      <main style={{ position: 'relative', zIndex: 2 }}>
        <Hero />
        <CaseTickerBand />
        <CasesSection />
        <FreelanceWorries />
        <ModulesSection />
        <PathsSection />
        <ArticlesSection />
        <QuizSection />
        <YouTubeSection />
        <NewsletterSection />
      </main>
      <SiteFooter />
      {t.showFloatingPanda && <FloatingPanda />}
      <TweaksPanel title="パンダ先生 Tweaks">
        <TweakSection label="カラーテーマ">
          <TweakRadio
            label="パレット"
            value={t.palette}
            options={[
              { value: 'bamboo', label: '竹林' },
              { value: 'warm', label: '温暖' },
              { value: 'fresh', label: '清新' }
            ]}
            onChange={(v) => setTweak('palette', v)}
          />
        </TweakSection>
        <TweakSection label="読みやすさ">
          <TweakSlider label="文字サイズ" value={t.reading} min={0.85} max={1.25} step={0.05}
            unit="x"
            onChange={(v) => setTweak('reading', v)} />
        </TweakSection>
        <TweakSection label="その他">
          <TweakToggle label="フローティングパンダ" value={t.showFloatingPanda}
            onChange={(v) => setTweak('showFloatingPanda', v)} />
          <TweakRadio
            label="アニメ強度"
            value={t.intensity}
            options={[
              { value: 'off', label: 'OFF' },
              { value: 'light', label: '弱' },
              { value: 'medium', label: '中' }
            ]}
            onChange={(v) => setTweak('intensity', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Home />);
