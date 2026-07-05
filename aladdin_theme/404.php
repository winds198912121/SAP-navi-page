<?php
/**
 * 404 ページ
 *
 * @package Aladdin_SAP_Panda
 */
get_header();
?>
<div class="container aladdin-404">
    <div class="error-404-content">
        <div class="error-404-icon">🐼</div>
        <h1>404</h1>
        <p class="error-404-text">お探しのページは見つかりませんでした。</p>
        <p class="error-404-desc">申し訳ありませんが、ページが移動または削除された可能性があります。</p>
        <div class="error-404-actions">
            <a href="/" class="btn btn-primary">トップページへ</a>
            <a href="/search" class="btn btn-outline">検索する</a>
        </div>
    </div>
</div>
<?php
get_footer();
