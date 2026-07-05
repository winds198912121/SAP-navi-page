<?php
$items = aladdin_api_get( 'pages' ) ?: [];
get_header(); ?>
<div class="admin-layout"><aside class="admin-sidebar"><?php include ALADDIN_THEME_DIR . '/page-templates/admin/_sidebar.php'; ?></aside>
<main class="admin-content"><div class="admin-header"><h1>📃 固定ページ管理</h1></div>
<table class="admin-table"><thead><tr><th>スラッグ</th><th>タイトル</th><th>操作</th></tr></thead>
<tbody><?php foreach ( $items as $it ) : ?><tr><td><?php echo esc_html( $it['slug'] ?? '' ); ?></td>
<td><?php echo esc_html( $it['title'] ?? '' ); ?></td>
<td class="actions"><a href="#" class="btn btn-sm btn-ghost">編集</a></td></tr><?php endforeach; ?></tbody></table>
</main></div>
<?php get_footer(); ?>
