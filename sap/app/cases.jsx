// ===========================================================
// SAP CASES — 案件ティッカー / 案件情報 / 応募フロー / フリーランスの困りごと
// 既存デザインを変更せず "追加" する。トーンは案件パートだけ少し硬め・信頼感重視。
// ===========================================================

const { useState: useStateK, useEffect: useEffectK, useRef: useRefK, useMemo: useMemoK } = React;

// ---------- ダミー案件データ（それっぽい架空のSES/フリーランス常駐案件） ----------
const CASE_DATA = [
  {
    id: 'c-fi-01', mods: ['FI', 'CO'], title: 'グローバル製造業 / S4移行に伴う FI-CO コンサル',
    rate: '85〜100', hi: true, period: '長期（6ヶ月〜・延長濃厚）', util: '週5・一部リモート（週2出社）',
    loc: '東京・大手町', remote: 'リモート併用', exp: '5年〜', seats: 1, urgent: true, scarce: true,
    must: ['FI/CO 設計・構築経験', '決算業務の理解', 'S/4HANA 案件経験'],
    want: ['英語での会議対応', 'グローバルテンプレート展開経験'],
    blurb: '大手製造業の基幹システム刷新PJ。会計領域のリード候補として、要件定義〜設計フェーズを担っていただきます。'
  },
  {
    id: 'c-abap-01', mods: ['ABAP'], title: 'アドオン開発リード / CDS・RAP 中心のモダン ABAP',
    rate: '75〜90', hi: true, period: '長期（12ヶ月〜）', util: '週5・フルリモート可',
    loc: 'フルリモート', remote: 'フルリモート', exp: '3年〜', seats: 2, urgent: true, scarce: false,
    must: ['ABAP 開発実務 3年以上', 'CDS Views / OData 経験'],
    want: ['RAP（RESTful ABAP）', 'Fiori / UI5 連携'],
    blurb: 'S/4HANA 上のアドオン開発チーム。レビューや若手育成も含むリードポジション。在宅中心で働けます。'
  },
  {
    id: 'c-mm-01', mods: ['MM', 'SD'], title: '物流・小売 / MM-SD 保守運用 & 機能改善',
    rate: '65〜78', hi: false, period: '長期（更新あり）', util: '週5・常駐＋リモート',
    loc: '東京・品川', remote: '一部リモート', exp: '3年〜', seats: 1, urgent: false, scarce: true,
    must: ['MM または SD の運用経験', '在庫・購買プロセス理解'],
    want: ['EDI 連携の知見', 'ユーザー部門との折衝経験'],
    blurb: '安定稼働中の小売基幹を支える保守運用＋改善。落ち着いた現場で長く働きたい方向け。'
  },
  {
    id: 'c-s4-01', mods: ['S/4', 'FI'], title: '大手商社 / S/4HANA 導入 PMO・推進支援',
    rate: '90〜110', hi: true, period: '長期（PJ完了まで）', util: '週5・出社中心',
    loc: '東京・丸の内', remote: '一部リモート', exp: '7年〜', seats: 1, urgent: false, scarce: true,
    must: ['SAP 導入PJのPMO経験', '進捗・課題管理'],
    want: ['会計または購買の業務知識', 'ベンダーコントロール'],
    blurb: '経営の目が届く全社PJのPMO。高単価・高難度ですが、ご経験者には間違いなく刺さる案件です。'
  },
  {
    id: 'c-co-01', mods: ['CO'], title: '管理会計 / 原価計算まわりの設計支援',
    rate: '70〜82', hi: false, period: '中期（4ヶ月〜）', util: '週4〜5・リモート可',
    loc: 'フルリモート', remote: 'フルリモート', exp: '4年〜', seats: 1, urgent: true, scarce: false,
    must: ['CO（製品原価計算）の構築経験'],
    want: ['COPA の知見', '製造業ドメイン'],
    blurb: '原価計算の再設計フェーズ。週4稼働も相談可。育児・複業との両立を目指す方にも。'
  },
  {
    id: 'c-basis-01', mods: ['Basis'], title: 'SAP Basis 運用 / 権限・パッチ・監視',
    rate: '60〜72', hi: false, period: '長期（更新あり）', util: '週5・常駐',
    loc: '神奈川・新横浜', remote: '出社', exp: '3年〜', seats: 2, urgent: false, scarce: false,
    must: ['Basis 運用経験', '権限（PFCG）の理解'],
    want: ['HANA DB 運用', 'Solution Manager'],
    blurb: '安定した運用案件。腰を据えて Basis スキルを伸ばしたい方に。チーム体制で安心。'
  },
  {
    id: 'c-pp-01', mods: ['PP', 'MM'], title: '製造業 / PP-MM 生産・購買プロセス改善',
    rate: '72〜85', hi: false, period: '中期（6ヶ月）', util: '週5・常駐＋リモート',
    loc: '愛知・名古屋', remote: '一部リモート', exp: '4年〜', seats: 1, urgent: true, scarce: true,
    must: ['PP（MRP/BOM）の経験', '製造現場の業務理解'],
    want: ['MM 連携', 'カットオーバー経験'],
    blurb: '工場の生産計画を支える基幹改善PJ。地方案件のため競合が少なく、決まりやすい一本です。'
  },
  {
    id: 'c-sd-01', mods: ['SD'], title: 'BtoB販売 / SD 受注〜請求の機能拡張',
    rate: '68〜80', hi: false, period: '長期（更新あり）', util: '週5・フルリモート可',
    loc: 'フルリモート', remote: 'フルリモート', exp: '3年〜', seats: 1, urgent: false, scarce: false,
    must: ['SD の構築または運用経験', '受注〜請求プロセス理解'],
    want: ['価格設定（コンディション）', 'インターフェース連携'],
    blurb: '受注業務の機能拡張。フルリモートOK・落ち着いた進行で、はじめてのフリーランスにもおすすめ。'
  }
];

const MATCH_MODULES = ['FI', 'CO', 'MM', 'SD', 'PP', 'HR', 'ABAP', 'Basis', 'S/4'];
const MOD_COLOR = {
  FI: '#2f6d44', CO: '#2641a1', MM: '#a25411', SD: '#b62a4a', PP: '#4828a8',
  HR: '#8a6212', ABAP: '#1f6f6f', Basis: '#4a432d', 'S/4': '#1864a3'
};

// ====================== 跑马灯（案件ティッカー）======================
function CaseTickerBand() {
  const items = CASE_DATA.concat(CASE_DATA); // duplicate for seamless loop
  return (
    <div className="case-ticker" id="cases-top">
      <div className="ticker-head">
        <div className="ticker-flag">
          <span className="pulse"></span>
          SAP案件 募集中
        </div>
        <div className="ticker-count"><b>{CASE_DATA.length}</b>件の新着案件 — <span className="hi">最高 月110万円</span></div>
        <a href="#cases" className="ticker-cta">すべて見る →</a>
      </div>
      <div className="ticker-viewport">
        <div className="ticker-track">
          {items.map((c, i) => (
            <a key={i} href="#cases" className="ticker-pill">
              {c.urgent && <span className="tp-urgent">急募</span>}
              <span className="tp-mod" style={{ background: MOD_COLOR[c.mods[0]] }}>{c.mods[0]}</span>
              <span className="tp-title">{c.title}</span>
              <span className={"tp-rate" + (c.hi ? " hi" : "")}>月{c.rate}万</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ====================== 案件カード ======================
function CaseCard({ c, matched, onOpen }) {
  return (
    <article className={"case-card" + (matched ? " matched" : "")} onClick={() => onOpen(c)}>
      {matched && <div className="case-match-ribbon">スキル一致</div>}
      <div className="case-card-top">
        <div className="case-mods">
          {c.mods.map(m => (
            <span key={m} className="case-mod" style={{ background: MOD_COLOR[m] }}>{m}</span>
          ))}
        </div>
        <div className="case-flags">
          {c.urgent && <span className="flag urgent">急募</span>}
          {c.scarce && <span className="flag scarce">残り{c.seats}枠</span>}
        </div>
      </div>
      <h3 className="case-title">{c.title}</h3>
      <div className="case-rate-row">
        <div className={"case-rate" + (c.hi ? " hi" : "")}>
          <span className="unit">月</span><span className="num">{c.rate}</span><span className="unit">万円〜</span>
        </div>
        {c.hi && <span className="case-hi-badge">高単価</span>}
      </div>
      <dl className="case-meta">
        <div><dt>期間</dt><dd>{c.period}</dd></div>
        <div><dt>稼働</dt><dd>{c.util}</dd></div>
        <div><dt>勤務地</dt><dd>{c.loc}<span className="case-remote">{c.remote}</span></dd></div>
        <div><dt>経験</dt><dd>{c.exp}</dd></div>
      </dl>
      <div className="case-skills">
        {c.must.slice(0, 2).map((s, i) => <span key={i} className="case-skill">{s}</span>)}
      </div>
      <div className="case-card-foot">
        <span className="case-seats">募集 {c.seats} 名</span>
        <span className="case-open">詳細を見る →</span>
      </div>
    </article>
  );
}

// ====================== 案件詳細モーダル ======================
function CaseDetailModal({ c, onClose, onApply }) {
  if (!c) return null;
  return (
    <div className="case-modal-overlay" onClick={onClose}>
      <div className="case-modal detail" onClick={e => e.stopPropagation()}>
        <button className="case-modal-x" onClick={onClose} aria-label="閉じる">×</button>
        <div className="case-detail-head">
          <div className="case-mods">
            {c.mods.map(m => <span key={m} className="case-mod" style={{ background: MOD_COLOR[m] }}>{m}</span>)}
            {c.urgent && <span className="flag urgent">急募</span>}
            {c.scarce && <span className="flag scarce">残り{c.seats}枠</span>}
          </div>
          <h3>{c.title}</h3>
          <div className={"case-rate big" + (c.hi ? " hi" : "")}>
            <span className="unit">月額</span><span className="num">{c.rate}</span><span className="unit">万円〜</span>
            {c.hi && <span className="case-hi-badge">高単価</span>}
          </div>
        </div>

        <p className="case-blurb">{c.blurb}</p>

        <div className="case-detail-grid">
          <div className="case-spec"><span className="k">契約期間</span><span className="v">{c.period}</span></div>
          <div className="case-spec"><span className="k">稼働形態</span><span className="v">{c.util}</span></div>
          <div className="case-spec"><span className="k">勤務地</span><span className="v">{c.loc}（{c.remote}）</span></div>
          <div className="case-spec"><span className="k">必要経験</span><span className="v">{c.exp}</span></div>
          <div className="case-spec"><span className="k">募集人数</span><span className="v">{c.seats} 名</span></div>
          <div className="case-spec"><span className="k">商流</span><span className="v">元請直請 / 中間マージン最小</span></div>
        </div>

        <div className="case-skill-block">
          <h4>必須スキル</h4>
          <ul className="case-skill-list must">{c.must.map((s, i) => <li key={i}>{s}</li>)}</ul>
          <h4>歓迎スキル</h4>
          <ul className="case-skill-list want">{c.want.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </div>

        <div className="case-sensei-note">
          <div className="case-sensei-svg"><PandaSensei pose="pointer" mood="happy" /></div>
          <div>
            <strong>パンダ先生より</strong>
            この案件、あなたの経歴と相性が良さそう。まずは応募して話を聞いてみよう。
            <b>応募 = 即決定ではない</b>から、気軽に第一歩を踏み出してOKだよ。🎋
          </div>
        </div>

        <div className="case-modal-foot">
          <button className="btn" type="button" onClick={onClose}>一覧に戻る</button>
          <button className="btn accent" type="button" onClick={() => onApply(c)}>
            この案件に応募する
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ====================== 応募フォーム（履歴書添付つき）======================
function ApplyModal({ c, onClose }) {
  const [done, setDone] = useStateK(false);
  const [skills, setSkills] = useStateK(c ? c.mods.slice() : []);
  const [fileName, setFileName] = useStateK('');
  if (!c) return null;

  function toggleSkill(m) {
    setSkills(prev => prev.includes(m) ? prev.filter(x => x !== m) : prev.concat(m));
  }
  function submit(e) {
    e.preventDefault();
    setDone(true);
  }

  return (
    <div className="case-modal-overlay" onClick={onClose}>
      <div className="case-modal apply" onClick={e => e.stopPropagation()}>
        <button className="case-modal-x" onClick={onClose} aria-label="閉じる">×</button>

        {!done ? (
          <>
            <div className="apply-head">
              <div className="apply-step">応募フォーム</div>
              <h3>{c.title}</h3>
              <div className="apply-target-rate">月{c.rate}万円〜 ・ {c.remote}</div>
            </div>

            <form className="apply-form" onSubmit={submit}>
              <div className="apply-row">
                <label className="apply-field">
                  <span>お名前 <i>必須</i></span>
                  <input type="text" required placeholder="山田 太郎" />
                </label>
                <label className="apply-field">
                  <span>メール <i>必須</i></span>
                  <input type="email" required placeholder="you@example.com" />
                </label>
              </div>
              <div className="apply-row">
                <label className="apply-field">
                  <span>電話番号</span>
                  <input type="tel" placeholder="090-1234-5678" />
                </label>
                <label className="apply-field">
                  <span>希望単価（月）</span>
                  <input type="text" defaultValue={`${c.rate}万円`} />
                </label>
              </div>
              <div className="apply-row">
                <label className="apply-field">
                  <span>稼働開始</span>
                  <select defaultValue="1m">
                    <option value="now">すぐに</option>
                    <option value="2w">2週間以内</option>
                    <option value="1m">1ヶ月以内</option>
                    <option value="2m">2ヶ月以降</option>
                    <option value="ask">相談したい</option>
                  </select>
                </label>
                <label className="apply-field">
                  <span>経験年数</span>
                  <select defaultValue="3">
                    <option value="1">1〜2年</option>
                    <option value="3">3〜5年</option>
                    <option value="6">6〜9年</option>
                    <option value="10">10年以上</option>
                  </select>
                </label>
              </div>

              <div className="apply-field">
                <span>得意なモジュール</span>
                <div className="apply-skill-chips">
                  {MATCH_MODULES.map(m => (
                    <button type="button" key={m}
                      className={"apply-chip" + (skills.includes(m) ? " on" : "")}
                      onClick={() => toggleSkill(m)}>{m}</button>
                  ))}
                </div>
              </div>

              <label className="apply-field">
                <span>自己PR・希望条件</span>
                <textarea rows="3" placeholder="これまでのご経験、得意領域、稼働・働き方の希望などを自由にご記入ください。"></textarea>
              </label>

              {/* 履歴書／職務経歴書 添付 */}
              <div className="apply-field">
                <span>履歴書・職務経歴書を添付 <i className="opt">任意</i></span>
                <label className="apply-file">
                  <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={e => setFileName(e.target.files[0] ? e.target.files[0].name : '')} />
                  <span className="apply-file-ico">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5-5 5 5"/><path d="M12 5v12"/></svg>
                  </span>
                  <span className="apply-file-text">{fileName || 'PDF / Word / Excel をドラッグ＆ドロップ、またはクリックして選択'}</span>
                </label>
                <p className="apply-file-hint">添付がなくても応募できます。後からスカウト経由で提出も可能です。</p>
              </div>

              <label className="apply-agree">
                <input type="checkbox" required />
                <span><a href="#">利用規約・個人情報の取り扱い</a>に同意します</span>
              </label>

              <button className="btn accent apply-submit" type="submit">
                この内容で応募する
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </button>
              <p className="apply-trust">🔒 応募内容は担当エージェントのみが確認します。現在の取引先には公開されません。</p>
            </form>
          </>
        ) : (
          <div className="apply-done">
            <div className="apply-done-svg"><PandaSensei pose="highfive" mood="laugh" /></div>
            <h3>応募ありがとう！🎋</h3>
            <p>
              <b>{c.title}</b> への応募を受け付けました。<br/>
              担当から<b>1営業日以内</b>にご連絡します。
            </p>
            <div className="apply-done-perks">
              <div><span className="ico">★</span>あなたの登録で<b>非公開案件</b>のスカウトも届きます</div>
              <div><span className="ico">◎</span>無理な営業はしません。<b>合わなければ断ってOK</b></div>
            </div>
            <button className="btn primary" type="button" onClick={onClose}>案件一覧に戻る</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ====================== 案件情報メインセクション ======================
function CasesSection() {
  const [picked, setPicked] = useStateK([]);
  const [detail, setDetail] = useStateK(null);
  const [applyFor, setApplyFor] = useStateK(null);

  // body scroll lock while a modal is open
  useEffectK(() => {
    const open = detail || applyFor;
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [detail, applyFor]);

  function togglePick(m) {
    setPicked(prev => prev.includes(m) ? prev.filter(x => x !== m) : prev.concat(m));
  }
  const isMatched = (c) => picked.length > 0 && c.mods.some(m => picked.includes(m));
  const matchCount = useMemoK(
    () => picked.length === 0 ? CASE_DATA.length : CASE_DATA.filter(isMatched).length,
    [picked]
  );
  // matched first
  const ordered = useMemoK(() => {
    return CASE_DATA.slice().sort((a, b) => (isMatched(b) ? 1 : 0) - (isMatched(a) ? 1 : 0));
  }, [picked]);

  return (
    <section className="section" id="cases">
      <div className="section-head">
        <div>
          <div className="label">SAP Freelance · 案件情報</div>
          <h2>学んだら、稼ごう<span className="accent-mark">。</span></h2>
        </div>
        <div className="desc">
          パンダ先生で学んだ知識を、そのまま収入に。<br/>
          元請直請・中間マージン最小の SAP 常駐／フリーランス案件を厳選掲載。
        </div>
      </div>

      <Reveal>
        {/* スキルマッチ — 「あなたに合う案件◯件」 */}
        <div className="match-bar">
          <div className="match-left">
            <div className="match-q">あなたの得意モジュールは？</div>
            <div className="match-chips">
              {MATCH_MODULES.map(m => (
                <button key={m} type="button"
                  className={"match-chip" + (picked.includes(m) ? " on" : "")}
                  style={picked.includes(m) ? { background: MOD_COLOR[m], borderColor: MOD_COLOR[m] } : null}
                  onClick={() => togglePick(m)}>{m}</button>
              ))}
            </div>
          </div>
          <div className="match-result">
            <div className="match-count">
              <span className="mc-label">あなたに合う案件</span>
              <span className="mc-num">{matchCount}<small>件</small></span>
            </div>
            <a href="#cases" className="btn accent sm match-cta"
              onClick={() => setApplyFor(ordered[0])}>
              無料登録してスカウトを受け取る
            </a>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="case-grid">
          {ordered.map(c => (
            <CaseCard key={c.id} c={c} matched={isMatched(c)} onOpen={setDetail} />
          ))}
        </div>
      </Reveal>

      <div className="case-note-row">
        <span>掲載は一部です。登録すると<b>非公開案件</b>を含めてご紹介します。</span>
        <a href="#worries" className="case-note-link">フリーランスが不安な方へ →</a>
      </div>

      {detail && (
        <CaseDetailModal
          c={detail}
          onClose={() => setDetail(null)}
          onApply={(c) => { setDetail(null); setApplyFor(c); }}
        />
      )}
      {applyFor && <ApplyModal c={applyFor} onClose={() => setApplyFor(null)} />}
    </section>
  );
}

// ====================== フリーランスの困りごと ======================
function FreelanceWorries() {
  const worries = [
    {
      q: '案件探しが、とにかく大変…',
      a: '希望条件を一度登録すれば、合う案件だけスカウトでお届け。探す時間をゼロに。',
      tag: '探す手間'
    },
    {
      q: '単価交渉、正直ニガテ。',
      a: '相場と実績をもとに、担当が代わりに交渉。「言い出せず安く受ける」をなくします。',
      tag: '単価'
    },
    {
      q: 'ブランク・年齢が不安。',
      a: '40代・復帰組の決定実績多数。経験の棚卸しから一緒に。學び直しはパンダ先生で。',
      tag: 'キャリア'
    },
    {
      q: '自分の市場価値がわからない。',
      a: '登録すると無料で「単価診断」。今のスキルがいくらになるか、客観的に把握できます。',
      tag: '価値'
    }
  ];
  return (
    <section className="section" id="worries">
      <div className="section-head">
        <div>
          <div className="label">Freelancer's Real Talk</div>
          <h2>フリーランスSAPerの、ほんとの悩み<span className="accent-mark">。</span></h2>
        </div>
        <div className="desc">
          一人で抱えがちな不安、ぜんぶ言葉にしてみました。<br/>
          パンダ先生のチームが、ひとつずつ解きほぐします。
        </div>
      </div>

      <Reveal>
        <div className="worries-grid">
          {worries.map((w, i) => (
            <div key={i} className="worry-card">
              <span className="worry-tag">{w.tag}</span>
              <div className="worry-q">
                <span className="worry-mark">？</span>
                <p>「{w.q}」</p>
              </div>
              <div className="worry-a">
                <span className="worry-by">パンダ先生の答え</span>
                <p>{w.a}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <div className="worries-cta">
          <div className="wc-panda"><PandaSensei pose="wave" mood="happy" /></div>
          <div className="wc-text">
            <div className="wc-eyebrow">まずは登録だけでもOK 🎋</div>
            <h3>「いつか」を、今日の一歩に。</h3>
            <p>登録は無料・3分。合わなければ断ってOK。あなたの SAP スキルは、ちゃんとお金になります。</p>
            <ul className="wc-perks">
              <li><span className="ico">★</span>非公開・高単価案件のスカウト</li>
              <li><span className="ico">◎</span>無料の単価診断</li>
              <li><span className="ico">✎</span>履歴書・職務経歴書の添削サポート</li>
            </ul>
            <div className="wc-buttons">
              <a href="#cases" className="btn accent">案件を見て登録する →</a>
              <a href="#paths" className="btn ghost">まず学習パスでスキルを固める</a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

Object.assign(window, { CaseTickerBand, CasesSection, FreelanceWorries });
