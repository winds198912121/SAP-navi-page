// ===========================================================
// ARTICLE DETAIL — with Panda dialog, TOC, related articles
// ===========================================================

const { useState: useStateA, useEffect: useEffectA } = React;

function ArticleHeroCover({ scene = 'class' }) {
  return <Scene name={scene} />;
}

const TOC = [
  { id: 's1', label: 'はじめに：仕訳って何？' },
  { id: 's2', label: '左右がイコール — たったひとつのルール', sub: false },
  { id: 's3', label: 'SAP での仕訳のしくみ' },
  { id: 's4', label: 'FB50 で実際に入力してみよう', sub: true },
  { id: 's5', label: '文書タイプの選び方', sub: true },
  { id: 's6', label: 'よくある間違いと対処法' },
  { id: 's7', label: 'まとめ — パンダ先生からの一言' }
];

function ArticlePage() {
  const [activeToc, setActiveToc] = useStateA('s1');
  const sceneParam = new URLSearchParams(location.search).get('scene') || 'class';

  useEffectA(() => {
    const onScroll = () => {
      const heads = TOC.map(t => document.getElementById(t.id)).filter(Boolean);
      const y = window.scrollY + 160;
      let active = TOC[0].id;
      for (const h of heads) {
        if (h.offsetTop <= y) active = h.id;
      }
      setActiveToc(active);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className="page-bg"></div>
      <SiteHeader active="modules" />

      <article className="art-hero">
        <div className="crumb">
          <a href="index.html">ホーム</a>
          <span className="sep">›</span>
          <a href="category.html">FI · 財務会計</a>
          <span className="sep">›</span>
          <span className="now">仕訳のしくみ</span>
        </div>
        <div className="meta-top">
          <span className="tag-mod fi">FI</span>
          <span className="tag-diff l1">初級</span>
          <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>· 基本概念</span>
          <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>· 公開：2026年5月19日</span>
          <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>· 6 min read</span>
        </div>
        <h1>「仕訳」って結局なに？借方・貸方の覚え方を、パンダ先生が一発で解説</h1>
        <p className="lead">
          簿記の本を3冊買ってもピンとこない。SAP の画面を見てもよくわからない。
          そんなあなたへ。覚えるべきは「左右がイコール」というたった一つのルールだけです。
          パンダ先生と一緒に、世界一やさしい仕訳入門を始めよう。
        </p>
        <div className="meta-bot">
          <div className="author-row">
            <div className="av">
              <PandaAvatar size={36} />
            </div>
            <div>
              <div className="name">パンダ先生</div>
              <div className="role">主筆 · SAP FI/CO コンサルタント歴 12年</div>
            </div>
          </div>
          <span className="dot"></span>
          <span>👁 12,438 views</span>
          <span className="dot"></span>
          <span>❤ 348</span>
          <span style={{ marginLeft: 'auto' }}>
            <button className="btn sm" type="button">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
              保存
            </button>
          </span>
        </div>
        <div className="art-hero-cover">
          <ArticleHeroCover scene={sceneParam} />
        </div>
      </article>

      <div className="art-body-wrap">
        <div className="art-content">

          <div className="dialog student">
            <div className="av"><StudentDialogAvatar size={64} mood="o" /></div>
            <div className="bubble">
              <span className="who">たろうくん：</span>
              先生、SAPで会計画面を見ると「借方」「貸方」って出てくるんですけど、
              いつも左右どっちが何だっけ？ってなります。覚え方ありますか？
            </div>
          </div>

          <div className="dialog">
            <div className="av"><PandaDialogAvatar size={64} mood="happy" /></div>
            <div className="bubble">
              <span className="who">パンダ先生：</span>
              いい質問だね！🎋  実は SAPer の 8 割が最初につまずくところ。
              でも安心して。これから話す「<strong>左右イコール</strong>」さえ覚えれば、
              98% の仕訳は自分で考えられるようになるよ。
            </div>
          </div>

          <h2 id="s1">はじめに：仕訳って何？</h2>
          <p>
            <strong>仕訳（しわけ）</strong> とは、お金の動きを「左右に分けて記録する」というだけのこと。
            会社で起きたあらゆる取引 — 商品を売った、給料を払った、機械を買った —
            これら全部を、「<strong>借方（左）</strong>」と「<strong>貸方（右）</strong>」のセットで書き残します。
          </p>
          <p>
            SAP の画面で言うと、トランザクションコード <code>FB50</code> や <code>F-02</code> で入力する、
            あの行ベースの伝票がまさに「仕訳」です。
          </p>

          <h2 id="s2">左右がイコール — たったひとつのルール</h2>
          <p>
            仕訳の絶対ルールはこれだけ：
          </p>
          <blockquote>
            借方の合計 = 貸方の合計 — 必ず一致する。
          </blockquote>
          <p>
            たとえば、現金 100 円で商品を売ったら：
          </p>
          <ul>
            <li><strong>借方</strong>：現金 100（会社に現金が入った）</li>
            <li><strong>貸方</strong>：売上 100（売上が立った）</li>
          </ul>
          <p>
            左 100、右 100 — ぴったり一致しますね。SAP も、この合計が合わないと伝票を保存させてくれません。
            <code>Document is not balanced</code> というあのエラーは「左右の合計が違うよ」というメッセージ。
          </p>

          <div className="callout-box">
            <div className="ic">💡</div>
            <div>
              <div className="title">パンダ先生のひとくちメモ</div>
              <p className="text">
                「借方」「貸方」という言葉自体には意味はありません。
                ただの<strong>左右の名前</strong>。意味で覚えようとすると逆につまずきます。
                「左 = 借方、右 = 貸方」と機械的に覚えるのが最速ルート。
              </p>
            </div>
          </div>

          <h2 id="s3">SAP での仕訳のしくみ</h2>
          <p>
            SAP では、仕訳は <strong>会計伝票（Accounting Document）</strong> という単位で管理されます。
            1 つの伝票には複数の明細（Line Item）があって、それぞれに金額と勘定科目が紐付きます。
          </p>

          <h3 id="s4">FB50 で実際に入力してみよう</h3>
          <p>
            最も基本的な G/L 仕訳入力画面が <code>FB50</code> です。
            ヘッダーに会社コードと文書日付、明細欄に勘定科目・借方/貸方区分・金額を入れていきます。
          </p>
          <ul>
            <li>① ヘッダ部：会社コード、文書日付、参照テキスト</li>
            <li>② 明細部：勘定科目（G/L Account）、借方/貸方、金額</li>
            <li>③ シミュレーション：F5 でプレビュー、エラーチェック</li>
            <li>④ 保存：左右一致でエラーなしなら、伝票番号が振られる</li>
          </ul>

          <div className="dialog student">
            <div className="av"><StudentDialogAvatar size={64} mood="think" /></div>
            <div className="bubble">
              <span className="who">たろうくん：</span>
              文書タイプって何ですか？SA とか KR とか…意味わかりません 😅
            </div>
          </div>

          <div className="dialog">
            <div className="av"><PandaDialogAvatar size={64} mood="happy" /></div>
            <div className="bubble">
              <span className="who">パンダ先生：</span>
              よく気づいたね！🎋  実はとても大事なポイント。文書タイプは <strong>「この伝票は何の取引か」</strong>を
              示すラベルで、これによって連番、表示、後工程の処理がぜんぶ変わるんだ。
            </div>
          </div>

          <h3 id="s5">文書タイプの選び方</h3>
          <p>
            標準で用意されている主な文書タイプ：
          </p>
          <ul>
            <li><code>SA</code>：G/L 一般仕訳 — 何にでも使える万能タイプ</li>
            <li><code>KR</code>：仕入先請求書（買掛発生）</li>
            <li><code>DR</code>：得意先請求書（売掛発生）</li>
            <li><code>KZ</code>：仕入先支払</li>
            <li><code>DZ</code>：得意先入金</li>
          </ul>

          <div className="callout-box warn">
            <div className="ic">⚠</div>
            <div>
              <div className="title">よくあるアンチパターン</div>
              <p className="text">
                「全部 SA でいいや」とすると、後で集計やレポートが地獄になります。
                取引の性質ごとに正しく分けることで、月次決算が劇的にラクに。
              </p>
            </div>
          </div>

          <h2 id="s6">よくある間違いと対処法</h2>
          <p>
            新人 SAPer が仕訳入力でやらかしがちなパターンを 3 つ。
          </p>
          <h3>① 借方・貸方を逆にする</h3>
          <p>
            「現金が増えるのは借方」と覚えているはずが、咄嗟に逆に入れてしまう。
            <strong>F5 でシミュレーション</strong>すれば仕訳プレビューが見られるので、保存前にかならず確認。
          </p>
          <h3>② 消費税を忘れる</h3>
          <p>
            税込・税抜の区別、消費税コード（<code>V0</code>, <code>V1</code> など）の選択。
            これが間違うと月末に経理から「全件直して」と泣きの依頼が来ます。
          </p>
          <h3>③ 文書日付と転記日付を混同する</h3>
          <p>
            <strong>文書日付</strong>は「請求書の日付」、<strong>転記日付</strong>は「帳簿に載せる日付」。
            月またぎの取引で重要な差が出るので要注意。
          </p>

          <h2 id="s7">まとめ — パンダ先生からの一言</h2>
          <p>
            仕訳は SAP FI の「土台」中の土台。
            ここを「なんとなく」のまま放置すると、原価計算、決算、レポート、ぜんぶの理解で詰まります。
            逆に、ここを 1 時間しっかり腑に落とせば、あとの学習が一気にラクになります。
          </p>

          <div className="dialog">
            <div className="av"><PandaDialogAvatar size={64} mood="happy" /></div>
            <div className="bubble">
              <span className="who">パンダ先生：</span>
              わからないことがあったら、コメント欄や X (@panda_sap) で気軽に聞いてね。
              次回は「FB50 と F-02 の使い分け」を実演ありで解説するよ。お楽しみに 🎋
            </div>
          </div>

          {/* End-of-article actions */}
          <div style={{ marginTop: 40, padding: '24px 26px', background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line-2)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <PandaAvatar size={56} mouth="happy" />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--ink-0)', marginBottom: 2 }}>この記事、役に立った？</div>
              <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>反応をくれると、パンダ先生のやる気が +100 します。</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['👍','❤','🎋','🙏'].map(e => (
                <button key={e} type="button" style={{ width: 44, height: 44, borderRadius: '50%', border: '1.5px solid var(--line-2)', background: 'var(--bg-1)', fontSize: 20, cursor: 'pointer' }}>{e}</button>
              ))}
            </div>
          </div>
        </div>

        <aside className="art-side">
          <div className="toc-card">
            <h5>目次</h5>
            <ul className="toc-list">
              {TOC.map(t => (
                <li key={t.id} className={t.sub ? 'sub' : ''}>
                  <a href={`#${t.id}`} className={activeToc === t.id ? 'active' : ''}>{t.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="share-block">
            <div className="lbl">この記事をシェア</div>
            <div className="share-row">
              <button className="sh" title="X" type="button">X</button>
              <button className="sh" title="Facebook" type="button">f</button>
              <button className="sh" title="LINE" type="button">L</button>
              <button className="sh" title="Link" type="button">🔗</button>
            </div>
          </div>
          <div className="toc-card" style={{ background: 'linear-gradient(135deg, var(--accent-soft), var(--bg-card))', borderColor: 'var(--accent)' }}>
            <h5 style={{ color: 'var(--accent-deep)' }}>📚 次の記事</h5>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--ink-0)', marginBottom: 4, lineHeight: 1.45 }}>FB50 vs F-02 の使い分け完全ガイド</div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>FI · 初級 · 7 min</div>
          </div>
        </aside>
      </div>

      {/* Related */}
      <section className="related-block">
        <h3>関連記事 — もっと FI を知ろう</h3>
        <div className="card-grid">
          {CAT_ARTICLES.slice(1, 5).map((a, i) => (
            <a key={i} className="art-card" href="#">
              <div className="cover"><ArticleCoverSVG type="fi" /></div>
              <div className="body">
                <div className="tags-row">
                  <span className="tag-mod fi">{a.mod}</span>
                  <span className={"tag-diff l" + a.diff}>
                    {a.diff === 1 ? '初級' : a.diff === 2 ? '中級' : '上級'}
                  </span>
                </div>
                <h3>{a.title}</h3>
                <p className="excerpt">{a.excerpt}</p>
                <div className="foot">
                  <span>📖 {a.mins} min</span>
                  <span className="read">読む →</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <SiteFooter />
      <FloatingPanda />
    </>
  );
}

// reuse CAT_ARTICLES from category.jsx; if not loaded, fall back
const CAT_ARTICLES = window.CAT_ARTICLES || [
  { mod: 'FI', diff: 1, title: '勘定科目（G/L Account）ってつまり何？', excerpt: 'マスタの中で一番触られる勘定科目。階層、グループ、表示形式を整理。', mins: 8 },
  { mod: 'FI', diff: 2, title: '会計伝票の文書タイプ完全ガイド', excerpt: 'デフォルトのままで本当に大丈夫？案件で必ず議論になるポイント。', mins: 10 },
  { mod: 'FI', diff: 2, title: '消費税コード（Tax Code）の設計', excerpt: '日本特有の論点が多い税務領域を整理。', mins: 12 },
  { mod: 'FI', diff: 3, title: '月次決算を3日短縮した話', excerpt: '某メーカーの事例ベースで決算早期化の具体策を。', mins: 15 }
];

const ART_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "bamboo",
  "reading": 1,
  "intensity": "medium"
}/*EDITMODE-END*/;

function ArticleRoot() {
  const [t, setTweak] = useTheme(ART_TWEAK_DEFAULTS);
  return (
    <>
      <ArticlePage />
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
          <TweakSlider label="文字サイズ" value={t.reading} min={0.85} max={1.3} step={0.05}
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

ReactDOM.createRoot(document.getElementById('root')).render(<ArticleRoot />);
