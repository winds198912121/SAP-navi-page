<?php
/**
 * Module grid section — モジュール別ガイド
 *
 * @package Panda_Sensei_Child
 */
?>
<section class="section" id="modules">
    <div class="section-head">
        <div>
            <div class="label">Modules Guide</div>
            <h2>モジュール別ガイド<span class="accent-mark">.</span></h2>
        </div>
        <div class="desc">
            SAP の世界は広い。<br>
            でも大丈夫、パンダ先生がモジュールごとに案内します。
        </div>
    </div>
    <div class="module-grid">
        <?php foreach ( $modules as $m ) :
            $slug  = $m['slug'] ?? '';
            $color = $m['color'] ?? panda_module_color( $slug );
            $bg    = $m['bg_color'] ?? $color . '20';
        ?>
            <a href="<?php echo esc_url( home_url( '/category/' . $slug ) ); ?>"
               class="mod-card"
               style="--card-color:<?php echo esc_attr( $color ); ?>;--card-bg:<?php echo esc_attr( $bg ); ?>">
                <div class="mod-top">
                    <div class="mod-icon"><?php echo esc_html( $m['code'] ?? strtoupper( $slug ) ); ?></div>
                </div>
                <div class="mod-name-ja"><?php echo esc_html( $m['name_ja'] ?? $slug ); ?></div>
                <div class="mod-code"><?php echo esc_html( ( $m['name_en'] ?? '' ) . ' · ' . ( $m['code'] ?? strtoupper( $slug ) ) ); ?></div>
                <div class="mod-desc"><?php echo esc_html( $m['description'] ?? '' ); ?></div>
                <div class="mod-foot">
                    <span class="count"><?php echo (int) ( $m['article_count'] ?? 0 ); ?>本<span>の記事</span></span>
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
