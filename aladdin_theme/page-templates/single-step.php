<?php
/**
 * ステップ詳細ページ
 *
 * @package Aladdin_SAP_Panda
 */
$step_id = get_query_var( 'aladdin_item_id' );
$step    = $step_id ? aladdin_api_get( 'steps/' . $step_id ) : null;

if ( ! $step ) {
    get_header(); echo '<div class="container"><p>ステップが見つかりません。</p></div>'; get_footer(); return;
}
get_header();
?>
<div class="container-narrow" style="padding-top:var(--spacing-xl);padding-bottom:var(--spacing-2xl);">
    <div class="breadcrumb">
        <a href="/">ホーム</a><span class="separator">›</span>
        <a href="/paths">学習パス</a><span class="separator">›</span>
        <span><?php echo esc_html( $step['title'] ?? '' ); ?></span>
    </div>
    <h1><?php echo esc_html( $step['title'] ?? '' ); ?></h1>
    <p style="color:var(--color-text-light);"><?php echo esc_html( $step['description'] ?? '' ); ?></p>
    <div style="margin-top:var(--spacing-lg);">
        <?php echo wp_kses_post( $step['content'] ?? '' ); ?>
    </div>
</div>
<?php get_footer(); ?>
