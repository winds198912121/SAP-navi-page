<?php
get_header(); ?>
<div class="admin-layout"><aside class="admin-sidebar"><?php include ALADDIN_THEME_DIR . '/page-templates/admin/_sidebar.php'; ?></aside>
<main class="admin-content"><div class="admin-header"><h1>🌐 SEO/地域設定</h1></div>
<div class="admin-form" style="max-width:600px;">
  <div class="form-group"><label>サイトタイトル</label><input type="text" class="form-input" value="<?php bloginfo( 'name' ); ?>"></div>
  <div class="form-group"><label>サイト説明</label><textarea class="form-input" rows="3"><?php bloginfo( 'description' ); ?></textarea></div>
  <button class="btn btn-primary">保存</button>
</div></main></div>
<?php get_footer(); ?>
