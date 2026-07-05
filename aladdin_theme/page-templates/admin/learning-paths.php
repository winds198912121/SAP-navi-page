<?php
$sub_view = get_query_var( 'aladdin_sub_view' );
$item_id  = get_query_var( 'aladdin_item_id' );
$items    = aladdin_api_get( 'learning-paths' ) ?: [];
get_header(); ?>
<div class="admin-layout"><aside class="admin-sidebar"><?php include ALADDIN_THEME_DIR . '/page-templates/admin/_sidebar.php'; ?></aside>
<main class="admin-content"><div class="admin-header"><h1>🎯 学習パス管理</h1><a href="/admin/learning-paths/new" class="btn btn-primary btn-sm">＋ 新規作成</a></div>
<?php if ( $sub_view === 'new' || ( $sub_view === 'edit' && $item_id ) ) : $item = $sub_view === 'edit' ? aladdin_api_get( 'learning-paths/' . $item_id ) : []; ?>
<form method="post" class="admin-form">
  <div class="form-group"><label>タイトル</label><input type="text" name="title" class="form-input" value="<?php echo esc_attr( $item['title'] ?? '' ); ?>" required></div>
  <div class="form-group"><label>説明</label><textarea name="description" class="form-input" rows="4"><?php echo esc_textarea( $item['description'] ?? '' ); ?></textarea></div>
  <div class="form-group"><label>対象者</label><input type="text" name="target" class="form-input" value="<?php echo esc_attr( $item['target_audience'] ?? '' ); ?>"></div>
  <div class="form-group"><label>標準時間（時間）</label><input type="number" name="hours" class="form-input" value="<?php echo esc_attr( $item['estimated_hours'] ?? '' ); ?>"></div>
  <button type="submit" class="btn btn-primary">保存</button><a href="/admin/learning-paths" class="btn btn-ghost">キャンセル</a>
</form>
<?php else : ?>
<table class="admin-table"><thead><tr><th>ID</th><th>タイトル</th><th>ステップ数</th><th>操作</th></tr></thead>
<tbody><?php foreach ( $items as $it ) : ?><tr><td><?php echo esc_html( $it['id'] ?? '' ); ?></td>
<td><?php echo esc_html( $it['title'] ?? '' ); ?></td>
<td><?php echo esc_html( count( $it['steps'] ?? [] ) ); ?></td>
<td class="actions"><a href="/admin/learning-paths/<?php echo esc_attr( $it['id'] ?? 0 ); ?>/edit" class="btn btn-sm btn-ghost">編集</a></td></tr><?php endforeach; ?></tbody></table>
<?php endif; ?></main></div>
<?php get_footer(); ?>
