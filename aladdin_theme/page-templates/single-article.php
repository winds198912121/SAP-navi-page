<?php
/**
 * 記事詳細ページ
 *
 * @package Aladdin_SAP_Panda
 */
$article_id = get_query_var( 'aladdin_item_id' );
$article    = $article_id ? aladdin_api_get( 'articles/' . $article_id ) : null;

if ( ! $article ) {
    get_header();
    echo '<div class="container aladdin-404"><p>記事が見つかりませんでした。</p></div>';
    get_footer();
    return;
}

$title      = $article['title'] ?? $article['post_title'] ?? '';
$content    = $article['content'] ?? $article['post_content'] ?? '';
$module     = $article['module_slug'] ?? '';
$difficulty = $article['difficulty'] ?? '';
$date       = $article['date'] ?? $article['post_date'] ?? '';
$reading_time = $article['reading_time'] ?? 5;
$author     = $article['author_name'] ?? '';
$color      = aladdin_module_color( $module );

get_header();
?>

<article class="article-detail">
    <div class="article-hero" style="background:linear-gradient(135deg, <?php echo esc_attr( $color ); ?>15, var(--color-bg));">
        <div class="container">
            <div class="article-header">
                <div class="breadcrumb">
                    <a href="/">ホーム</a>
                    <span class="separator">›</span>
                    <?php if ( $module ) : ?>
                        <a href="/category/<?php echo esc_attr( $module ); ?>"><?php echo esc_html( strtoupper( $module ) ); ?></a>
                        <span class="separator">›</span>
                    <?php endif; ?>
                    <span><?php echo esc_html( wp_trim_words( $title, 10 ) ); ?></span>
                </div>
                <h1><?php echo esc_html( $title ); ?></h1>
                <div class="article-header-meta">
                    <?php if ( $module ) : ?>
                        <span class="module-badge" style="background:<?php echo esc_attr( $color ); ?>"><?php echo esc_html( strtoupper( $module ) ); ?></span>
                    <?php endif; ?>
                    <?php if ( $difficulty ) : ?>
                        <span class="badge <?php echo esc_attr( aladdin_difficulty_class( $difficulty ) ); ?>"><?php echo esc_html( aladdin_difficulty_label( $difficulty ) ); ?></span>
                    <?php endif; ?>
                    <?php if ( $date ) : ?>
                        <span>📅 <?php echo esc_html( date_i18n( 'Y年n月j日', strtotime( $date ) ) ); ?></span>
                    <?php endif; ?>
                    <span>📖 <?php echo esc_html( $reading_time ); ?>分で読めます</span>
                    <?php if ( $author ) : ?>
                        <span>✍️ <?php echo esc_html( $author ); ?></span>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>

    <div class="article-body">
        <aside class="article-toc">
            <div class="article-toc-inner" id="toc-container">
                <div class="article-toc-title">目次</div>
                <ul class="toc-list" id="toc-list"></ul>
            </div>
        </aside>

        <div class="article-content" id="article-content">
            <?php
            // 未ログイン制限：30%のみ表示
            $is_logged_in = is_user_logged_in();
            if ( ! $is_logged_in ) {
                $words       = str_word_count( wp_strip_all_tags( $content ), 1 );
                $total_chars = mb_strlen( wp_strip_all_tags( $content ) );
                $cutoff      = (int) ( $total_chars * 0.3 );

                echo '<div class="content-locked" id="content-locked">';
                echo '<div class="content-locked-content">';
                echo wp_kses_post( mb_substr( $content, 0, $cutoff ) );
                echo '</div></div>';

                echo '<div class="content-locked-banner">';
                echo '<h3>🔒 続きを読むにはログインが必要です</h3>';
                echo '<p>この記事の続きはログイン後にご覧いただけます。</p>';
                echo '<div style="display:flex;gap:var(--spacing-sm);justify-content:center;margin-top:var(--spacing-md);">';
                echo '<a href="/login" class="btn btn-primary">ログイン</a>';
                echo '<a href="/register" class="btn btn-outline">新規登録</a>';
                echo '</div></div>';
            } else {
                echo wp_kses_post( $content );
            }
            ?>

            <!-- Reactions -->
            <?php $reactions = $article['reactions'] ?? [ 'like' => 0, 'love' => 0, 'smile' => 0, 'fire' => 0 ]; ?>
            <div class="article-reactions">
                <h3>この記事の反応</h3>
                <div class="reactions-buttons" id="reactions-container" data-article-id="<?php echo esc_attr( $article_id ); ?>"></div>
                <script id="reactions-data" type="application/json"><?php echo wp_json_encode( $reactions ); ?></script>
            </div>
        </div>
    </div>
</article>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Dynamic TOC generation
    const content = document.getElementById('article-content');
    const tocList = document.getElementById('toc-list');
    if (content && tocList) {
        const headings = content.querySelectorAll('h2, h3');
        headings.forEach(function(h, idx) {
            if (!h.id) h.id = 'heading-' + idx;
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#' + h.id;
            a.textContent = h.textContent;
            if (h.tagName === 'H3') a.style.paddingLeft = '16px';
            li.appendChild(a);
            tocList.appendChild(li);
        });
    }
});
</script>

<?php get_footer(); ?>
