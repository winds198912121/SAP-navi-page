<?php
/**
 * ナレッジベース詳細
 *
 * @package Aladdin_SAP_Panda
 */
$knowledge_id = get_query_var( 'aladdin_item_id' );
$knowledge    = $knowledge_id ? aladdin_api_get( 'knowledge/' . $knowledge_id ) : null;

if ( ! $knowledge ) {
    get_header(); echo '<div class="container"><p>ナレッジが見つかりません。</p></div>'; get_footer(); return;
}

get_header();
?>
<div class="container-narrow" style="padding-top:var(--spacing-xl);padding-bottom:var(--spacing-2xl);">
    <div class="breadcrumb">
        <a href="/">ホーム</a><span class="separator">›</span>
        <span>ナレッジ: <?php echo esc_html( $knowledge['title'] ?? '' ); ?></span>
    </div>
    <h1><?php echo esc_html( $knowledge['title'] ?? $knowledge['post_title'] ?? '' ); ?></h1>
    <?php if ( ! empty( $knowledge['module_slug'] ) ) : ?>
        <span class="module-badge" style="background:<?php echo esc_attr( aladdin_module_color( $knowledge['module_slug'] ) ); ?>">
            <?php echo esc_html( strtoupper( $knowledge['module_slug'] ) ); ?>
        </span>
    <?php endif; ?>
    <div style="margin-top:var(--spacing-lg);">
        <?php
        $content = $knowledge['content'] ?? $knowledge['post_content'] ?? '';
        if ( is_user_logged_in() ) {
            echo wp_kses_post( $content );
        } else {
            $cutoff = (int) ( mb_strlen( wp_strip_all_tags( $content ) ) * 0.3 );
            echo '<div class="content-locked">' . wp_kses_post( mb_substr( $content, 0, $cutoff ) ) . '</div>';
            echo '<div class="content-locked-banner"><h3>🔒 続きを読むにはログインが必要です</h3>';
            echo '<a href="/login" class="btn btn-primary">ログイン</a></div>';
        }
        ?>
    </div>
</div>
<?php get_footer(); ?>
