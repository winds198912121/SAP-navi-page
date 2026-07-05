<?php
/**
 * 検索ページ
 *
 * @package Aladdin_SAP_Panda
 */
$query   = sanitize_text_field( $_GET['q'] ?? '' );
$module  = sanitize_text_field( $_GET['module'] ?? '' );
$difficulty = sanitize_text_field( $_GET['difficulty'] ?? '' );
$sort    = sanitize_text_field( $_GET['sort'] ?? 'newest' );
$page    = max( 1, (int) ( $_GET['page'] ?? 1 ) );

$params = [ 'q' => $query, 'page' => $page, 'per_page' => 12 ];
if ( $module ) $params['module'] = $module;
if ( $difficulty ) $params['difficulty'] = $difficulty;
if ( $sort === 'popular' ) $params['orderby'] = 'popular';

$results = $query ? aladdin_api_get( 'articles/search', $params ) : [];
$modules = aladdin_api_get( 'modules' ) ?: [];

get_header();
?>

<div class="container" style="padding-top:var(--spacing-xl);padding-bottom:var(--spacing-2xl);">
    <h1>記事検索</h1>

    <form method="get" action="/search" class="search-form" style="max-width:100%;margin-bottom:var(--spacing-xl);">
        <input type="search" name="q" value="<?php echo esc_attr( $query ); ?>" placeholder="キーワードを入力..." required>
        <button type="submit">検索</button>
    </form>

    <?php if ( $query ) : ?>
    <div class="filter-bar">
        <a href="/search?q=<?php echo urlencode( $query ); ?>" class="filter-btn <?php echo ! $module ? 'active' : ''; ?>">すべて</a>
        <?php foreach ( $modules as $mod ) : ?>
            <a href="/search?q=<?php echo urlencode( $query ); ?>&module=<?php echo esc_attr( $mod['slug'] ?? '' ); ?>"
               class="filter-btn <?php echo $module === ( $mod['slug'] ?? '' ) ? 'active' : ''; ?>">
                <?php echo esc_html( strtoupper( $mod['slug'] ?? '' ) ); ?>
            </a>
        <?php endforeach; ?>
    </div>

    <div class="sort-bar">
        <span style="font-size:var(--text-sm);color:var(--color-text-lighter);">並び替え:</span>
        <a href="/search?q=<?php echo urlencode( $query ); ?>&sort=newest<?php echo $module ? '&module='.$module : ''; ?>"
           class="sort-btn <?php echo $sort === 'newest' ? 'active' : ''; ?>">新着順</a>
        <a href="/search?q=<?php echo urlencode( $query ); ?>&sort=popular<?php echo $module ? '&module='.$module : ''; ?>"
           class="sort-btn <?php echo $sort === 'popular' ? 'active' : ''; ?>">人気順</a>
    </div>

    <p style="color:var(--color-text-lighter);font-size:var(--text-sm);margin-bottom:var(--spacing-lg);">
        「<?php echo esc_html( $query ); ?>」の検索結果
        <?php if ( is_array( $results ) ) : ?>
            <strong><?php echo count( $results ); ?></strong>件
        <?php endif; ?>
    </p>

    <?php if ( ! empty( $results ) ) : ?>
    <div class="article-list">
        <?php foreach ( $results as $art ) :
            $id = $art['id'] ?? 0;
            $slug = $art['slug'] ?? '';
            $art_module = $art['module_slug'] ?? '';
            $color = aladdin_module_color( $art_module );
        ?>
        <article class="article-card">
            <div class="article-card-body">
                <div class="article-card-meta">
                    <?php if ( $art_module ) : ?>
                        <span class="module-badge" style="background:<?php echo esc_attr( $color ); ?>"><?php echo esc_html( strtoupper( $art_module ) ); ?></span>
                    <?php endif; ?>
                    <?php if ( ! empty( $art['difficulty'] ) ) : ?>
                        <span class="badge <?php echo esc_attr( aladdin_difficulty_class( $art['difficulty'] ) ); ?>"><?php echo esc_html( aladdin_difficulty_label( $art['difficulty'] ) ); ?></span>
                    <?php endif; ?>
                </div>
                <h3 class="article-card-title">
                    <a href="/article/<?php echo esc_attr( $id . '/' . $slug ); ?>"><?php echo esc_html( $art['title'] ?? '' ); ?></a>
                </h3>
                <div class="article-card-excerpt"><?php echo esc_html( wp_trim_words( $art['excerpt'] ?? '', 30 ) ); ?></div>
            </div>
        </article>
        <?php endforeach; ?>
    </div>
    <?php else : ?>
    <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <p>該当する記事が見つかりませんでした。</p>
    </div>
    <?php endif; ?>
    <?php endif; ?>
</div>

<?php get_footer(); ?>
