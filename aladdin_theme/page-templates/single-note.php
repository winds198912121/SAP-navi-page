<?php
/**
 * ノート詳細ページ
 *
 * @package Aladdin_SAP_Panda
 */
$note_id = get_query_var( 'aladdin_item_id' );
$note    = $note_id ? aladdin_api_get( 'notes/' . $note_id ) : null;

if ( ! $note ) {
    get_header(); echo '<div class="container"><p>ノートが見つかりません。</p></div>'; get_footer(); return;
}

get_header();
?>
<div class="container-narrow" style="padding-top:var(--spacing-xl);padding-bottom:var(--spacing-2xl);">
    <div class="breadcrumb">
        <a href="/">ホーム</a><span class="separator">›</span>
        <span>ノート</span>
    </div>
    <h1><?php echo esc_html( $note['title'] ?? $note['post_title'] ?? '' ); ?></h1>
    <div style="color:var(--color-text-lighter);font-size:var(--text-sm);margin-bottom:var(--spacing-lg);">
        📅 <?php echo esc_html( date_i18n( 'Y/m/d H:i', strtotime( $note['date'] ?? $note['post_date'] ?? '' ) ) ); ?>
    </div>
    <div><?php echo wp_kses_post( $note['content'] ?? $note['post_content'] ?? '' ); ?></div>
</div>
<?php get_footer(); ?>
