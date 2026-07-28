<?php
/**
 * Learning paths section
 */
?>
<section class="section" id="paths">
    <div class="section-head">
        <div>
            <div class="label">Learning Path</div>
            <h2>あなたに合わせた学習パス<span class="accent-mark">.</span></h2>
        </div>
        <div class="desc">
            バラバラの記事じゃなくて、目的別に組まれたコース。<br>
            順番に読めば、自然と SAP がわかってくる。
        </div>
    </div>
    <div class="path-grid">
        <?php foreach ( array_slice( $paths, 0, 3 ) as $i => $p ) :
            $accent = $p['accent'] ?? ( $i === 0 ? '#5a9d6e' : ( $i === 1 ? '#d97548' : '#d96570' ) );
            $color_class = $i === 0 ? 'p1' : ( $i === 1 ? 'p2' : 'p3' );
        ?>
            <a href="<?php echo esc_url( home_url( '/learning/' . $p['id'] ) ); ?>"
               class="path-card <?php echo $color_class; ?>"
               style="--accent-color:<?php echo esc_attr( $accent ); ?>">
                <div class="num"><?php echo str_pad( $i + 1, 2, '0', STR_PAD_LEFT ); ?></div>
                <div class="audience"><?php echo esc_html( $p['audience'] ?? ( $p['target_audience'] ?? '' ) ); ?></div>
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
