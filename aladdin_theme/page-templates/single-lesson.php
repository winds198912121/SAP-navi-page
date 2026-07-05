<?php
/**
 * レッスン詳細ページ
 *
 * @package Aladdin_SAP_Panda
 */
$lesson_id = get_query_var( 'aladdin_item_id' );
$lesson    = $lesson_id ? aladdin_api_get( 'lessons/' . $lesson_id ) : null;

if ( ! $lesson ) {
    get_header(); echo '<div class="container"><p>レッスンが見つかりません。</p></div>'; get_footer(); return;
}

get_header();
?>
<div class="container-narrow" style="padding-top:var(--spacing-xl);padding-bottom:var(--spacing-2xl);">
    <div class="breadcrumb">
        <a href="/">ホーム</a><span class="separator">›</span>
        <span>レッスン: <?php echo esc_html( $lesson['title'] ?? '' ); ?></span>
    </div>
    <h1><?php echo esc_html( $lesson['title'] ?? $lesson['post_title'] ?? '' ); ?></h1>
    <div style="margin-top:var(--spacing-lg);">
        <?php
        $is_logged_in = is_user_logged_in();
        $content = $lesson['content'] ?? $lesson['post_content'] ?? '';
        if ( $is_logged_in ) {
            echo wp_kses_post( $content );
        } else {
            $cutoff = (int) ( mb_strlen( wp_strip_all_tags( $content ) ) * 0.3 );
            echo '<div class="content-locked"><div class="content-locked-content">';
            echo wp_kses_post( mb_substr( $content, 0, $cutoff ) );
            echo '</div></div>';
            echo '<div class="content-locked-banner"><h3>🔒 続きを読むにはログインが必要です</h3>';
            echo '<p>レッスンの全文はログイン後にご覧いただけます。</p>';
            echo '<a href="/login" class="btn btn-primary">ログイン</a></div>';
        }
        ?>
    </div>
</div>
<?php get_footer(); ?>
