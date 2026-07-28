<?php
/**
 * Article detail page
 */
get_header();

$id   = get_query_var( 'panda_id' );
$slug = get_query_var( 'panda_slug' );

$article = panda_api_get( 'articles/' . $id );
if ( ! $article ) {
    $article = [
        'id' => $id,
        'title' => 'SAP用語集 — はじめての100単語',
        'content' => '<p>SAP（エスエーピー）は、世界中の企業で使われている統合業務ソフトウェア（ERP）です。財務会計、購買、販売、生産、人事など、企業のあらゆる業務を一元管理するためのシステムです。</p><h2>SAPの基本概念</h2><p>SAPを理解するためには、まず「モジュール」という考え方を知る必要があります。SAPは巨大なシステムですが、機能ごとに「モジュール」と呼ばれる単位に分かれています。</p><h3>主なモジュール</h3><ul><li><strong>FI（財務会計）</strong> — 会社の財務状況を管理</li><li><strong>CO（管理会計）</strong> — 原価管理と利益分析</li><li><strong>MM（購買管理）</strong> — 資材の調達から在庫管理</li><li><strong>SD（販売管理）</strong> — 受注から出荷までのプロセス</li><li><strong>PP（生産計画）</strong> — 生産計画と実行</li><li><strong>HR（人事管理）</strong> — 従業員情報の管理</li></ul>',
        'author' => [ 'display_name' => 'パンダ先生' ],
        'reading_time' => 15,
        'module' => [ 'slug' => 'fi', 'name' => '財務会計' ],
        'difficulty' => [ 'slug' => 'beginner', 'name' => '初級' ],
        'created_at' => current_time( 'mysql' ),
    ];
}

$mod_slug  = $article['module']['slug'] ?? '';
$diff_slug = $article['difficulty']['slug'] ?? 'beginner';
$color     = $mod_slug ? panda_module_color( $mod_slug ) : 'var(--accent)';
?>
<div id="primary" class="content-area">
    <main id="main" class="site-main">
        <div class="page-bg"></div>

        <!-- Article hero -->
        <div class="art-hero">
            <div class="breadcrumb">
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>">ホーム</a>
                <span class="separator">/</span>
                <?php if ( $mod_slug ) : ?>
                    <a href="<?php echo esc_url( home_url( '/category/' . $mod_slug ) ); ?>"><?php echo esc_html( $article['module']['name'] ?? $mod_slug ); ?></a>
                    <span class="separator">/</span>
                <?php endif; ?>
                <span style="color:var(--ink-1);font-weight:600"><?php echo esc_html( $article['title'] ); ?></span>
            </div>

            <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
                <?php if ( $mod_slug ) : ?>
                    <span class="tag-mod <?php echo esc_attr( $mod_slug ); ?>"><?php echo esc_html( strtoupper( $mod_slug ) ); ?></span>
                <?php endif; ?>
                <?php if ( $diff_slug ) : ?>
                    <span class="tag-diff <?php echo esc_attr( panda_difficulty_class( $diff_slug ) ); ?>"><?php echo esc_html( panda_difficulty_label( $diff_slug ) ); ?></span>
                <?php endif; ?>
            </div>

            <h1><?php echo esc_html( $article['title'] ); ?></h1>

            <div style="display:flex;align-items:center;gap:16px;font-size:13px;color:var(--ink-3);flex-wrap:wrap">
                <span>✍️ <?php echo esc_html( $article['author']['display_name'] ?? 'パンダ先生' ); ?></span>
                <span>📅 <?php echo esc_html( panda_format_date( $article['created_at'] ?? '' ) ); ?></span>
                <span>📖 <?php echo (int) ( $article['reading_time'] ?? 5 ); ?> min read</span>
            </div>
        </div>

        <!-- Content -->
        <div class="art-body-wrap">
            <div class="art-content">
                <?php echo wp_kses_post( $article['content'] ?? '' ); ?>
            </div>
            <aside class="art-side">
                <div class="toc-card">
                    <h5>📑 目次</h5>
                    <ul class="toc-list">
                        <li><a href="#">記事を読み始める</a></li>
                    </ul>
                </div>
            </aside>
        </div>
    </main>
</div>
<?php get_footer(); ?>
