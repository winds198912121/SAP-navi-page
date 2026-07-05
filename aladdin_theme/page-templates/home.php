<?php
/**
 * Template Name: ホーム
 * トップページ — APIからデータを取得して表示
 *
 * @package Aladdin_SAP_Panda
 */

$articles     = aladdin_api_get( 'articles', [ 'per_page' => 3 ] ) ?: [];
$modules      = aladdin_api_get( 'modules' ) ?: [];
$paths        = aladdin_api_get( 'learning-paths' ) ?: [];
$cases        = aladdin_api_get( 'cases', [ 'per_page' => 5 ] ) ?: [];
$popular      = aladdin_api_get( 'articles/popular', [ 'per_page' => 5 ] ) ?: [];
$videos       = aladdin_api_get( 'videos', [ 'per_page' => 6 ] ) ?: [];
$today_quiz   = aladdin_api_get( 'quizzes/today' );

get_header();
?>

<!-- Hero Section -->
<section class="hero-section">
    <div class="container">
        <div class="hero-content">
            <div class="hero-text">
                <h1>SAP学習は<br>パンダ先生におまかせ</h1>
                <p class="hero-subtitle">未経験からSAPコンサルタントへ。日本最大級のSAP学習プラットフォーム。</p>
                <div class="hero-actions">
                    <a href="/register" class="btn btn-primary btn-lg">無料で始める</a>
                    <a href="/modules" class="btn btn-outline btn-lg">モジュールを見る</a>
                </div>
                <div class="hero-stats">
                    <div class="hero-stat">
                        <div class="hero-stat-value">100+</div>
                        <div class="hero-stat-label">学習記事</div>
                    </div>
                    <div class="hero-stat">
                        <div class="hero-stat-value">9</div>
                        <div class="hero-stat-label">SAPモジュール</div>
                    </div>
                    <div class="hero-stat">
                        <div class="hero-stat-value">500+</div>
                        <div class="hero-stat-label">学習者</div>
                    </div>
                </div>
            </div>
            <div class="hero-visual">
                <img src="<?php echo esc_url( ALADDIN_THEME_URI . '/assets/images/panda-hero.svg' ); ?>"
                     alt="SAPパンダ先生"
                     class="hero-panda"
                     onerror="this.style.display='none'">
            </div>
        </div>
    </div>
</section>

<!-- Case Ticker -->
<?php if ( ! empty( $cases ) ) : ?>
<div class="case-ticker">
    <div class="container">
        <div class="case-ticker-track">
            <?php foreach ( $cases as $case ) : ?>
                <div class="case-ticker-item">
                    <span class="badge">NEW</span>
                    <span><?php echo esc_html( $case['title'] ?? $case['post_title'] ?? '' ); ?></span>
                    <span style="opacity:0.6"><?php echo esc_html( $case['location'] ?? '' ); ?></span>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</div>
<?php endif; ?>

<!-- SAP Modules Grid -->
<section class="section">
    <div class="container">
        <div class="section-title">
            <h2>SAPモジュール</h2>
            <p>9つの主要モジュールを学ぶ</p>
        </div>
        <div class="module-grid">
            <?php
            $module_names = [
                'fi' => '財務会計', 'co' => '管理会計', 'mm' => '資材管理',
                'sd' => '販売管理', 'pp' => '生産管理', 'hr' => '人事管理',
                'abap' => 'ABAP', 'basis' => 'BASIS', 's4' => 'S/4HANA',
            ];
            $module_descs = [
                'fi' => '財務諸表・債権債務管理',
                'co' => '原価管理・利益管理',
                'mm' => '購買・在庫管理',
                'sd' => '受注・出荷・請求',
                'pp' => '生産計画・実行',
                'hr' => '給与・人材管理',
                'abap' => 'カスタム開発言語',
                'basis' => 'システム基盤管理',
                's4' => '次世代ERPスイート',
            ];
            foreach ( $modules as $mod ) :
                $slug = $mod['slug'] ?? '';
                $color = aladdin_module_color( $slug );
            ?>
            <a href="/category/<?php echo esc_attr( $slug ); ?>" class="module-card">
                <div class="module-icon" style="background:<?php echo esc_attr( $color ); ?>">
                    <?php echo esc_html( strtoupper( substr( $slug, 0, 2 ) ) ); ?>
                </div>
                <div class="module-info">
                    <h3><?php echo esc_html( $module_names[ $slug ] ?? $mod['name'] ?? $slug ); ?></h3>
                    <p><?php echo esc_html( $module_descs[ $slug ] ?? $mod['description'] ?? '' ); ?></p>
                </div>
            </a>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- Latest Articles -->
<section class="section" style="background:var(--color-bg-alt);">
    <div class="container">
        <div class="section-title">
            <h2>新着記事</h2>
            <p>最新のSAP学習コンテンツ</p>
        </div>
        <?php if ( ! empty( $articles ) ) : ?>
        <div class="article-list">
            <?php foreach ( $articles as $art ) :
                $id   = $art['id'] ?? 0;
                $slug = $art['slug'] ?? '';
                $title = $art['title'] ?? $art['post_title'] ?? '';
                $excerpt = $art['excerpt'] ?? '';
                $module = $art['module_slug'] ?? '';
                $difficulty = $art['difficulty'] ?? '';
                $date = $art['date'] ?? $art['post_date'] ?? '';
                $color = aladdin_module_color( $module );
            ?>
            <article class="article-card">
                <div class="article-card-body">
                    <div class="article-card-meta">
                        <?php if ( $module ) : ?>
                            <span class="module-badge" style="background:<?php echo esc_attr( $color ); ?>">
                                <?php echo esc_html( strtoupper( $module ) ); ?>
                            </span>
                        <?php endif; ?>
                        <?php if ( $difficulty ) : ?>
                            <span class="badge <?php echo esc_attr( aladdin_difficulty_class( $difficulty ) ); ?>">
                                <?php echo esc_html( aladdin_difficulty_label( $difficulty ) ); ?>
                            </span>
                        <?php endif; ?>
                        <?php if ( $date ) : ?>
                            <span><?php echo esc_html( date_i18n( 'Y/m/d', strtotime( $date ) ) ); ?></span>
                        <?php endif; ?>
                    </div>
                    <h3 class="article-card-title">
                        <a href="/article/<?php echo esc_attr( $id . '/' . $slug ); ?>">
                            <?php echo esc_html( $title ); ?>
                        </a>
                    </h3>
                    <div class="article-card-excerpt"><?php echo esc_html( wp_trim_words( $excerpt, 40 ) ); ?></div>
                </div>
            </article>
            <?php endforeach; ?>
        </div>
        <?php else : ?>
            <div class="empty-state"><p>記事がまだありません。</p></div>
        <?php endif; ?>
        <div class="text-center mt-2">
            <a href="/search" class="btn btn-outline">すべての記事を見る</a>
        </div>
    </div>
</section>

<!-- Learning Paths -->
<?php if ( ! empty( $paths ) ) : ?>
<section class="section">
    <div class="container">
        <div class="section-title">
            <h2>学習パス</h2>
            <p>目的別にステップアップ</p>
        </div>
        <div class="path-list">
            <?php foreach ( array_slice( $paths, 0, 3 ) as $path ) :
                $path_color = $path['accent_color'] ?? aladdin_module_color( $path['module'] ?? '' );
                $step_count = count( $path['steps'] ?? [] );
            ?>
            <a href="/learning/<?php echo esc_attr( $path['id'] ?? 0 ); ?>" class="path-card" style="text-decoration:none;color:inherit;">
                <div class="path-card-header" style="background:<?php echo esc_attr( $path_color ); ?>">
                    <h3 class="path-card-title"><?php echo esc_html( $path['title'] ?? '' ); ?></h3>
                    <p class="path-card-subtitle"><?php echo esc_html( $path['target_audience'] ?? '' ); ?></p>
                </div>
                <div class="path-card-body">
                    <div class="path-card-meta">
                        <span>📚 <?php echo esc_html( $step_count ); ?>ステップ</span>
                        <span>⏱ <?php echo esc_html( $path['estimated_hours'] ?? '' ); ?>時間</span>
                    </div>
                    <p class="path-card-desc"><?php echo esc_html( $path['description'] ?? '' ); ?></p>
                </div>
            </a>
            <?php endforeach; ?>
        </div>
        <div class="text-center mt-2">
            <a href="/paths" class="btn btn-outline">すべての学習パスを見る</a>
        </div>
    </div>
</section>
<?php endif; ?>

<!-- Daily Quiz -->
<?php if ( $today_quiz ) : ?>
<section class="section" style="background:var(--color-bg-alt);">
    <div class="container">
        <div class="section-title">
            <h2>今日のクイズ</h2>
            <p>毎日1問、SAP知識をチェック</p>
        </div>
        <div id="quiz-container" class="quiz-card"></div>
        <script id="quiz-data" type="application/json"><?php echo wp_json_encode( $today_quiz ); ?></script>
    </div>
</section>
<?php endif; ?>

<!-- Videos -->
<?php if ( ! empty( $videos ) ) : ?>
<section class="section">
    <div class="container">
        <div class="section-title">
            <h2>おすすめ動画</h2>
            <p>SAP学習に役立つYouTube動画</p>
        </div>
        <div class="grid-3">
            <?php foreach ( $videos as $vid ) : ?>
            <div class="card">
                <?php if ( ! empty( $vid['thumbnail_url'] ) ) : ?>
                <img src="<?php echo esc_url( $vid['thumbnail_url'] ); ?>" alt="" class="card-image" loading="lazy">
                <?php endif; ?>
                <div class="card-body">
                    <h3 class="card-title"><?php echo esc_html( $vid['title'] ?? '' ); ?></h3>
                    <p class="card-text"><?php echo esc_html( $vid['description'] ?? '' ); ?></p>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
        <div class="text-center mt-2">
            <a href="/video" class="btn btn-outline">すべての動画を見る</a>
        </div>
    </div>
</section>
<?php endif; ?>

<?php get_footer(); ?>
