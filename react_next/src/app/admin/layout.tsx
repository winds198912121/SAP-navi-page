import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-title">⚙️ 管理画面</div>
        <ul className="admin-nav">
          <li><Link href="/admin">📊 ダッシュボード</Link></li>
          <li className="nav-section-title">コンテンツ</li>
          <li><Link href="/admin/articles">📄 記事</Link></li>
          <li><Link href="/admin/courses">📚 コース</Link></li>
          <li><Link href="/admin/lessons">📖 レッスン</Link></li>
          <li><Link href="/admin/modules">🔧 モジュール</Link></li>
          <li><Link href="/admin/knowledge">💡 ナレッジ</Link></li>
          <li><Link href="/admin/videos">🎬 動画</Link></li>
          <li><Link href="/admin/learning-paths">🎯 学習パス</Link></li>
          <li><Link href="/admin/notes">📝 ノート</Link></li>
          <li className="nav-section-title">管理</li>
          <li><Link href="/admin/cases">💼 案件</Link></li>
          <li><Link href="/admin/quizzes">❓ クイズ</Link></li>
          <li><Link href="/admin/applications">📋 応募</Link></li>
          <li><Link href="/admin/users">👥 ユーザー</Link></li>
          <li><Link href="/admin/contact">✉️ お問い合わせ</Link></li>
          <li className="nav-section-title">設定</li>
          <li><Link href="/admin/site-pages">📃 固定ページ</Link></li>
          <li><Link href="/admin/plugins">🔌 プラグイン</Link></li>
          <li><Link href="/admin/seo-geo">🌐 SEO/地域</Link></li>
        </ul>
      </aside>
      <main className="admin-content">{children}</main>
      <style jsx>{`
        .admin-layout { display: grid; grid-template-columns: 240px 1fr; min-height: calc(100vh - var(--header-height)); }
        .admin-sidebar { background: var(--color-bg-dark); color: white; padding-bottom: var(--spacing-2xl); }
        .admin-sidebar-title { padding: var(--spacing-md) var(--spacing-lg); font-family: var(--font-heading); font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .admin-nav { list-style: none; padding: 0; margin: 0; }
        .admin-nav li { margin: 0; }
        .admin-nav a { display: flex; padding: var(--spacing-sm) var(--spacing-lg); color: rgba(255,255,255,0.7); font-size: var(--text-sm); }
        .admin-nav a:hover { background: rgba(255,255,255,0.1); color: white; }
        .nav-section-title { padding: var(--spacing-md) var(--spacing-lg) var(--spacing-xs); font-size: var(--text-xs); color: rgba(255,255,255,0.4); text-transform: uppercase; }
        .admin-content { padding: var(--spacing-xl); overflow-x: auto; }
        @media (max-width: 768px) { .admin-layout { grid-template-columns: 1fr; } .admin-sidebar { display: none; } }
      `}</style>
    </div>
  );
}
