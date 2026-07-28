<?php
/**
 * Search page
 */
get_header();

$query    = trim( $_GET['q'] ?? '' );
$articles = $query ? panda_api_get( 'articles', [ 'search' => $query, 'per_page' => 20 ] ) : [];
?>
<div id="primary" class="content-area">
    <main id="main" class="site-main">
        <div class="page-bg"></div>
        <section class="section" style="padding-top:48px">
            <div class="section-head">
                <div>
                    <div class="label">Search</div>
                    <h2>記事検索<span class="accent-mark">.</span></h2>
                </div>
            </div>
            <div style="max-width:640px;margin:0 auto 32px">
                <form role="search" method="get" action="<?php echo esc_url( home_url( '/search' ) ); ?>">
                    <div style="display:flex;gap:8px">
                        <input type="search" name="q" value="<?php echo esc_attr( $query ); ?>"
                               placeholder="モジュール、用語、エラー番号..."
                               style="flex:1;padding:12px 16px;border-radius:999px;border:1.5px solid var(--line-2);background:var(--bg-1);font-family:inherit;font-size:14px;outline:none">
                        <button type="submit" class="btn primary">検索</button>
                    </div>
                </form>
            </div>
            <?php if ( $query && ! empty( $articles ) ) : ?>
                <div style="max-width:800px;margin:0 auto">
                    <p style="font-size:13px;color:var(--ink-3);margin-bottom:16px">「<?php echo esc_html( $query ); ?>」の検索結果: <?php echo count( $articles ); ?>件</p>
                    <div class="article-list">
                        <?php foreach ( $articles as $art ) :
                            $mod_slug  = $art['module']['slug'] ?? '';
                            $diff_slug = $art['difficulty']['slug'] ?? '';
                            $color     = $mod_slug ? panda_module_color( $mod_slug ) : 'var(--accent)';
                        ?>
                            <a href="<?php echo esc_url( home_url( '/article/' . $art['id'] . '/' . ( $art['slug'] ?? '' ) ) ); ?>" class="article-row">
                                <div class="article-thumb" style="background:<?php echo esc_attr( $color . '22' ); ?>">
                                    <span><?php echo esc_html( strtoupper( $mod_slug ?: '?' ) ); ?></span>
                                </div>
                                <div>
                                    <div class="article-meta-top">
                                        <?php if ( $mod_slug ) : ?>
                                            <span class="tag-mod"><?php echo esc_html( strtoupper( $mod_slug ) ); ?></span>
                                        <?php endif; ?>
                                        <?php if ( $diff_slug ) : ?>
                                            <span class="tag-diff <?php echo esc_attr( panda_difficulty_class( $diff_slug ) ); ?>"><?php echo esc_html( panda_difficulty_label( $diff_slug ) ); ?></span>
                                        <?php endif; ?>
                                    </div>
                                    <h3><?php echo esc_html( $art['title'] ); ?></h3>
                                    <div class="excerpt"><?php echo esc_html( panda_excerpt( $art['excerpt'] ?? '', 100 ) ); ?></div>
                                </div>
                            </a>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php elseif ( $query && empty( $articles ) ) : ?>
                <div class="empty-state">
                    <div class="empty-state-icon">🔍</div>
                    <p>「<?php echo esc_html( $query ); ?>」に一致する記事が見つかりませんでした。</p>
                </div>
            <?php else : ?>
                <div class="empty-state">
                    <div class="empty-state-icon">🔍</div>
                    <p>キーワードを入力して検索してください。</p>
                </div>
            <?php endif; ?>
        </section>
    </main>
</div>
<?php get_footer(); ?>
