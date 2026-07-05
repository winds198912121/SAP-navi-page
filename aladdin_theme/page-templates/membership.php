<?php
/**
 * 会員プランページ
 *
 * @package Aladdin_SAP_Panda
 */
$plans = aladdin_api_get( 'membership/plans' ) ?: [];
get_header();
?>
<div class="container" style="padding-top:var(--spacing-xl);padding-bottom:var(--spacing-2xl);">
    <div class="section-title">
        <h2>会員プラン</h2>
        <p>あなたに最適なプランをお選びください</p>
    </div>
    <div class="grid-3" style="max-width:900px;margin:0 auto;">
        <?php foreach ( $plans as $plan ) : ?>
        <div class="card" style="text-align:center;padding:var(--spacing-xl);">
            <h3 style="margin-bottom:var(--spacing-md);"><?php echo esc_html( $plan['name'] ?? '' ); ?></h3>
            <div style="font-family:var(--font-heading);font-size:2.5rem;font-weight:900;color:var(--color-primary);margin-bottom:var(--spacing-sm);">
                ¥<?php echo esc_html( number_format( $plan['price'] ?? 0 ) ); ?>
            </div>
            <div style="font-size:var(--text-sm);color:var(--color-text-lighter);margin-bottom:var(--spacing-lg);">
                / <?php echo esc_html( $plan['interval'] ?? '月' ); ?>
            </div>
            <p style="font-size:var(--text-sm);color:var(--color-text-light);margin-bottom:var(--spacing-lg);">
                <?php echo esc_html( $plan['description'] ?? '' ); ?>
            </p>
            <ul style="list-style:none;padding:0;text-align:left;margin-bottom:var(--spacing-lg);">
                <?php foreach ( ( $plan['features'] ?? [] ) as $feature ) : ?>
                <li style="padding:4px 0;">✅ <?php echo esc_html( $feature ); ?></li>
                <?php endforeach; ?>
            </ul>
            <a href="<?php echo is_user_logged_in() ? '#' : '/login'; ?>" class="btn btn-primary btn-block">
                <?php echo is_user_logged_in() ? '購読する' : 'ログインして購読'; ?>
            </a>
        </div>
        <?php endforeach; ?>
    </div>
</div>
<?php get_footer(); ?>
