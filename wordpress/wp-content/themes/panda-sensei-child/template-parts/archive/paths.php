<?php
/**
 * Learning paths archive page
 */
get_header();

$paths = panda_api_get( 'learning-paths' ) ?: panda_default_paths();
?>
<div id="primary" class="content-area">
    <main id="main" class="site-main">
        <div class="page-bg"></div>
        <section class="section">
            <div class="section-head">
                <div>
                    <div class="label">Learning Path</div>
                    <h2>学習パス一覧<span class="accent-mark">.</span></h2>
                </div>
                <div class="desc">目的別に組まれたコース。順番に読めば自然とSAPがわかる。</div>
            </div>
            <div class="path-grid">
                <?php foreach ( $paths as $i => $p ) :
                    $accent = $p['accent'] ?? ( $i % 3 === 0 ? '#5a9d6e' : ( $i % 3 === 1 ? '#d97548' : '#d96570' ) );
                ?>
                    <a href="<?php echo esc_url( home_url( '/learning/' . $p['id'] ) ); ?>"
                       class="path-card"
                       style="--accent-color:<?php echo esc_attr( $accent ); ?>">
                        <div class="num"><?php echo str_pad( $i + 1, 2, '0', STR_PAD_LEFT ); ?></div>
                        <div class="audience"><?php echo esc_html( $p['audience'] ?? '' ); ?></div>
                        <h3><?php echo esc_html( $p['title'] ); ?></h3>
                        <p><?php echo esc_html( $p['description'] ); ?></p>
                        <?php if ( ! empty( $p['steps'] ) ) : ?>
                            <div class="path-steps">
                                <?php foreach ( array_slice( $p['steps'], 0, 4 ) as $j => $s ) : ?>
                                    <div class="path-step">
                                        <span class="step-num"><?php echo $j + 1; ?></span>
                                        <span class="step-title"><?php echo esc_html( $s['title'] ); ?></span>
                                        <span class="step-time"><?php echo esc_html( $s['time'] ?? '' ); ?></span>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                        <div class="path-meta">
                            <span>📚 <?php echo count( $p['steps'] ?? [] ); ?>ステップ · <?php echo esc_html( $p['duration'] ?? '' ); ?></span>
                            <span class="arrow">パスを開始 →</span>
                        </div>
                    </a>
                <?php endforeach; ?>
            </div>
        </section>
    </main>
</div>
<?php get_footer(); ?>
