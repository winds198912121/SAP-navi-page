<?php
/**
 * 学習パス一覧
 *
 * @package Aladdin_SAP_Panda
 */
$paths = aladdin_api_get( 'learning-paths' ) ?: [];
get_header();
?>
<div class="container" style="padding-top:var(--spacing-xl);padding-bottom:var(--spacing-2xl);">
    <div class="breadcrumb">
        <a href="/">ホーム</a><span class="separator">›</span>
        <span>学習パス</span>
    </div>
    <h1>学習パス</h1>
    <p style="color:var(--color-text-light);margin-bottom:var(--spacing-xl);">
        目的別に最適な学習ルートを選びましょう。
    </p>
    <?php if ( ! empty( $paths ) ) : ?>
    <div class="path-list">
        <?php foreach ( $paths as $path ) :
            $color = $path['accent_color'] ?? '#4CAF50';
        ?>
        <a href="/learning/<?php echo esc_attr( $path['id'] ?? 0 ); ?>" class="path-card" style="text-decoration:none;color:inherit;">
            <div class="path-card-header" style="background:<?php echo esc_attr( $color ); ?>">
                <h3 class="path-card-title"><?php echo esc_html( $path['title'] ?? '' ); ?></h3>
                <p class="path-card-subtitle"><?php echo esc_html( $path['target_audience'] ?? '' ); ?></p>
            </div>
            <div class="path-card-body">
                <div class="path-card-meta">
                    <span>📚 <?php echo count( $path['steps'] ?? [] ); ?>ステップ</span>
                    <?php if ( ! empty( $path['estimated_hours'] ) ) : ?>
                        <span>⏱ <?php echo esc_html( $path['estimated_hours'] ); ?>時間</span>
                    <?php endif; ?>
                </div>
                <p class="path-card-desc"><?php echo esc_html( $path['description'] ?? '' ); ?></p>
            </div>
        </a>
        <?php endforeach; ?>
    </div>
    <?php else : ?>
    <div class="empty-state"><div class="empty-state-icon">🗺️</div><p>学習パスがまだありません。</p></div>
    <?php endif; ?>
</div>
<?php get_footer(); ?>
