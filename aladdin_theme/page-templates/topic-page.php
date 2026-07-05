<?php
/**
 * トピックページ（用語集/トレンド/キャリア）
 *
 * @package Aladdin_SAP_Panda
 */
$uri_parts = explode( '/', trim( parse_url( $_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH ), '/' ) );
$topic_slug = $uri_parts[0] ?? 'glossary';
$topic_names = [ 'glossary' => '用語集', 'trends' => 'トレンド', 'career' => 'キャリアガイド' ];
$topic_name  = $topic_names[ $topic_slug ] ?? 'トピック';

$articles = aladdin_api_get( 'articles', [ 'topic' => $topic_slug, 'per_page' => 20 ] ) ?: [];
get_header();
?>
<div class="container" style="padding-top:var(--spacing-xl);padding-bottom:var(--spacing-2xl);">
    <div class="breadcrumb">
        <a href="/">ホーム</a><span class="separator">›</span>
        <span><?php echo esc_html( $topic_name ); ?></span>
    </div>
    <h1><?php echo esc_html( $topic_name ); ?></h1>
    <div class="tabs">
        <?php foreach ( $topic_names as $slug => $name ) : ?>
        <a href="/<?php echo esc_attr( $slug ); ?>" class="tab <?php echo $topic_slug === $slug ? 'active' : ''; ?>">
            <?php echo esc_html( $name ); ?>
        </a>
        <?php endforeach; ?>
    </div>
    <?php if ( ! empty( $articles ) ) : ?>
    <div class="article-list">
        <?php foreach ( $articles as $art ) : ?>
        <article class="article-card">
            <div class="article-card-body">
                <div class="article-card-meta">
                    <?php if ( ! empty( $art['module_slug'] ) ) : ?>
                        <span class="module-badge" style="background:<?php echo esc_attr( aladdin_module_color( $art['module_slug'] ) ); ?>">
                            <?php echo esc_html( strtoupper( $art['module_slug'] ) ); ?>
                        </span>
                    <?php endif; ?>
                    <?php if ( ! empty( $art['difficulty'] ) ) : ?>
                        <span class="badge <?php echo esc_attr( aladdin_difficulty_class( $art['difficulty'] ) ); ?>">
                            <?php echo esc_html( aladdin_difficulty_label( $art['difficulty'] ) ); ?>
                        </span>
                    <?php endif; ?>
                </div>
                <h3 class="article-card-title">
                    <a href="/article/<?php echo esc_attr( ( $art['id'] ?? 0 ) . '/' . ( $art['slug'] ?? '' ) ); ?>">
                        <?php echo esc_html( $art['title'] ?? '' ); ?>
                    </a>
                </h3>
                <div class="article-card-excerpt"><?php echo esc_html( wp_trim_words( $art['excerpt'] ?? '', 30 ) ); ?></div>
            </div>
        </article>
        <?php endforeach; ?>
    </div>
    <?php else : ?>
    <div class="empty-state"><p>記事がまだありません。</p></div>
    <?php endif; ?>
</div>
<?php get_footer(); ?>
