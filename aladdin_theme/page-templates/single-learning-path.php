<?php
/**
 * 学習パス詳細
 *
 * @package Aladdin_SAP_Panda
 */
$path_id = get_query_var( 'aladdin_item_id' );
$path    = $path_id ? aladdin_api_get( 'learning-paths/' . $path_id ) : null;

if ( ! $path ) {
    get_header(); echo '<div class="container"><p>学習パスが見つかりません。</p></div>'; get_footer(); return;
}

$steps = aladdin_api_get( 'learning-paths/' . $path_id . '/steps' ) ?: [];
$path_color = $path['accent_color'] ?? '#4CAF50';
get_header();
?>
<div class="container-narrow" style="padding-top:var(--spacing-xl);padding-bottom:var(--spacing-2xl);">
    <div class="breadcrumb">
        <a href="/">ホーム</a><span class="separator">›</span>
        <a href="/paths">学習パス</a><span class="separator">›</span>
        <span><?php echo esc_html( $path['title'] ?? '' ); ?></span>
    </div>
    <div style="background:<?php echo esc_attr( $path_color ); ?>15;border-radius:var(--radius-xl);padding:var(--spacing-xl);border-left:4px solid <?php echo esc_attr( $path_color ); ?>;">
        <h1 style="margin-bottom:var(--spacing-sm);"><?php echo esc_html( $path['title'] ?? '' ); ?></h1>
        <p style="color:var(--color-text-light);"><?php echo esc_html( $path['description'] ?? '' ); ?></p>
        <div style="display:flex;gap:var(--spacing-lg);margin-top:var(--spacing-md);font-size:var(--text-sm);color:var(--color-text-lighter);">
            <span>🎯 <?php echo esc_html( $path['target_audience'] ?? '全レベル' ); ?></span>
            <span>📚 <?php echo count( $steps ); ?>ステップ</span>
            <?php if ( ! empty( $path['estimated_hours'] ) ) : ?>
                <span>⏱ <?php echo esc_html( $path['estimated_hours'] ); ?>時間</span>
            <?php endif; ?>
        </div>
    </div>

    <?php if ( ! empty( $steps ) ) : ?>
    <div style="margin-top:var(--spacing-2xl);">
        <h2>学習ステップ</h2>
        <div style="display:flex;flex-direction:column;gap:var(--spacing-md);position:relative;">
            <?php foreach ( $steps as $i => $step ) : ?>
            <div style="display:flex;gap:var(--spacing-md);align-items:flex-start;">
                <div style="display:flex;flex-direction:column;align-items:center;">
                    <div style="width:40px;height:40px;border-radius:50%;background:<?php echo esc_attr( $path_color ); ?>;color:white;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;">
                        <?php echo $i + 1; ?>
                    </div>
                    <?php if ( $i < count( $steps ) - 1 ) : ?>
                        <div style="width:2px;flex:1;background:<?php echo esc_attr( $path_color ); ?>40;min-height:20px;"></div>
                    <?php endif; ?>
                </div>
                <div style="flex:1;background:var(--color-bg-card);border:1px solid var(--color-border-light);border-radius:var(--radius-lg);padding:var(--spacing-md);">
                    <h3 style="margin-bottom:var(--spacing-xs);"><?php echo esc_html( $step['title'] ?? '' ); ?></h3>
                    <p style="font-size:var(--text-sm);color:var(--color-text-light);margin-bottom:var(--spacing-sm);"><?php echo esc_html( $step['description'] ?? '' ); ?></p>
                    <div style="display:flex;flex-wrap:wrap;gap:var(--spacing-sm);">
                        <?php foreach ( ( $step['articles'] ?? [] ) as $art ) : ?>
                            <a href="/article/<?php echo esc_attr( ( $art['id'] ?? 0 ) . '/' . ( $art['slug'] ?? '' ) ); ?>" class="badge badge-primary">📄 <?php echo esc_html( $art['title'] ?? '' ); ?></a>
                        <?php endforeach; ?>
                        <?php foreach ( ( $step['courses'] ?? [] ) as $crs ) : ?>
                            <a href="/course/<?php echo esc_attr( $crs['id'] ?? 0 ); ?>" class="badge badge-accent">📚 <?php echo esc_html( $crs['title'] ?? '' ); ?></a>
                        <?php endforeach; ?>
                        <?php foreach ( ( $step['knowledge'] ?? [] ) as $kw ) : ?>
                            <a href="/knowledge/<?php echo esc_attr( ( $kw['id'] ?? 0 ) . '/' . ( $kw['slug'] ?? '' ) ); ?>" class="badge" style="background:#E8EAF6;color:#283593;">💡 <?php echo esc_html( $kw['title'] ?? '' ); ?></a>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
    <?php endif; ?>
</div>
<?php get_footer(); ?>
