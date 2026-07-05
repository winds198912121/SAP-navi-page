<?php
$sub_view = get_query_var( 'aladdin_sub_view' );
$items    = aladdin_api_get( 'modules' ) ?: [];
get_header(); ?>
<div class="admin-layout"><aside class="admin-sidebar"><?php include ALADDIN_THEME_DIR . '/page-templates/admin/_sidebar.php'; ?></aside>
<main class="admin-content"><div class="admin-header"><h1>🔧 モジュール管理</h1></div>
<table class="admin-table"><thead><tr><th>スラッグ</th><th>名前</th><th>記事数</th><th>操作</th></tr></thead>
<tbody><?php foreach ( $items as $it ) : ?><tr><td><?php echo esc_html( $it['slug'] ?? '' ); ?></td>
<td><?php echo esc_html( $it['name'] ?? '' ); ?></td>
<td><?php echo esc_html( $it['article_count'] ?? 0 ); ?></td>
<td class="actions"><a href="/admin/modules/<?php echo esc_attr( $it['slug'] ?? '' ); ?>/edit" class="btn btn-sm btn-ghost">編集</a></td></tr><?php endforeach; ?></tbody></table>
</main></div>
<?php get_footer(); ?>
