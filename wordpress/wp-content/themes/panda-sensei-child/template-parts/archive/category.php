<?php
/**
 * Category / Module page — モジュール別記事一覧
 */
get_header();

$slug   = get_query_var( 'panda_page' ) === 'category' ? get_query_var( 'panda_id' ) : ( $_GET['module'] ?? '' );
$module = null;
$modules_list = panda_api_get( 'modules' ) ?: panda_default_modules();

// Find the module data
foreach ( $modules_list as $m ) {
    if ( $m['slug'] === $slug ) {
        $module = $m;
        break;
    }
}
if ( ! $module ) {
    $module = [
        'slug' => $slug,
        'code' => strtoupper( $slug ),
        'name_ja' => strtoupper( $slug ),
        'name_en' => '',
        'description' => '',
        'color' => panda_module_color( $slug ),
        'article_count' => 0,
    ];
}

$articles = panda_api_get( 'articles', [ 'module' => $slug, 'per_page' => 20 ] );
if ( ! $articles ) {
    $articles = panda_default_articles();
}

$color  = $module['color'];
$bg     = $module['bg_color'] ?? $color . '20';
?>
<div id="primary" class="content-area">
    <main id="main" class="site-main">
        <div class="page-bg"></div>

        <!-- Category hero -->
        <div class="cat-hero" style="background:linear-gradient(135deg, <?php echo esc_attr( $bg ); ?>, var(--bg-1) 100%)">
            <div class="cat-hero-wrap">
                <div>
                    <div class="crumb">
                        <a href="<?php echo esc_url( home_url( '/' ) ); ?>">ホーム</a>
                        <span class="sep">/</span>
                        <a href="<?php echo esc_url( home_url( '/modules' ) ); ?>">モジュール</a>
                        <span class="sep">/</span>
                        <span class="now"><?php echo esc_html( $module['name_ja'] ); ?></span>
                    </div>
                    <div class="cat-title-row">
                        <div class="cat-big-icon" style="background:<?php echo esc_attr( $color ); ?>">
                            <?php echo esc_html( $module['code'] ); ?>
                        </div>
                        <div>
                            <h1><?php echo esc_html( $module['name_ja'] ); ?></h1>
                            <span class="code"><?php echo esc_html( $module['code'] . ' · ' . ( $module['name_en'] ?? '' ) ); ?></span>
                        </div>
                    </div>
                    <?php if ( $module['description'] ) : ?>
                        <p class="cat-desc"><?php echo esc_html( $module['description'] ); ?></p>
                    <?php endif; ?>
                    <div class="cat-stats" style="margin-top:16px">
                        <div class="stat">
                            <div class="v"><?php echo (int) ( $module['article_count'] ?? count( $articles ) ); ?></div>
                            <div class="l">記事</div>
                        </div>
                    </div>
                </div>
                <div class="cat-mascot">
                    <svg viewBox="0 0 120 140" width="140">
                        <ellipse cx="60" cy="132" rx="24" ry="6" fill="rgba(60,45,20,0.12)"/>
                        <ellipse cx="46" cy="50" rx="18" ry="22" fill="#1a1612"/>
                        <ellipse cx="74" cy="50" rx="18" ry="22" fill="#1a1612"/>
                        <ellipse cx="60" cy="42" rx="28" ry="30" fill="#fdfaf2"/>
                        <ellipse cx="46" cy="46" rx="10" ry="8" fill="#1a1612"/>
                        <ellipse cx="74" cy="46" rx="10" ry="8" fill="#1a1612"/>
                        <circle cx="52" cy="44" r="3" fill="#fff"/>
                        <circle cx="68" cy="44" r="3" fill="#fff"/>
                        <ellipse cx="60" cy="56" rx="2.5" ry="2" fill="#1a1612"/>
                        <ellipse cx="38" cy="78" rx="14" ry="22" fill="#1a1612"/>
                        <ellipse cx="82" cy="78" rx="14" ry="22" fill="#1a1612"/>
                        <ellipse cx="60" cy="90" rx="28" ry="24" fill="#fdfaf2"/>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Articles -->
        <div class="cat-body">
            <aside class="cat-sidebar">
                <div class="filter-block">
                    <h5>難易度</h5>
                    <div class="filter-list">
                        <div class="filter-item active">すべて</div>
                        <div class="filter-item">初級</div>
                        <div class="filter-item">中級</div>
                        <div class="filter-item">上級</div>
                    </div>
                </div>
            </aside>
            <div class="cat-content">
                <?php if ( ! empty( $articles ) ) : ?>
                    <div class="card-grid">
                        <?php foreach ( $articles as $art ) :
                            $diff_slug  = $art['difficulty']['slug'] ?? 'beginner';
                            $diff_level = panda_difficulty_class( $diff_slug );
                        ?>
                            <a href="<?php echo esc_url( home_url( '/article/' . $art['id'] . '/' . ( $art['slug'] ?? '' ) ) ); ?>"
                               class="art-card">
                                <div class="cover" style="background:<?php echo esc_attr( $color . '22' ); ?>">
                                    <svg viewBox="0 0 320 180" width="100%" height="100%">
                                        <rect width="320" height="180" fill="<?php echo esc_attr( $color . '22' ); ?>"/>
                                        <text x="160" y="96" font-size="32" font-weight="800" fill="<?php echo esc_attr( $color ); ?>"
                                              text-anchor="middle" font-family="monospace"><?php echo esc_html( $module['code'] ); ?></text>
                                    </svg>
                                </div>
                                <div class="body">
                                    <h3><?php echo esc_html( $art['title'] ); ?></h3>
                                    <div class="excerpt"><?php echo esc_html( panda_excerpt( $art['excerpt'] ?? '', 100 ) ); ?></div>
                                    <div class="foot">
                                        <?php if ( $diff_slug ) : ?>
                                            <span class="tag-diff <?php echo esc_attr( $diff_level ); ?>"><?php echo esc_html( panda_difficulty_label( $diff_slug ) ); ?></span>
                                        <?php endif; ?>
                                        <span><?php echo esc_html( (int) ( $art['reading_time'] ?? 5 ) ); ?> min</span>
                                    </div>
                                </div>
                            </a>
                        <?php endforeach; ?>
                    </div>
                <?php else : ?>
                    <div class="empty-state">
                        <div class="empty-state-icon">📚</div>
                        <p>記事が見つかりませんでした。</p>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </main>
</div>
<?php get_footer(); ?>
