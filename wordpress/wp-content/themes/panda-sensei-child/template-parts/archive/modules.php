<?php
/**
 * Module archive — モジュール一覧
 */
get_header();

$modules = panda_api_get( 'modules' ) ?: panda_default_modules();
?>
<div id="primary" class="content-area">
    <main id="main" class="site-main">
        <div class="page-bg"></div>
        <section class="section" style="padding-top:48px">
            <div class="section-head">
                <div>
                    <div class="label">SAP Modules</div>
                    <h2>SAPモジュール一覧<span class="accent-mark">.</span></h2>
                </div>
                <div class="desc">主要9モジュールを網羅。各モジュールの記事をまとめてチェック。</div>
            </div>
            <div class="module-grid">
                <?php foreach ( $modules as $m ) :
                    $slug  = $m['slug'] ?? '';
                    $color = $m['color'] ?? panda_module_color( $slug );
                    $bg    = $m['bg_color'] ?? $color . '20';
                ?>
                    <a href="<?php echo esc_url( home_url( '/category/' . $slug ) ); ?>" class="mod-card"
                       style="--card-color:<?php echo esc_attr( $color ); ?>;--card-bg:<?php echo esc_attr( $bg ); ?>">
                        <div class="mod-top">
                            <div class="mod-icon"><?php echo esc_html( $m['code'] ?? strtoupper( $slug ) ); ?></div>
                        </div>
                        <div class="mod-name-ja"><?php echo esc_html( $m['name_ja'] ?? $slug ); ?></div>
                        <div class="mod-code"><?php echo esc_html( ( $m['name_en'] ?? '' ) . ' · ' . ( $m['code'] ?? strtoupper( $slug ) ) ); ?></div>
                        <div class="mod-desc"><?php echo esc_html( $m['description'] ?? '' ); ?></div>
                        <div class="mod-foot">
                            <span class="count"><?php echo (int) ( $m['article_count'] ?? 0 ); ?>本の記事</span>
                            <?php if ( ! empty( $m['levels'] ) ) : ?>
                                <div class="level-tags">
                                    <?php foreach ( $m['levels'] as $j => $lv ) : ?>
                                        <span class="level-pill l<?php echo $j + 1; ?>"><?php echo esc_html( $lv ); ?></span>
                                    <?php endforeach; ?>
                                </div>
                            <?php endif; ?>
                        </div>
                    </a>
                <?php endforeach; ?>
            </div>
        </section>
    </main>
</div>
<?php get_footer(); ?>
