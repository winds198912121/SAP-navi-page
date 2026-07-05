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
    </div>
  );
}
