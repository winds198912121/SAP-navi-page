<?php
/**
 * Homepage — SAP Panda Kadence child theme
 *
 * Next.js版のホームページをPHPで再現。
 * Hero, モジュールグリッド, 学習パス, 記事, クイズ, YouTube, ニュースレター。
 *
 * @package Panda_Sensei_Child
 */

// APIからデータを取得（フォールバック付き）
$modules  = panda_api_get( 'modules' ) ?: panda_default_modules();
$paths    = panda_api_get( 'learning-paths' ) ?: panda_default_paths();
$articles = panda_api_get( 'articles', [ 'per_page' => 3 ] ) ?: panda_default_articles();
$videos   = panda_api_get( 'videos', [ 'per_page' => 8 ] ) ?: panda_default_videos();
$quiz     = panda_api_get( 'quiz/today' );

$top10 = [
    '【保存版】SAP用語集 — はじめての100単語',
    'BAPI とは何か、なぜ使うのか — 5分で理解',
    'Fiori vs SAP GUI — 結局どう使い分ける？',
    'T-Code 早見表（よく使う 50 個）',
    'ABAP オブジェクト指向 完全入門',
    'MMの移動タイプ、覚えるならこの10個',
    'S/4HANA 1909 → 2023 アップグレード手順',
    '新人コンサルが最初に読むべき本ベスト5',
    'BW/4HANA で BI 案件に挑戦するには',
    'パンダ先生に聞く：転職タイミングの見極め方',
];
get_header(); ?>
<div id="primary" class="content-area">
    <main id="main" class="site-main">

        <?php include PANDA_CHILD_DIR . '/template-parts/home/hero.php'; ?>

        <?php include PANDA_CHILD_DIR . '/template-parts/home/cases-ticker.php'; ?>

        <?php include PANDA_CHILD_DIR . '/template-parts/home/modules-grid.php'; ?>

        <?php include PANDA_CHILD_DIR . '/template-parts/home/learning-paths.php'; ?>

        <?php include PANDA_CHILD_DIR . '/template-parts/home/articles-section.php'; ?>

        <?php if ( $quiz ) : ?>
            <?php include PANDA_CHILD_DIR . '/template-parts/home/quiz-section.php'; ?>
        <?php endif; ?>

        <?php if ( $videos ) : ?>
            <?php include PANDA_CHILD_DIR . '/template-parts/home/video-section.php'; ?>
        <?php endif; ?>

        <?php include PANDA_CHILD_DIR . '/template-parts/home/newsletter.php'; ?>

    </main>
</div>
<?php get_footer(); ?>
