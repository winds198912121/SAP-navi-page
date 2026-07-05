<?php
$items = aladdin_api_get( 'admin/plugins' ) ?: [];
get_header(); ?>
<div class="admin-layout"><aside class="admin-sidebar"><?php include ALADDIN_THEME_DIR . '/page-templates/admin/_sidebar.php'; ?></aside>
<main class="admin-content"><div class="admin-header"><h1>🔌 プラグイン管理</h1></div>
<table class="admin-table"><thead><tr><th>プラグイン名</th><th>ステータス</th><th>操作</th></tr></thead>
<tbody><?php foreach ( $items as $it ) : ?><tr>
<td><?php echo esc_html( $it['name'] ?? '' ); ?></td>
<td><span class="badge <?php echo $it['active'] ? 'badge-primary' : ''; ?>"><?php echo $it['active'] ? '有効' : '無効'; ?></span></td>
<td class="actions"><a href="#" class="btn btn-sm btn-ghost"><?php echo $it['active'] ? '無効化' : '有効化'; ?></a></td>
</tr><?php endforeach; ?></tbody></table>
</main></div>
<?php get_footer(); ?>
