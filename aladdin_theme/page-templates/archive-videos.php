<?php
/**
 * 動画一覧ページ
 *
 * @package Aladdin_SAP_Panda
 */
$videos = aladdin_api_get( 'videos', [ 'per_page' => 20 ] ) ?: [];
get_header();
?>
<div class="container" style="padding-top:var(--spacing-xl);padding-bottom:var(--spacing-2xl);">
    <div class="breadcrumb">
        <a href="/">ホーム</a><span class="separator">›</span>
        <span>動画一覧</span>
    </div>
    <h1>動画一覧</h1>
    <p style="color:var(--color-text-light);margin-bottom:var(--spacing-xl);">
        SAP学習に役立つYouTube動画を集めました。
    </p>
    <?php if ( ! empty( $videos ) ) : ?>
    <div class="grid-3">
        <?php foreach ( $videos as $vid ) : ?>
        <div class="card">
            <?php if ( ! empty( $vid['thumbnail_url'] ) ) : ?>
                <img src="<?php echo esc_url( $vid['thumbnail_url'] ); ?>" alt="" class="card-image" loading="lazy">
            <?php endif; ?>
            <div class="card-body">
                <h3 class="card-title"><?php echo esc_html( $vid['title'] ?? '' ); ?></h3>
                <p class="card-text"><?php echo esc_html( $vid['description'] ?? '' ); ?></p>
                <?php if ( ! empty( $vid['video_url'] ) ) : ?>
                <a href="<?php echo esc_url( $vid['video_url'] ); ?>" target="_blank" class="btn btn-sm btn-primary" rel="noopener">▶ 再生</a>
                <?php endif; ?>
            </div>
        </div>
        <?php endforeach; ?>
    </div>
    <?php else : ?>
    <div class="empty-state"><div class="empty-state-icon">🎬</div><p>動画がまだありません。</p></div>
    <?php endif; ?>
</div>
<?php get_footer(); ?>
