<?php
/**
 * 案件カード
 */
$case = $args['case'] ?? [];
?>
<div class="case-card" onclick="window.location='/cases/<?php echo esc_attr( $case['id'] ?? 0 ); ?>'">
    <h3 class="case-card-title"><?php echo esc_html( $case['title'] ?? $case['post_title'] ?? '' ); ?></h3>
    <div class="case-card-meta">
        <span>💰 <?php echo esc_html( $case['salary_range'] ?? '要相談' ); ?></span>
        <span>📍 <?php echo esc_html( $case['location'] ?? '未定' ); ?></span>
        <?php if ( ! empty( $case['company'] ) ) : ?>
            <span>🏢 <?php echo esc_html( $case['company'] ); ?></span>
        <?php endif; ?>
    </div>
    <?php if ( ! empty( $case['module_slug'] ) ) : ?>
        <span class="module-badge" style="background:<?php echo esc_attr( aladdin_module_color( $case['module_slug'] ) ); ?>;margin-bottom:var(--spacing-sm);display:inline-block;">
            <?php echo esc_html( strtoupper( $case['module_slug'] ) ); ?>
        </span>
    <?php endif; ?>
    <p class="case-card-desc"><?php echo esc_html( $case['description'] ?? $case['excerpt'] ?? '' ); ?></p>
</div>
