<?php
$sub_view = get_query_var( 'aladdin_sub_view' );
$item_id  = get_query_var( 'aladdin_item_id' );
$items    = aladdin_api_get( 'quizzes', [ 'per_page' => 50 ] ) ?: [];
get_header(); ?>
<div class="admin-layout"><aside class="admin-sidebar"><?php include ALADDIN_THEME_DIR . '/page-templates/admin/_sidebar.php'; ?></aside>
<main class="admin-content"><div class="admin-header"><h1>❓ クイズ管理</h1><a href="/admin/quizzes/new" class="btn btn-primary btn-sm">＋ 新規作成</a></div>
<?php if ( $sub_view === 'new' || ( $sub_view === 'edit' && $item_id ) ) : $item = $sub_view === 'edit' ? aladdin_api_get( 'quizzes/' . $item_id ) : []; ?>
<form method="post" class="admin-form">
  <div class="form-group"><label>問題</label><input type="text" name="question" class="form-input" value="<?php echo esc_attr( $item['question'] ?? '' ); ?>" required></div>
  <div class="form-group"><label>選択肢1</label><input type="text" name="option_0" class="form-input" value="<?php echo esc_attr( ( $item['options'] ?? [] )[0] ?? '' ); ?>"></div>
  <div class="form-group"><label>選択肢2</label><input type="text" name="option_1" class="form-input" value="<?php echo esc_attr( ( $item['options'] ?? [] )[1] ?? '' ); ?>"></div>
  <div class="form-group"><label>選択肢3</label><input type="text" name="option_2" class="form-input" value="<?php echo esc_attr( ( $item['options'] ?? [] )[2] ?? '' ); ?>"></div>
  <div class="form-group"><label>選択肢4</label><input type="text" name="option_3" class="form-input" value="<?php echo esc_attr( ( $item['options'] ?? [] )[3] ?? '' ); ?>"></div>
  <button type="submit" class="btn btn-primary">保存</button><a href="/admin/quizzes" class="btn btn-ghost">キャンセル</a>
</form>
<?php else : ?>
<table class="admin-table"><thead><tr><th>ID</th><th>問題</th><th>日付</th><th>操作</th></tr></thead>
<tbody><?php foreach ( $items as $it ) : ?><tr><td><?php echo esc_html( $it['id'] ?? '' ); ?></td>
<td><?php echo esc_html( wp_trim_words( $it['question'] ?? '', 10 ) ); ?></td>
<td><?php echo esc_html( $it['date'] ?? '' ); ?></td>
<td class="actions"><a href="/admin/quizzes/<?php echo esc_attr( $it['id'] ?? 0 ); ?>/edit" class="btn btn-sm btn-ghost">編集</a></td></tr><?php endforeach; ?></tbody></table>
<?php endif; ?></main></div>
<?php get_footer(); ?>
