<?php
/**
 * プロフィールページ（要ログイン）
 *
 * @package Aladdin_SAP_Panda
 */
if ( ! is_user_logged_in() ) {
    wp_redirect( '/login' ); exit;
}
$current_user = wp_get_current_user();
$points = aladdin_api_get( 'points' );
$stats  = aladdin_api_get( 'quiz/stats' );
get_header();
?>
<div class="container profile-page">
    <div class="profile-header">
        <div class="profile-avatar">
            <?php echo esc_html( strtoupper( mb_substr( $current_user->display_name, 0, 1 ) ) ); ?>
        </div>
        <div class="profile-info">
            <h2><?php echo esc_html( $current_user->display_name ); ?></h2>
            <p><?php echo esc_html( $current_user->user_email ); ?></p>
        </div>
    </div>

    <div class="profile-stats">
        <div class="stat-card">
            <div class="stat-value"><?php echo esc_html( $points['total'] ?? 0 ); ?></div>
            <div class="stat-label">獲得ポイント</div>
        </div>
        <div class="stat-card">
            <div class="stat-value"><?php echo esc_html( $points['daily_streak'] ?? 0 ); ?></div>
            <div class="stat-label">連続ログイン日数</div>
        </div>
        <div class="stat-card">
            <div class="stat-value"><?php echo esc_html( $stats['total_answered'] ?? 0 ); ?></div>
            <div class="stat-label">回答数</div>
        </div>
        <div class="stat-card">
            <div class="stat-value"><?php echo esc_html( $stats['correct_rate'] ?? 0 ); ?>%</div>
            <div class="stat-label">正答率</div>
        </div>
    </div>

    <div style="text-align:center;">
        <a href="#" id="claim-points-btn" class="btn btn-primary">每日ポイントを受け取る</a>
    </div>
</div>
<script>
document.getElementById('claim-points-btn')?.addEventListener('click', async function(e) {
    e.preventDefault();
    try {
        const data = await (await fetch(ALADDIN_DATA.restUrl + 'points/daily', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + (document.cookie.match(/aladdin_token=([^;]+)/) || [])[1], 'Content-Type': 'application/json' }
        })).json();
        if (data.success) alert('ポイントを受け取りました！');
    } catch(e) { alert('エラーが発生しました。'); }
});
</script>
<?php get_footer(); ?>
