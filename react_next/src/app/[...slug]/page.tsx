import { api } from '@/lib/api';
import { TOPIC_NAMES, moduleColor, difficultyLabel, difficultyClass, formatDate, excerpt } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props { params: Promise<{ slug: string[] }> }

export async function generateStaticParams() {
  return [
    { slug: ['about'] }, { slug: ['team'] }, { slug: ['contact'] },
    { slug: ['privacy'] }, { slug: ['terms'] },
    { slug: ['glossary'] }, { slug: ['trends'] }, { slug: ['career'] },
  ];
}

const STATIC_PAGES: Record<string, { title: string; content: string }> = {
  about: {
    title: 'このサイトについて',
    content: '<p>SAP パンダ先生 NAVI は、SAP学習者のための総合プラットフォームです。未経験からSAPコンサルタントを目指す方、さらなるスキルアップを目指す現役コンサルタントの方まで、幅広くサポートします。</p><h2>ミッション</h2><p>日本におけるSAP人材の育成と、SAP業界の発展に貢献すること。</p>',
  },
  team: {
    title: 'チーム',
    content: '<p>SAP パンダ先生 NAVI は、現役SAPコンサルタントとエンジニアが立ち上げたプロジェクトです。</p>',
  },
  privacy: {
    title: 'プライバシーポリシー',
    content: '<p>当サイトは、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。</p>',
  },
  terms: {
    title: '利用規約',
    content: '<p>本規約は、SAP パンダ先生 NAVI の利用条件を定めるものです。</p>',
  },
};

async function CatchAllPage({ params }: Props) {
  const { slug } = await params;
  const path = slug?.[0] || '';

  // Static pages
  if (STATIC_PAGES[path]) {
    const page = STATIC_PAGES[path];
    return (
      <div className="container-narrow" style={{paddingTop:'var(--spacing-xl)',paddingBottom:'var(--spacing-2xl)'}}>
        <nav className="breadcrumb"><Link href="/">ホーム</Link><span className="separator">›</span><span>{page.title}</span></nav>
        <h1>{page.title}</h1>
        <div dangerouslySetInnerHTML={{__html: page.content}} />
      </div>
    );
  }

  // Topic pages (glossary, trends, career)
  if (['glossary', 'trends', 'career'].includes(path)) {
    const topicName = TOPIC_NAMES[path] || path;
    const articles = await api.getArticles({ topic: path, per_page: 20 });

    return (
      <div className="container" style={{paddingTop:'var(--spacing-xl)',paddingBottom:'var(--spacing-2xl)'}}>
        <nav className="breadcrumb"><Link href="/">ホーム</Link><span className="separator">›</span><span>{topicName}</span></nav>
        <h1>{topicName}</h1>
        <div className="tabs">
          {Object.entries(TOPIC_NAMES).map(([s, n]) => (
            <Link key={s} href={`/${s}`} className={`tab ${path === s ? 'active' : ''}`}>{n}</Link>
          ))}
        </div>
        {articles && articles.length > 0 ? (
          <div className="article-list">
            {articles.map((art: any) => (
              <article key={art.id} className="article-card">
                <div className="article-card-body">
                  <div className="article-card-meta">
                    {art.module_slug && <span className="module-badge" style={{background:moduleColor(art.module_slug)}}>{art.module_slug.toUpperCase()}</span>}
                    {art.difficulty && <span className={`badge ${difficultyClass(art.difficulty)}`}>{difficultyLabel(art.difficulty)}</span>}
                  </div>
                  <h3 className="article-card-title"><Link href={`/article/${art.id}/${art.slug||''}`}>{art.title}</Link></h3>
                  <div className="article-card-excerpt">{excerpt(art.excerpt, 60)}</div>
                </div>
              </article>
            ))}
          </div>
        ) : <div className="empty-state">記事がまだありません。</div>}
      </div>
    );
  }

  // Contact page (with form handling)
  if (path === 'contact') {
    return <ContactPage />;
  }

  notFound();
}

async function ContactPage() {
  return (
    <div className="container-narrow" style={{paddingTop:'var(--spacing-xl)',paddingBottom:'var(--spacing-2xl)'}}>
      <nav className="breadcrumb"><Link href="/">ホーム</Link><span className="separator">›</span><span>お問い合わせ</span></nav>
      <h1>お問い合わせ</h1>
      <ContactForm />
    </div>
  );
}

function ContactForm() {
  return (
    <form action="/wp-json/sap/v1/contact" method="POST" className="admin-form" style={{maxWidth:600}}
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        try {
          const res = await fetch('/wp-json/sap/v1/contact', {
            method: 'POST', headers: {'Content-Type':'application/json'},
            body: JSON.stringify(Object.fromEntries(fd)),
          });
          const json = await res.json();
          if (json.success) alert('お問い合わせを受け付けました。');
          else alert(json.message || '送信に失敗しました。');
        } catch { alert('エラーが発生しました。'); }
      }}>
      <div className="form-group"><label>お名前</label><input type="text" name="name" className="form-input" required /></div>
      <div className="form-group"><label>メールアドレス</label><input type="email" name="email" className="form-input" required /></div>
      <div className="form-group"><label>メッセージ</label><textarea name="message" className="form-input" required rows={5}></textarea></div>
      <button type="submit" className="btn btn-primary">送信する</button>
    </form>
  );
}

export default CatchAllPage;
