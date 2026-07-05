<?php
$items = aladdin_api_get( 'users', [ 'per_page' => 50 ] ) ?: [];
get_header(); ?>
<div class="admin-layout"><aside class="admin-sidebar"><?php include ALADDIN_THEME_DIR . '/page-templates/admin/_sidebar.php'; ?></aside>
<main class="admin-content"><div class="admin-header"><h1>👥 ユーザー管理</h1></div>
<table class="admin-table"><thead><tr><th>ID</th><th>表示名</th><th>メール</th><th>ロール</th><th>操作</th></tr></thead>
<tbody><?php foreach ( $items as $it ) : ?><tr><td><?php echo esc_html( $it['id'] ?? '' ); ?></td>
<td><?php echo esc_html( $it['display_name'] ?? $it['name'] ?? '' ); ?></td>
<td><?php echo esc_html( $it['email'] ?? '' ); ?></td>
<td><?php echo esc_html( $it['role'] ?? '' ); ?></td>
<td class="actions"><a href="/admin/users/<?php echo esc_attr( $it['id'] ?? 0 ); ?>/edit" class="btn btn-sm btn-ghost">編集</a></td></tr><?php endforeach; ?></tbody></table>
</main></div>
<?php get_footer(); ?>
