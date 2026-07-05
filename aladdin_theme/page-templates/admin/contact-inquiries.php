<?php
$items = aladdin_api_get( 'contact/inquiries', [ 'per_page' => 50 ] ) ?: [];
get_header(); ?>
<div class="admin-layout"><aside class="admin-sidebar"><?php include ALADDIN_THEME_DIR . '/page-templates/admin/_sidebar.php'; ?></aside>
<main class="admin-content"><div class="admin-header"><h1>✉️ お問い合わせ管理</h1></div>
<table class="admin-table"><thead><tr><th>ID</th><th>名前</th><th>メール</th><th>日付</th><th>操作</th></tr></thead>
<tbody><?php foreach ( $items as $it ) : ?><tr><td><?php echo esc_html( $it['id'] ?? '' ); ?></td>
<td><?php echo esc_html( $it['name'] ?? '' ); ?></td>
<td><?php echo esc_html( $it['email'] ?? '' ); ?></td>
<td><?php echo esc_html( $it['date'] ?? '' ); ?></td>
<td class="actions"><a href="#" class="btn btn-sm btn-ghost">詳細</a></td></tr><?php endforeach; ?></tbody></table>
</main></div>
<?php get_footer(); ?>
