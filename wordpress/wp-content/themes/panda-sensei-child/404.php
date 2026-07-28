<?php
/**
 * 404 page
 */
get_header(); ?>
<div id="primary" class="content-area">
    <main id="main" class="site-main">
        <div class="page-bg"></div>
        <div class="not-found" style="text-align:center;padding:80px 20px;position:relative;z-index:2">
            <div style="font-size:72px;margin-bottom:16px;line-height:1">🔍</div>
            <h1 style="font-family:var(--font-heading);font-size:48px;color:var(--ink-0);margin:0 0 8px">404</h1>
            <p style="font-size:16px;color:var(--ink-2);margin:0 0 24px">お探しのページは見つかりませんでした。</p>
            <div style="display:flex;gap:12px;justify-content:center">
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="btn primary">ホームに戻る</a>
                <a href="<?php echo esc_url( home_url( '/search' ) ); ?>" class="btn outline">記事を検索</a>
            </div>
        </div>
    </main>
</div>
<?php get_footer(); ?>
