// ===========================================================
// CATEGORY page — filter by module (FI by default)
// ===========================================================

const { useState: useStateCat } = React;

const CAT_ARTICLES = [
  { mod: 'FI', diff: 1, title: '【完全保存版】仕訳のしくみ — 借方・貸方を一発で覚える',
    excerpt: '簿記の本を読んでも頭に入らない…そんなあなたへ。覚えるべきは「左右がイコール」というたった一つのルール。',
    author: 'パンダ先生', date: '3日前', mins: 6, views: '12.4k', cover: 'fi', topic: 'basic' },
  { mod: 'FI', diff: 1, title: '勘定科目（G/L Account）ってつまり何？コードと名前のしくみ',
    excerpt: 'マスタの中で一番触られる勘定科目。階層、グループ、表示形式 — 新人がつまずくところを整理。',
    author: 'タナカ', date: '6日前', mins: 8, views: '9.8k', cover: 'fi', topic: 'master' },
  { mod: 'FI', diff: 2, title: '会計伝票の文書タイプ（SA/KR/DR…）使い分けマスターガイド',
    excerpt: '実は奥が深い文書タイプ。デフォルトのままで本当に大丈夫？案件で必ず議論になるポイントを解説。',
    author: 'パンダ先生', date: '1週間前', mins: 10, views: '7.2k', cover: 'fi', topic: 'transaction' },
  { mod: 'FI', diff: 2, title: '消費税コード（Tax Code）の設計 — 軽減税率もインボイスも',
    excerpt: '日本特有の論点が多い税務領域。区分記載、適格請求書、課税売上割合 — まとめて理解する。',
    author: 'サトウ', date: '10日前', mins: 12, views: '5.6k', cover: 'fi', topic: 'transaction' },
  { mod: 'FI', diff: 3, title: '月次決算を3日短縮した話 — Soft Close 運用のリアル',
    excerpt: '理屈はわかるけど現場でどうするのか。某メーカーの事例ベースで、決算早期化の具体策を。',
    author: 'タナカ', date: '2週間前', mins: 15, views: '8.4k', cover: 'fi', topic: 'process' },
  { mod: 'FI', diff: 2, title: '銀行勘定の自動消込（EBS）導入ガイド',
    excerpt: 'Electronic Bank Statement を有効化するときの設定パラメータ全部見せます。よくあるエラーも。',
    author: 'パンダ先生', date: '3週間前', mins: 11, views: '4.9k', cover: 'fi', topic: 'transaction' },
  { mod: 'FI', diff: 1, title: '【完全保存版】仕訳のしくみ — 借方・貸方を一発で覚える',
    excerpt: '簿記の本を読んでも頭に入らない…そんなあなたへ。覚えるべきは「左右がイコール」というたった一つのルール。',
    author: 'パンダ先生', date: '3日前', mins: 6, views: '12.4k', cover: 'fi', topic: 'basic' },
  { mod: 'FI', diff: 1, title: '勘定科目（G/L Account）ってつまり何？コードと名前のしくみ',
    excerpt: 'マスタの中で一番触られる勘定科目。階層、グループ、表示形式 — 新人がつまずくところを整理。',
    author: 'タナカ', date: '6日前', mins: 8, views: '9.8k', cover: 'fi', topic: 'master' },
  { mod: 'FI', diff: 2, title: '会計伝票の文書タイプ（SA/KR/DR…）使い分けマスターガイド',
    excerpt: '実は奥が深い文書タイプ。デフォルトのままで本当に大丈夫？案件で必ず議論になるポイントを解説。',
    author: 'パンダ先生', date: '1週間前', mins: 10, views: '7.2k', cover: 'fi', topic: 'transaction' },
  { mod: 'FI', diff: 2, title: '消費税コード（Tax Code）の設計 — 軽減税率もインボイスも',
    excerpt: '日本特有の論点が多い税務領域。区分記載、適格請求書、課税売上割合 — まとめて理解する。',
    author: 'サトウ', date: '10日前', mins: 12, views: '5.6k', cover: 'fi', topic: 'transaction' },
  { mod: 'FI', diff: 3, title: '月次決算を3日短縮した話 — Soft Close 運用のリアル',
    excerpt: '理屈はわかるけど現場でどうするのか。某メーカーの事例ベースで、決算早期化の具体策を。',
    author: 'タナカ', date: '2週間前', mins: 15, views: '8.4k', cover: 'fi', topic: 'process' },
  { mod: 'FI', diff: 2, title: '銀行勘定の自動消込（EBS）導入ガイド',
    excerpt: 'Electronic Bank Statement を有効化するときの設定パラメータ全部見せます。よくあるエラーも。',
    author: 'パンダ先生', date: '3週間前', mins: 11, views: '4.9k', cover: 'fi', topic: 'transaction' }
];

function CategoryPage() {
  const [diff, setDiff] = useStateCat('all');
  const [topic, setTopic] = useStateCat('all');
  const [sort, setSort] = useStateCat('new');

  const filtered = CAT_ARTICLES.filter(a => {
    if (diff !== 'all' && a.diff !== parseInt(diff)) return false;
    if (topic !== 'all' && a.topic !== topic) return false;
    return true;
  });

  return (
    <>
      <div className="page-bg"></div>
      <SiteHeader active="modules" />
      <section className="cat-hero">
        <div className="cat-hero-wrap">
          <div>
            <div className="crumb">
              <a href="index.html">ホーム</a>
              <span className="sep">›</span>
              <a href="#">モジュール</a>
              <span className="sep">›</span>
              <span className="now">FI · 財務会計</span>
            </div>
            <div className="cat-title-row">
              <div className="cat-big-icon" style={{ background: '#2f6d44' }}>FI</div>
              <div>
                <h1>財務会計</h1>
                <span className="code">Financial Accounting · FI</span>
              </div>
            </div>
            <p className="cat-desc">
              SAP FI モジュールは、会計帳簿、決算、勘定科目、債権債務、税務などをカバーする
              基幹中の基幹。経理・財務・コンサル — どの立場でも、ここを押さえないと話が始まらない。
              パンダ先生が、新人さんでもわかるように一歩ずつ解説します。
            </p>
            <div className="cat-stats">
              <div className="stat">
                <div className="v">48<small style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 500 }}>本</small></div>
                <div className="l">公開記事</div>
              </div>
              <div className="stat">
                <div className="v">12<small style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 500 }}>本</small></div>
                <div className="l">人気 TOP 記事</div>
              </div>
              <div className="stat">
                <div className="v">4.8<small style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 500 }}>★</small></div>
                <div className="l">読者評価</div>
              </div>
            </div>
          </div>
          <div className="cat-mascot">
            <PandaThinking />
          </div>
        </div>
      </section>

      <main className="cat-body">
        <aside className="cat-sidebar">
          <div className="filter-block">
            <h5>難易度で絞り込む</h5>
            <div className="filter-list">
              <div className={"filter-item " + (diff === 'all' ? 'active' : '')} onClick={() => setDiff('all')}>
                <span>すべて</span><span className="cnt">{CAT_ARTICLES.length}</span>
              </div>
              <div className={"filter-item " + (diff === '1' ? 'active' : '')} onClick={() => setDiff('1')}>
                <span className="swatch" style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent)' }}></span>
                <span>初級</span><span className="cnt">{CAT_ARTICLES.filter(a => a.diff===1).length}</span>
              </div>
              <div className={"filter-item " + (diff === '2' ? 'active' : '')} onClick={() => setDiff('2')}>
                <span className="swatch" style={{ background: 'var(--accent-2-soft)', border: '1px solid var(--accent-2)' }}></span>
                <span>中級</span><span className="cnt">{CAT_ARTICLES.filter(a => a.diff===2).length}</span>
              </div>
              <div className={"filter-item " + (diff === '3' ? 'active' : '')} onClick={() => setDiff('3')}>
                <span className="swatch" style={{ background: 'var(--rose-soft)', border: '1px solid var(--rose)' }}></span>
                <span>上級</span><span className="cnt">{CAT_ARTICLES.filter(a => a.diff===3).length}</span>
              </div>
            </div>
          </div>
          <div className="filter-block">
            <h5>トピックで絞り込む</h5>
            <div className="filter-list">
              {[
                { id: 'all', label: 'すべて' },
                { id: 'basic', label: '基本概念' },
                { id: 'master', label: 'マスタ設計' },
                { id: 'transaction', label: 'トランザクション' },
                { id: 'process', label: '業務プロセス' }
              ].map(t => (
                <div key={t.id} className={"filter-item " + (topic === t.id ? 'active' : '')} onClick={() => setTopic(t.id)}>
                  <span>{t.label}</span>
                  <span className="cnt">{t.id === 'all' ? CAT_ARTICLES.length : CAT_ARTICLES.filter(a => a.topic === t.id).length}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="filter-block" style={{ background: 'linear-gradient(135deg, var(--accent-soft), var(--bg-card))', borderColor: 'var(--accent)' }}>
            <h5 style={{ color: 'var(--accent-deep)' }}>📘 学習パスから探す</h5>
            <div style={{ fontSize: 12.5, color: 'var(--ink-1)', lineHeight: 1.7, marginBottom: 10 }}>
              FI を体系的に学びたいなら、新人入門コースから順番にどうぞ。
            </div>
            <button className="btn sm accent" type="button" style={{ width: '100%', justifyContent: 'center' }}>
              入門コースを見る →
            </button>
          </div>
        </aside>

        <div className="cat-content">
          <div className="cat-toolbar">
            <div className="count"><strong>{filtered.length}</strong> 件 の記事</div>
            <div className="sort-pills">
              {[
                { id: 'new', label: '新着順' },
                { id: 'pop', label: '人気順' },
                { id: 'easy', label: '難易度順' }
              ].map(s => (
                <button key={s.id} className={"sort-pill " + (sort === s.id ? 'active' : '')} onClick={() => setSort(s.id)} type="button">{s.label}</button>
              ))}
            </div>
          </div>

          <div className="card-grid">
            {filtered.map((a, i) => (
              <a key={i} className="art-card" href="article.html">
                <div className="cover"><ArticleCoverSVG type="fi" /></div>
                <div className="body">
                  <div className="tags-row">
                    <span className="tag-mod fi">{a.mod}</span>
                    <span className={"tag-diff l" + a.diff}>
                      {a.diff === 1 ? '初級' : a.diff === 2 ? '中級' : '上級'}
                    </span>
                    <span>· {a.date}</span>
                  </div>
                  <h3>{a.title}</h3>
                  <p className="excerpt">{a.excerpt}</p>
                  <div className="foot">
                    <span>📖 {a.mins} min</span>
                    <span>👁 {a.views}</span>
                    <span className="read">読む →</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="pagination">
            <button className="pg-btn" type="button">‹</button>
            <button className="pg-btn active" type="button">1</button>
            <button className="pg-btn" type="button">2</button>
            <button className="pg-btn" type="button">3</button>
            <button className="pg-btn" type="button">4</button>
            <button className="pg-btn" type="button" style={{ background: 'transparent', border: 'none' }}>...</button>
            <button className="pg-btn" type="button">8</button>
            <button className="pg-btn" type="button">›</button>
          </div>
        </div>
      </main>

      <SiteFooter />
      <FloatingPanda />
    </>
  );
}

const CAT_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "bamboo",
  "reading": 1,
  "intensity": "medium"
}/*EDITMODE-END*/;

function CategoryRoot() {
  const [t, setTweak] = useTheme(CAT_TWEAK_DEFAULTS);
  return (
    <>
      <CategoryPage />
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
            unit="x" onChange={(v) => setTweak('reading', v)} />
          <TweakRadio label="アニメ強度" value={t.intensity}
            options={[
              { value: 'off', label: 'OFF' },
              { value: 'light', label: '弱' },
              { value: 'medium', label: '中' }
            ]}
            onChange={(v) => setTweak('intensity', v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<CategoryRoot />);
