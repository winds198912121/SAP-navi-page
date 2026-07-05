<?php
$items = aladdin_api_get( 'applications', [ 'per_page' => 50 ] ) ?: [];
get_header(); ?>
<div class="admin-layout"><aside class="admin-sidebar"><?php include ALADDIN_THEME_DIR . '/page-templates/admin/_sidebar.php'; ?></aside>
<main class="admin-content"><div class="admin-header"><h1>📋 応募管理</h1></div>
<table class="admin-table"><thead><tr><th>ID</th><th>案件</th><th>応募者</th><th>日付</th><th>ステータス</th></tr></thead>
<tbody><?php foreach ( $items as $it ) : ?><tr><td><?php echo esc_html( $it['id'] ?? '' ); ?></td>
<td><?php echo esc_html( $it['case_title'] ?? '' ); ?></td>
<td><?php echo esc_html( $it['applicant_name'] ?? '' ); ?></td>
<td><?php echo esc_html( $it['date'] ?? '' ); ?></td>
<td><span class="badge badge-primary"><?php echo esc_html( $it['status'] ?? 'pending' ); ?></span></td></tr><?php endforeach; ?></tbody></table>
</main></div>
<?php get_footer(); ?>
