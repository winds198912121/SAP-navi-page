<?php
/**
 * 記事本文（ログイン制限付き）
 *
 * @param string $content 記事コンテンツ
 */
$content = $args['content'] ?? '';
$is_logged_in = is_user_logged_in();

if ( $is_logged_in ) {
    echo wp_kses_post( $content );
} else {
    $cutoff = (int) ( mb_strlen( wp_strip_all_tags( $content ) ) * 0.3 );
    ?>
    <div class="content-locked">
        <div class="content-locked-content">
            <?php echo wp_kses_post( mb_substr( $content, 0, $cutoff ) ); ?>
        </div>
    </div>
    <div class="content-locked-banner">
        <h3>🔒 続きを読むにはログインが必要です</h3>
        <p>このコンテンツの続きはログイン後にご覧いただけます。</p>
        <div style="display:flex;gap:var(--spacing-sm);justify-content:center;margin-top:var(--spacing-md);">
            <a href="/login" class="btn btn-primary">ログイン</a>
            <a href="/register" class="btn btn-outline">新規登録</a>
        </div>
    </div>
    <?php
}
