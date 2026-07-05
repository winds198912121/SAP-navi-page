<?php
/**
 * 記事カード
 *
 * @param array $art 記事データ
 */
$art = $args['article'] ?? [];
$id   = $art['id'] ?? 0;
$slug = $art['slug'] ?? '';
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
                <?php echo esc_html( $art['title'] ?? '' ); ?>
            </a>
        </h3>
        <div class="article-card-excerpt">
            <?php echo esc_html( wp_trim_words( $art['excerpt'] ?? '', 30 ) ); ?>
        </div>
    </div>
</article>
