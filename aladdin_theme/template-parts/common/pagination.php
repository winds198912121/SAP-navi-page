<?php
/**
 * ページネーション
 *
 * @param int $current 現在のページ
 * @param int $total   総ページ数
 * @param string $base_url ベースURL
 */
$current  = max( 1, (int) ( $args['current'] ?? 1 ) );
$total    = max( 1, (int) ( $args['total'] ?? 1 ) );
$base_url = $args['base_url'] ?? '/search';
?>
<div class="pagination">
    <?php for ( $i = 1; $i <= $total; $i++ ) : ?>
        <?php if ( $i === $current ) : ?>
            <span class="current"><?php echo esc_html( $i ); ?></span>
        <?php else : ?>
            <a href="<?php echo esc_url( add_query_arg( 'page', $i, $base_url ) ); ?>"><?php echo esc_html( $i ); ?></a>
        <?php endif; ?>
    <?php endfor; ?>
</div>
