<?php
/**
 * 管理画面サイドバー（共通パーツ）
 *
 * @package Aladdin_SAP_Panda
 */
$admin_view = get_query_var( 'aladdin_admin_view' );
?>
<div class="admin-sidebar-title">⚙️ 管理画面</div>
<ul class="admin-nav">
    <li class="<?php echo ! $admin_view ? 'active' : ''; ?>"><a href="/admin">📊 ダッシュボード</a></li>
    <li class="nav-section-title">コンテンツ</li>
    <li class="<?php echo $admin_view === 'articles' ? 'active' : ''; ?>"><a href="/admin/articles">📄 記事</a></li>
    <li class="<?php echo $admin_view === 'courses' ? 'active' : ''; ?>"><a href="/admin/courses">📚 コース</a></li>
    <li class="<?php echo $admin_view === 'lessons' ? 'active' : ''; ?>"><a href="/admin/lessons">📖 レッスン</a></li>
    <li class="<?php echo $admin_view === 'modules' ? 'active' : ''; ?>"><a href="/admin/modules">🔧 モジュール</a></li>
    <li class="<?php echo $admin_view === 'knowledge' ? 'active' : ''; ?>"><a href="/admin/knowledge">💡 ナレッジ</a></li>
    <li class="<?php echo $admin_view === 'videos' ? 'active' : ''; ?>"><a href="/admin/videos">🎬 動画</a></li>
    <li class="<?php echo $admin_view === 'learning-paths' ? 'active' : ''; ?>"><a href="/admin/learning-paths">🎯 学習パス</a></li>
    <li class="<?php echo $admin_view === 'notes' ? 'active' : ''; ?>"><a href="/admin/notes">📝 ノート</a></li>
    <li class="nav-section-title">管理</li>
    <li class="<?php echo $admin_view === 'cases' ? 'active' : ''; ?>"><a href="/admin/cases">💼 案件</a></li>
    <li class="<?php echo $admin_view === 'quizzes' ? 'active' : ''; ?>"><a href="/admin/quizzes">❓ クイズ</a></li>
    <li class="<?php echo $admin_view === 'applications' ? 'active' : ''; ?>"><a href="/admin/applications">📋 応募</a></li>
    <li class="<?php echo $admin_view === 'users' ? 'active' : ''; ?>"><a href="/admin/users">👥 ユーザー</a></li>
    <li class="<?php echo $admin_view === 'contact' ? 'active' : ''; ?>"><a href="/admin/contact">✉️ お問い合わせ</a></li>
    <li class="nav-section-title">設定</li>
    <li class="<?php echo $admin_view === 'pages' ? 'active' : ''; ?>"><a href="/admin/pages">📃 固定ページ</a></li>
    <li class="<?php echo $admin_view === 'plugins' ? 'active' : ''; ?>"><a href="/admin/plugins">🔌 プラグイン</a></li>
    <li class="<?php echo $admin_view === 'seo-geo' ? 'active' : ''; ?>"><a href="/admin/seo-geo">🌐 SEO/地域</a></li>
</ul>
