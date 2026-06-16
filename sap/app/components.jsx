// ===========================================================
// Shared components: Header, Footer, Blackboard, FloatingPanda
// ===========================================================

const { useState: useStateC, useEffect: useEffectC, useRef: useRefC } = React;

const NAV_LINKS = [
  { id: 'home', label: 'ホーム', href: 'index.html' },
  { id: 'cases', label: '案件・仕事', href: '#cases', pip: true },
  { id: 'modules', label: 'モジュール', href: '#', caret: true },
  { id: 'paths', label: '学習パス', href: '#paths' },
  { id: 'quiz', label: '今日の一問', href: '#quiz', pip: true },
  { id: 'yt', label: '動画', href: '#youtube' },
  { id: 'about', label: 'パンダ先生について', href: '#' }
];

const SAP_MODULES = [
  { code: 'FI', ja: '財務会計', en: 'Financial Accounting', desc: '会計帳簿、決算、勘定科目。経理担当が触る一番大事な土台。', count: 48, color: '#2f6d44', bg: '#d8ead9', levels: ['初級','中級','上級'], slug: 'fi' },
  { code: 'CO', ja: '管理会計', en: 'Controlling', desc: '原価計算、利益分析、予算管理。社内意思決定に効く。', count: 32, color: '#2641a1', bg: '#dde4fc', levels: ['初級','中級'], slug: 'co' },
  { code: 'MM', ja: '購買・在庫', en: 'Material Management', desc: '購買依頼から入庫まで。サプライチェーンの心臓部。', count: 41, color: '#a25411', bg: '#fde0c2', levels: ['初級','中級','上級'], slug: 'mm' },
  { code: 'SD', ja: '販売管理', en: 'Sales & Distribution', desc: '受注、出荷、請求。お客様への流れをぜんぶ管理。', count: 36, color: '#b62a4a', bg: '#ffdfe6', levels: ['初級','中級','上級'], slug: 'sd' },
  { code: 'PP', ja: '生産計画', en: 'Production Planning', desc: 'MRP、BOM、製造指示。工場の動きをコントロール。', count: 22, color: '#4828a8', bg: '#e4dffb', levels: ['中級','上級'], slug: 'pp' },
  { code: 'HR', ja: '人事管理', en: 'Human Resources', desc: '人事マスタ、給与、勤怠。SuccessFactorsとの連携も。', count: 18, color: '#8a6212', bg: '#fee9b3', levels: ['初級','中級'], slug: 'hr' },
  { code: 'ABAP', ja: '開発言語', en: 'ABAP', desc: 'SAP独自の開発言語。アドオン、レポート、機能拡張に。', count: 54, color: '#1f6f6f', bg: '#cfecec', levels: ['初級','中級','上級'], slug: 'abap' },
  { code: 'Basis', ja: '基盤管理', en: 'Basis', desc: 'システム運用、権限、パッチ。SAPの裏方。', count: 26, color: '#4a432d', bg: '#e3e1d8', levels: ['中級','上級'], slug: 'basis' },
  { code: 'S/4', ja: 'S/4HANA', en: 'Next-gen ERP', desc: '次世代ERP。Fiori UI、HANA DB、シンプリフィケーション。', count: 39, color: '#1864a3', bg: '#d1ecf9', levels: ['初級','中級','上級'], slug: 's4' }
];

// ---------- Header ----------
function SiteHeader({ active = 'home' }) {
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <a className="brand" href="index.html">
          <div className="logo-panda">
            <PandaAvatar size={38} glasses={true} />
          </div>
          <div className="brand-text">
            <div className="brand-name">パンダ<span className="sensei">先生</span></div>
            <div className="brand-sub">SAP NAVI · パンダ ナビ</div>
          </div>
        </a>
        <nav className="nav-main">
          {NAV_LINKS.map(l => (
            <a key={l.id} href={l.href}
              className={"nav-link " + (active === l.id ? 'active' : '')}>
              {l.label}
              {l.caret && <span className="caret">▾</span>}
              {l.pip && <span className="new-pip"></span>}
            </a>
          ))}
        </nav>
        <div className="nav-right">
          <div className="search-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
            <input placeholder="モジュール、用語、エラー番号..." />
            <span className="kbd">⌘K</span>
          </div>
          <button className="btn sm accent" type="button">無料登録</button>
        </div>
      </div>
    </header>
  );
}

// ---------- Footer ----------
function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="foot-wrap">
        <div>
          <a className="brand" href="index.html" style={{ marginBottom: 6 }}>
            <div className="logo-panda" style={{ filter: 'brightness(1.05)' }}>
              <PandaAvatar size={38} />
            </div>
            <div className="brand-text">
              <div className="brand-name">パンダ<span className="sensei" style={{ color: '#7dd49c' }}>先生</span></div>
              <div className="brand-sub">SAP NAVI</div>
            </div>
          </a>
          <p className="foot-about">
            SAPコンサル、開発者、ユーザー部門 — すべての SAPer のために、
            パンダ先生がやさしく解説する SAP ナレッジサイト。
          </p>
          <div className="foot-socials">
            {['X','YT','GH','RSS'].map(s => (
              <a key={s} href="#" className="foot-soc" style={{ fontSize: 11, fontWeight: 600 }}>{s}</a>
            ))}
          </div>
        </div>
        <div className="foot-col">
          <h5>モジュール</h5>
          <ul>
            {SAP_MODULES.slice(0,6).map(m => <li key={m.code}><a href={`category.html?m=${m.slug}`}>{m.code} · {m.ja}</a></li>)}
          </ul>
        </div>
        <div className="foot-col">
          <h5>コンテンツ</h5>
          <ul>
            <li><a href="#paths">学習パス</a></li>
            <li><a href="#quiz">今日の一問</a></li>
            <li><a href="#youtube">動画講座</a></li>
            <li><a href="#">用語集</a></li>
            <li><a href="#">SAPトレンド</a></li>
            <li><a href="#">転職ガイド</a></li>
          </ul>
        </div>
        <div className="foot-col">
          <h5>パンダ先生</h5>
          <ul>
            <li><a href="#">サイトについて</a></li>
            <li><a href="#">執筆メンバー</a></li>
            <li><a href="#">お問い合わせ</a></li>
            <li><a href="#">プライバシー</a></li>
            <li><a href="#">利用規約</a></li>
          </ul>
        </div>
      </div>
      <div className="foot-bot">
        <span className="copy">© 2026 パンダ先生 SAP NAVI. 大好きな SAP を、もっと身近に。</span>
        <span>Made with 🎋 in Tokyo</span>
      </div>
    </footer>
  );
}

// ---------- Floating Panda (corner mascot button) ----------
function FloatingPanda() {
  const [open, setOpen] = useStateC(false);
  return (
    <>
      {open && (
        <div style={{
          position: 'fixed', bottom: 96, right: 22,
          background: 'var(--bg-card)', borderRadius: '14px',
          padding: '14px 16px', maxWidth: 260,
          boxShadow: 'var(--sh-3)',
          border: '1.5px solid var(--accent)',
          zIndex: 40,
          fontSize: 13,
          lineHeight: 1.7,
          animation: 'slideIn .3s ease-out'
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent-deep)', fontSize: 13, marginBottom: 4 }}>パンダ先生</div>
          こんにちは！🎋<br/>
          何かわからないこと、ある？<br/>
          下のキーワードから探してみてね。
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {['仕訳','BAPI','原価計算','BOM'].map(t => (
              <span key={t} style={{ fontSize: 11, padding: '3px 8px', background: 'var(--accent-soft)', borderRadius: 999, color: 'var(--accent-deep)', fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        </div>
      )}
      <div className="float-panda" onClick={() => setOpen(o => !o)} title="パンダ先生に質問">
        <PandaFloat />
      </div>
    </>
  );
}

// ---------- Reveal-on-scroll wrapper ----------
function Reveal({ children, delay = 0 }) {
  const ref = useRefC(null);
  const [shown, setShown] = useStateC(false);
  useEffectC(() => {
    if (!ref.current) return;
    // Safety net: always show within 200ms (covers cases where observer doesn't fire)
    const safety = setTimeout(() => setShown(true), 200);
    if (!('IntersectionObserver' in window)) { setShown(true); return () => clearTimeout(safety); }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setTimeout(() => setShown(true), delay);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    obs.observe(ref.current);
    return () => { clearTimeout(safety); obs.disconnect(); };
  }, []);
  return <div ref={ref} className={"reveal" + (shown ? " in" : "")}>{children}</div>;
}

// ---------- Theme manager ----------
function useTheme(defaults) {
  const [t, setTweak] = useTweaks(defaults);
  useEffectC(() => {
    document.documentElement.dataset.theme = t.palette;
    document.documentElement.style.setProperty('--reading', String(t.reading));
    document.documentElement.dataset.intensity = t.intensity || 'medium';
  }, [t.palette, t.reading, t.intensity]);
  return [t, setTweak];
}

Object.assign(window, { SiteHeader, SiteFooter, FloatingPanda, Reveal, useTheme, SAP_MODULES, NAV_LINKS, ArticleCoverSVG });

// ---------- Article cover SVG (decorative thumbnails) ----------
function ArticleCoverSVG({ type }) {
  const themes = {
    fi: { bg1: '#d8ead9', bg2: '#a4cfb0', fg: '#2f6d44', label: 'FI' },
    abap: { bg1: '#cfecec', bg2: '#88c3c3', fg: '#1f6f6f', label: '{ABAP}' },
    mm: { bg1: '#fde0c2', bg2: '#e9b378', fg: '#a25411', label: 'MM' },
    s4: { bg1: '#d1ecf9', bg2: '#88bbe0', fg: '#1864a3', label: 'S/4' },
    co: { bg1: '#dde4fc', bg2: '#9eafe6', fg: '#2641a1', label: 'CO' },
    sd: { bg1: '#ffdfe6', bg2: '#f0a0b8', fg: '#b62a4a', label: 'SD' },
    pp: { bg1: '#e4dffb', bg2: '#a89ce6', fg: '#4828a8', label: 'PP' },
    hr: { bg1: '#fee9b3', bg2: '#e6c879', fg: '#8a6212', label: 'HR' },
    basis: { bg1: '#e3e1d8', bg2: '#b8b29a', fg: '#4a432d', label: 'Bs' }
  };
  const t = themes[type] || themes.fi;
  const gid = 'cv' + type + Math.floor(Math.random() * 99999);
  return (
    <svg viewBox="0 0 120 90" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={t.bg1} />
          <stop offset="100%" stopColor={t.bg2} />
        </linearGradient>
      </defs>
      <rect width="120" height="90" fill={`url(#${gid})`} />
      <g opacity="0.25" fill={t.fg}>
        {[...Array(24)].map((_, i) => (
          <circle key={i} cx={(i % 8) * 16 + 8} cy={Math.floor(i / 8) * 30 + 12} r="1" />
        ))}
      </g>
      <text x="60" y="56" fontSize="32" fontWeight="800" fill={t.fg}
        fontFamily="Zen Maru Gothic, sans-serif" textAnchor="middle" opacity="0.85"
        letterSpacing="-1">{t.label}</text>
      <g transform="translate(86 52) scale(0.32)">
        <PandaPeek color="#1a1612" />
      </g>
    </svg>
  );
}
Object.assign(window, { ArticleCoverSVG });
