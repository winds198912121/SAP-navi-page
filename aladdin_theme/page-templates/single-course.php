<?php
/**
 * コース詳細ページ
 *
 * @package Aladdin_SAP_Panda
 */
$course_id = get_query_var( 'aladdin_item_id' );
$course    = $course_id ? aladdin_api_get( 'courses/' . $course_id ) : null;

if ( ! $course ) {
    get_header(); echo '<div class="container"><p>コースが見つかりません。</p></div>'; get_footer(); return;
}

$lessons = aladdin_api_get( 'courses/' . $course_id . '/lessons' ) ?: [];
get_header();
?>
<div class="container-narrow" style="padding-top:var(--spacing-xl);padding-bottom:var(--spacing-2xl);">
    <div class="breadcrumb">
        <a href="/">ホーム</a><span class="separator">›</span>
        <span>コース: <?php echo esc_html( $course['title'] ?? '' ); ?></span>
    </div>
    <h1><?php echo esc_html( $course['title'] ?? '' ); ?></h1>
    <div style="color:var(--color-text-light);margin-bottom:var(--spacing-lg);font-size:var(--text-sm);">
        <?php if ( ! empty( $course['module_slug'] ) ) : ?>
            <span class="module-badge" style="background:<?php echo esc_attr( aladdin_module_color( $course['module_slug'] ) ); ?>">
                <?php echo esc_html( strtoupper( $course['module_slug'] ) ); ?>
            </span>
        <?php endif; ?>
        <span>📚 全<?php echo count( $lessons ); ?>レッスン</span>
    </div>
    <div style="margin-bottom:var(--spacing-xl);"><?php echo wp_kses_post( $course['description'] ?? $course['content'] ?? '' ); ?></div>

    <?php if ( ! empty( $lessons ) ) : ?>
    <h2>レッスン</h2>
    <div style="display:flex;flex-direction:column;gap:var(--spacing-sm);">
        <?php foreach ( $lessons as $i => $ls ) : ?>
        <div style="display:flex;align-items:center;gap:var(--spacing-md);padding:var(--spacing-md);background:var(--color-bg-card);border:1px solid var(--color-border-light);border-radius:var(--radius-md);">
            <span style="width:28px;height:28px;border-radius:50%;background:var(--color-primary-bg);color:var(--color-primary);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:var(--text-sm);flex-shrink:0;">
                <?php echo $i + 1; ?>
            </span>
            <div style="flex:1;">
                <strong><a href="/lesson/<?php echo esc_attr( ( $ls['id'] ?? 0 ) . '/' . ( $ls['slug'] ?? '' ) ); ?>" style="color:var(--color-text);">
                    <?php echo esc_html( $ls['title'] ?? $ls['post_title'] ?? '' ); ?>
                </a></strong>
                <div style="font-size:var(--text-xs);color:var(--color-text-lighter);">
                    <?php echo esc_html( $ls['duration'] ?? '' ); ?>
                </div>
            </div>
        </div>
        <?php endforeach; ?>
    </div>
    <?php endif; ?>
</div>
<?php get_footer(); ?>
