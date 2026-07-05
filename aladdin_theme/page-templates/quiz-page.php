<?php
/**
 * クイズページ
 *
 * @package Aladdin_SAP_Panda
 */
$today_quiz = aladdin_api_get( 'quizzes/today' );
get_header();
?>
<div class="container" style="padding-top:var(--spacing-xl);padding-bottom:var(--spacing-2xl);">
    <div class="breadcrumb">
        <a href="/">ホーム</a><span class="separator">›</span>
        <span>今日のクイズ</span>
    </div>
    <h1>今日のクイズ</h1>
    <?php if ( $today_quiz ) : ?>
    <div id="quiz-container" class="quiz-card"></div>
    <script id="quiz-data" type="application/json"><?php echo wp_json_encode( $today_quiz ); ?></script>
    <?php else : ?>
    <div class="empty-state">
        <div class="empty-state-icon">❓</div>
        <p>今日のクイズは準備中です。</p>
    </div>
    <?php endif; ?>
</div>
<?php get_footer(); ?>
