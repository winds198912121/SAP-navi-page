import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Seo from '../components/layout/Seo'
import SiteHeader from '../components/layout/Header'
import SiteFooter from '../components/layout/Footer'
import FloatingPanda from '../components/layout/FloatingPanda'
import { useTheme } from '../hooks/useTheme'
import { ARTICLE_DATA } from '../types'
import { scrollToHeading, throttle } from '../utils'

const TOC = [
  { id: 's1', label: 'はじめに：仕訳って何？' },
  { id: 's2', label: '左右がイコール — たったひとつのルール' },
  { id: 's3', label: 'SAP での仕訳のしくみ' },
  { id: 's4', label: 'FB50 で実際に入力してみよう' },
  { id: 's5', label: 'よくある間違いと対処法' },
  { id: 's6', label: 'まとめ — パンダ先生からの一言' },
]

export default function ArticlePage() {
  const { slug } = useParams()
  const [activeToc, setActiveToc] = useState('s1')
  const { settings, updateSetting } = useTheme()
  const [showTweaks, setShowTweaks] = useState(false)

  useEffect(() => {
    const onScroll = throttle(() => {
      const viewTop = window.scrollY + 160
      let active = 's1'
      for (const t of TOC) {
        const el = document.getElementById(t.id)
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY
          if (top <= viewTop) active = t.id
        }
      }
      setActiveToc(active)
    }, 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <Seo
        title="仕訳って結局なに？借方・貸方の覚え方を一発で解説"
        description="簿記の本を3冊買ってもピンとこない人へ。覚えるべきは「左右がイコール」というたった一つのルールだけ。パンダ先生と一緒に、世界一やさしい仕訳入門を始めよう。SAP 会計伝票 FB50 の基本操作も解説。"
        path={slug ? `/article/${slug}` : '/article'}
        type="article"
        publishedTime="2026-05-19T00:00:00+09:00"
        author="パンダ先生"
        breadcrumbs={[
          { name: 'ホーム', path: '/' },
          { name: 'FI · 財務会計', path: '/category/fi' },
          { name: '仕訳のしくみ', path: slug ? `/article/${slug}` : '/article' },
        ]}
        image={`${window.location.origin}/fi-article-cover.png`}
      />
      <div className="page-bg" />
      <SiteHeader active="modules" />

      <article className="art-hero">
        <div className="crumb">
          <Link to="/">ホーム</Link>
          <span className="sep">›</span>
          <Link to="/category/fi">FI · 財務会計</Link>
          <span className="sep">›</span>
          <span className="now">仕訳のしくみ</span>
        </div>
        <div className="meta-top" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontSize: 12.5, marginBottom: 16 }}>
          <span className="tag-mod fi">FI</span>
          <span className="tag-diff l1">初級</span>
          <span style={{ color: 'var(--ink-3)' }}>· 基本概念</span>
          <span style={{ color: 'var(--ink-3)' }}>· 公開：2026年5月19日</span>
          <span style={{ color: 'var(--ink-3)' }}>· 6 min read</span>
        </div>
        <h1>「仕訳」って結局なに？借方・貸方の覚え方を、パンダ先生が一発で解説</h1>
        <p className="lead">
          簿記の本を3冊買ってもピンとこない。SAP の画面を見てもよくわからない。
          そんなあなたへ。覚えるべきは「左右がイコール」というたった一つのルールだけです。
          パンダ先生と一緒に、世界一やさしい仕訳入門を始めよう。
        </p>
        <div className="art-hero-cover">
          <svg viewBox="0 0 720 320" style={{ width: '100%', height: '100%' }}>
            <rect width="720" height="320" fill="linear-gradient(135deg, var(--accent-soft), var(--accent-2-soft))" />
            <text x="360" y="160" textAnchor="middle" fontSize="48" fontWeight="700" fill="#2f6d44" fontFamily="Zen Maru Gothic">FI · 財務会計</text>
          </svg>
        </div>
      </article>

      <div className="art-body-wrap">
        <div className="art-content">
          <div className="dialog student">
            <div className="av">
              <svg width="64" height="64" viewBox="0 0 100 100">
                <circle cx="50" cy="52" r="46" fill="#5aa0e6" opacity="0.12" />
                <circle cx="50" cy="52" r="42" fill="#fff" />
                <path d="M 50 22 C 28 22 20 38 20 56 C 20 76 32 88 50 88 C 68 88 80 76 80 56 C 80 38 72 22 50 22 Z" fill="#f4d8c0" />
                <path d="M 18 50 Q 18 16 50 14 Q 84 16 84 52 Q 80 38 70 32 Q 64 42 56 36 Q 52 44 44 36 Q 38 44 30 36 Q 24 44 18 50 Z" fill="#1e1610" />
                <ellipse cx="38" cy="56" rx="2.6" ry="3.6" fill="#0e0a05" />
                <ellipse cx="62" cy="56" rx="2.6" ry="3.6" fill="#0e0a05" />
                <ellipse cx="28" cy="68" rx="4" ry="2.5" fill="#f4a8b0" opacity="0.55" />
                <ellipse cx="72" cy="68" rx="4" ry="2.5" fill="#f4a8b0" opacity="0.55" />
                <ellipse cx="50" cy="76" rx="2.5" ry="3" fill="#0e0a05" />
              </svg>
            </div>
            <div className="bubble">
              <span className="who">たろうくん：</span>
              先生、SAPで会計画面を見ると「借方」「貸方」って出てくるんですけど、
              いつも左右どっちが何だっけ？ってなります。覚え方ありますか？
            </div>
          </div>

          <div className="dialog">
            <div className="av">
              <svg width="64" height="64" viewBox="0 0 100 100">
                <circle cx="50" cy="52" r="46" fill="#1f4ea3" opacity="0.12" />
                <circle cx="50" cy="52" r="42" fill="#fff" />
                <path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" />
                <g>
                  <path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" />
                  <path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" />
                </g>
                <circle cx="30" cy="44" r="3.4" fill="#fff" /><circle cx="30" cy="44" r="2.4" fill="#0e0a05" />
                <circle cx="70" cy="44" r="3.4" fill="#fff" /><circle cx="70" cy="44" r="2.4" fill="#0e0a05" />
                <ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" />
                <path d="M 42 68 Q 50 78 58 68" fill="#1a1612" />
              </svg>
            </div>
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

          <h2 id="s2">左右がイコール — たったひとつのルール</h2>
          <blockquote style={{ margin: '24px 0', padding: '18px 22px', background: 'var(--bg-tint)', borderLeft: '4px solid var(--accent)', borderRadius: '0 var(--r-md) var(--r-md) 0', fontStyle: 'italic' }}>
            借方の合計 = 貸方の合計 — 必ず一致する。
          </blockquote>
          <p>
            たとえば、現金 100 円で商品を売ったら：
          </p>
          <ul>
            <li><strong>借方</strong>：現金 100（会社に現金が入った）</li>
            <li><strong>貸方</strong>：売上 100（売上が立った）</li>
          </ul>

          <div className="callout-box">
            <div className="ic">💡</div>
            <div>
              <div className="title">パンダ先生のひとくちメモ</div>
              <p className="text">
                「借方」「貸方」という言葉自体には意味はありません。
                ただの<strong>左右の名前</strong>。「左 = 借方、右 = 貸方」と機械的に覚えるのが最速ルート。
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

          <h2 id="s5">よくある間違いと対処法</h2>
          <p>新人 SAPer が仕訳入力でやらかしがちなパターンを 3 つ。</p>
          <h3>① 借方・貸方を逆にする</h3>
          <p>
            「現金が増えるのは借方」と覚えているはずが、咄嗟に逆に入れてしまう。
            <strong>F5 でシミュレーション</strong>すれば仕訳プレビューが見られるので、保存前にかならず確認。
          </p>
          <h3>② 消費税を忘れる</h3>
          <p>
            税込・税抜の区別、消費税コード（<code>V0</code>, <code>V1</code> など）の選択。
            これが間違うと月末に経理から「全件直して」と依頼が来ます。
          </p>
          <h3>③ 文書日付と転記日付を混同する</h3>
          <p>月またぎの取引で重要な差が出るので要注意。</p>

          <div style={{ marginTop: 40, padding: '24px 26px', background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line-2)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <svg width="56" height="56" viewBox="-4 -8 108 108">
              <circle cx="50" cy="52" r="46" fill="#e8f0fb" opacity="0.4" />
              <path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" />
              <g>
                <path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" />
                <path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" />
              </g>
              <circle cx="30" cy="44" r="3.4" fill="#fff" /><circle cx="30" cy="44" r="2.4" fill="#0e0a05" />
              <circle cx="70" cy="44" r="3.4" fill="#fff" /><circle cx="70" cy="44" r="2.4" fill="#0e0a05" />
              <ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" />
              <path d="M 42 68 Q 50 78 58 68" fill="#1a1612" />
            </svg>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--ink-0)', marginBottom: 2 }}>この記事、役に立った？</div>
              <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>反応をくれると、パンダ先生のやる気が +100 します。</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['👍', '❤', '🎋', '🙏'].map(e => (
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
                <li key={t.id}>
                  <a href={`#${t.id}`} className={activeToc === t.id ? 'active' : ''}
                    onClick={(e) => { e.preventDefault(); scrollToHeading(t.id) }}>{t.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="toc-card" style={{ background: 'linear-gradient(135deg, var(--accent-soft), var(--bg-card))', borderColor: 'var(--accent)' }}>
            <h5 style={{ color: 'var(--accent-deep)' }}>📚 次の記事</h5>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--ink-0)', lineHeight: 1.45 }}>
              FB50 vs F-02 の使い分け完全ガイド
            </div>
          </div>
        </aside>
      </div>

      <SiteFooter />
      {settings.showFloatingPanda && <FloatingPanda />}
    </>
  )
}
