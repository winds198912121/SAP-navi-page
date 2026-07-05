<?php
/**
 * 案件一覧ページ
 *
 * @package Aladdin_SAP_Panda
 */
$cases = aladdin_api_get( 'cases', [ 'per_page' => 20 ] ) ?: [];
$modules = aladdin_api_get( 'modules' ) ?: [];
get_header();
?>
<div class="container" style="padding-top:var(--spacing-xl);padding-bottom:var(--spacing-2xl);">
    <div class="breadcrumb">
        <a href="/">ホーム</a><span class="separator">›</span>
        <span>案件一覧</span>
    </div>
    <h1>案件一覧</h1>
    <p style="color:var(--color-text-light);margin-bottom:var(--spacing-xl);">
        SAPコンサルタントの案件を探す
    </p>

    <div class="filter-bar">
        <a href="/cases" class="filter-btn active">すべて</a>
        <?php foreach ( $modules as $mod ) : ?>
            <a href="/cases?module=<?php echo esc_attr( $mod['slug'] ?? '' ); ?>" class="filter-btn">
                <?php echo esc_html( strtoupper( $mod['slug'] ?? '' ) ); ?>
            </a>
        <?php endforeach; ?>
    </div>

    <?php if ( ! empty( $cases ) ) : ?>
    <div class="case-grid">
        <?php foreach ( $cases as $case ) : ?>
        <div class="case-card" onclick="window.location='/cases/<?php echo esc_attr( $case['id'] ?? 0 ); ?>'">
            <h3 class="case-card-title"><?php echo esc_html( $case['title'] ?? $case['post_title'] ?? '' ); ?></h3>
            <div class="case-card-meta">
                <span>💰 <?php echo esc_html( $case['salary_range'] ?? '要相談' ); ?></span>
                <span>📍 <?php echo esc_html( $case['location'] ?? '未定' ); ?></span>
                <span>🏢 <?php echo esc_html( $case['company'] ?? '' ); ?></span>
            </div>
            <?php if ( ! empty( $case['module_slug'] ) ) : ?>
                <span class="module-badge" style="background:<?php echo esc_attr( aladdin_module_color( $case['module_slug'] ) ); ?>;margin-bottom:var(--spacing-sm);display:inline-block;">
                    <?php echo esc_html( strtoupper( $case['module_slug'] ) ); ?>
                </span>
            <?php endif; ?>
            <p class="case-card-desc"><?php echo esc_html( $case['description'] ?? $case['excerpt'] ?? '' ); ?></p>
        </div>
        <?php endforeach; ?>
    </div>
    <?php else : ?>
    <div class="empty-state"><div class="empty-state-icon">💼</div><p>現在募集中の案件はありません。</p></div>
    <?php endif; ?>
</div>
<?php get_footer(); ?>
