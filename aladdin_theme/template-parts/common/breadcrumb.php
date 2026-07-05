<?php
/**
 * パンくずリスト
 *
 * @param array $crumbs 各要素が ['label' => ..., 'url' => ...] の配列
 */
$crumbs = $args['crumbs'] ?? [];
?>
<nav class="breadcrumb" aria-label="パンくずリスト">
    <a href="/">ホーム</a>
    <?php foreach ( $crumbs as $crumb ) : ?>
        <span class="separator">›</span>
        <?php if ( ! empty( $crumb['url'] ) ) : ?>
            <a href="<?php echo esc_url( $crumb['url'] ); ?>"><?php echo esc_html( $crumb['label'] ); ?></a>
        <?php else : ?>
            <span><?php echo esc_html( $crumb['label'] ); ?></span>
        <?php endif; ?>
    <?php endforeach; ?>
</nav>
