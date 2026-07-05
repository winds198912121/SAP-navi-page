<?php
/**
 * モジュール別記事一覧（/category/{slug}）
 *
 * @package Aladdin_SAP_Panda
 */
$slug = get_query_var( 'aladdin_item_slug' ) ?: ( $_GET['module'] ?? '' );
$module = $slug ? aladdin_api_get( 'modules/' . $slug ) : null;
$articles = $slug ? aladdin_api_get( 'modules/' . $slug . '/articles', [ 'per_page' => 20 ] ) : [];
$modules = aladdin_api_get( 'modules' ) ?: [];
$color = aladdin_module_color( $slug );

$module_names = [
    'fi' => '財務会計', 'co' => '管理会計', 'mm' => '資材管理',
    'sd' => '販売管理', 'pp' => '生産管理', 'hr' => '人事管理',
    'abap' => 'ABAP', 'basis' => 'BASIS', 's4' => 'S/4HANA',
];

get_header();
?>

<div class="container" style="padding-top:var(--spacing-xl);padding-bottom:var(--spacing-2xl);">
    <div class="breadcrumb">
        <a href="/">ホーム</a>
        <span class="separator">›</span>
        <span><?php echo esc_html( $module_names[ $slug ] ?? strtoupper( $slug ) ); ?></span>
    </div>

    <div style="display:flex;align-items:center;gap:var(--spacing-md);margin-bottom:var(--spacing-lg);">
        <div class="module-icon" style="background:<?php echo esc_attr( $color ); ?>;width:56px;height:56px;font-size:1.2rem;">
            <?php echo esc_html( strtoupper( substr( $slug, 0, 2 ) ) ); ?>
        </div>
        <div>
            <h1 style="margin-bottom:4px;"><?php echo esc_html( $module_names[ $slug ] ?? strtoupper( $slug ) ); ?></h1>
            <p style="color:var(--color-text-light);margin:0;">
                <?php echo esc_html( $module['description'] ?? '' ); ?>
                （全<?php echo count( $articles ); ?>記事）
            </p>
        </div>
    </div>

    <!-- モジュールフィルター -->
    <div class="filter-bar">
        <a href="/modules" class="filter-btn">すべてのモジュール</a>
        <?php foreach ( $modules as $mod ) :
            $m_slug = $mod['slug'] ?? '';
        ?>
        <a href="/category/<?php echo esc_attr( $m_slug ); ?>"
           class="filter-btn <?php echo $slug === $m_slug ? 'active' : ''; ?>"
           style="<?php echo $slug === $m_slug ? 'background:' . aladdin_module_color( $m_slug ) . ';border-color:' . aladdin_module_color( $m_slug ) . ';' : ''; ?>">
            <?php echo esc_html( strtoupper( $m_slug ) ); ?>
        </a>
        <?php endforeach; ?>
    </div>

    <?php if ( ! empty( $articles ) ) : ?>
    <div class="article-list">
        <?php foreach ( $articles as $art ) :
            $id = $art['id'] ?? 0;
            $art_slug = $art['slug'] ?? '';
            $difficulty = $art['difficulty'] ?? '';
        ?>
        <article class="article-card">
            <div class="article-card-body">
                <div class="article-card-meta">
                    <span class="module-badge" style="background:<?php echo esc_attr( $color ); ?>"><?php echo esc_html( strtoupper( $slug ) ); ?></span>
                    <?php if ( $difficulty ) : ?>
                        <span class="badge <?php echo esc_attr( aladdin_difficulty_class( $difficulty ) ); ?>"><?php echo esc_html( aladdin_difficulty_label( $difficulty ) ); ?></span>
                    <?php endif; ?>
                    <?php if ( ! empty( $art['date'] ) ) : ?>
                        <span><?php echo esc_html( date_i18n( 'Y/m/d', strtotime( $art['date'] ) ) ); ?></span>
                    <?php endif; ?>
                </div>
                <h3 class="article-card-title">
                    <a href="/article/<?php echo esc_attr( $id . '/' . $art_slug ); ?>"><?php echo esc_html( $art['title'] ?? '' ); ?></a>
                </h3>
                <div class="article-card-excerpt"><?php echo esc_html( wp_trim_words( $art['excerpt'] ?? '', 30 ) ); ?></div>
            </div>
        </article>
        <?php endforeach; ?>
    </div>
    <?php else : ?>
    <div class="empty-state">
        <div class="empty-state-icon">📝</div>
        <p>このモジュールの記事はまだありません。</p>
    </div>
    <?php endif; ?>
</div>

<?php get_footer(); ?>
