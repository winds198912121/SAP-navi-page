<?php
/**
 * 管理画面 ダッシュボード
 *
 * @package Aladdin_SAP_Panda
 */
$stats = aladdin_api_get( 'admin/stats' ) ?: [];
$admin_view = get_query_var( 'aladdin_admin_view' );

get_header();
?>
<div class="admin-layout">
    <aside class="admin-sidebar">
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
    </aside>
    <main class="admin-content">
        <div class="admin-header">
            <h1>📊 ダッシュボード</h1>
        </div>
        <div class="admin-stats">
            <div class="admin-stat-card">
                <div class="admin-stat-value"><?php echo esc_html( $stats['articles'] ?? 0 ); ?></div>
                <div class="admin-stat-label">記事数</div>
            </div>
            <div class="admin-stat-card">
                <div class="admin-stat-value"><?php echo esc_html( $stats['courses'] ?? 0 ); ?></div>
                <div class="admin-stat-label">コース数</div>
            </div>
            <div class="admin-stat-card">
                <div class="admin-stat-value"><?php echo esc_html( $stats['users'] ?? 0 ); ?></div>
                <div class="admin-stat-label">ユーザー数</div>
            </div>
            <div class="admin-stat-card">
                <div class="admin-stat-value"><?php echo esc_html( $stats['cases'] ?? 0 ); ?></div>
                <div class="admin-stat-label">案件数</div>
            </div>
            <div class="admin-stat-card">
                <div class="admin-stat-value"><?php echo esc_html( $stats['quizzes'] ?? 0 ); ?></div>
                <div class="admin-stat-label">クイズ数</div>
            </div>
            <div class="admin-stat-card">
                <div class="admin-stat-value"><?php echo esc_html( $stats['videos'] ?? 0 ); ?></div>
                <div class="admin-stat-label">動画数</div>
            </div>
        </div>
    </main>
</div>
<?php get_footer(); ?>
