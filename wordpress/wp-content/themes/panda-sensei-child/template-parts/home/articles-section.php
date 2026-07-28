<?php
/**
 * Articles section — 新着記事 + ランキング
 */
?>
<section class="section" id="articles" style="background:var(--bg-1)">
    <div class="section-head">
        <div>
            <div class="label">Latest Articles</div>
            <h2>新着記事<span class="accent-mark">.</span></h2>
        </div>
        <div class="desc">毎週更新。読むだけで SAP 力が上がる記事を厳選。</div>
    </div>
    <div class="articles-grid">
        <div class="article-list">
            <?php foreach ( $articles as $art ) :
                $mod_slug   = $art['module']['slug'] ?? '';
                $diff_slug  = $art['difficulty']['slug'] ?? 'beginner';
                $diff_level = $diff_slug === 'beginner' ? 'l1' : ( $diff_slug === 'intermediate' ? 'l2' : 'l3' );
                $color      = $mod_slug ? panda_module_color( $mod_slug ) : 'var(--bg-tint)';
            ?>
                <a href="<?php echo esc_url( home_url( '/article/' . $art['id'] . '/' . ( $art['slug'] ?? '' ) ) ); ?>"
                   class="article-row">
                    <div class="article-thumb" style="background:<?php echo esc_attr( $color . '22' ); ?>">
                        <svg viewBox="0 0 120 88" style="width:100%;height:100%">
                            <rect width="120" height="88" fill="<?php echo esc_attr( $color . '22' ); ?>"/>
                            <text x="60" y="48" font-size="22" font-weight="800"
                                  fill="<?php echo esc_attr( $color ); ?>"
                                  text-anchor="middle" font-family="monospace">
                                <?php echo esc_html( strtoupper( $mod_slug ?: '?' ) ); ?>
                            </text>
                        </svg>
                    </div>
                    <div>
                        <div class="article-meta-top">
                            <?php if ( $mod_slug ) : ?>
                                <span class="tag-mod <?php echo esc_attr( $mod_slug ); ?>"><?php echo esc_html( strtoupper( $mod_slug ) ); ?></span>
                            <?php endif; ?>
                            <?php if ( $diff_slug ) : ?>
                                <span class="tag-diff <?php echo esc_attr( $diff_level ); ?>"><?php echo esc_html( panda_difficulty_label( $diff_slug ) ); ?></span>
                            <?php endif; ?>
                        </div>
                        <h3><?php echo esc_html( $art['title'] ); ?></h3>
                        <div class="excerpt"><?php echo esc_html( panda_excerpt( $art['excerpt'] ?? '', 80 ) ); ?></div>
                        <div class="article-meta-bot">
                            <span><?php echo esc_html( $art['author']['display_name'] ?? 'パンダ先生' ); ?></span>
                            <span>·</span>
                            <span><?php echo esc_html( panda_format_date( $art['created_at'] ?? '' ) ); ?></span>
                            <span>·</span>
                            <span><?php echo (int) ( $art['reading_time'] ?? 5 ); ?> min read</span>
                        </div>
                    </div>
                </a>
            <?php endforeach; ?>
        </div>
        <div>
            <div class="top10">
                <div class="top10-head">
                    <span class="badge">RANKING</span>
                    <h3>よく読まれている記事</h3>
                </div>
                <?php $top10 = [
                    '【保存版】SAP用語集 — はじめての100単語',
                    'BAPI とは何か、なぜ使うのか — 5分で理解',
                    'Fiori vs SAP GUI — 結局どう使い分ける？',
                    'T-Code 早見表（よく使う 50 個）',
                    'ABAP オブジェクト指向 完全入門',
                    'MMの移動タイプ、覚えるならこの10個',
                    'S/4HANA 1909 → 2023 アップグレード手順',
                    '新人コンサルが最初に読むべき本ベスト5',
                    'BW/4HANA で BI 案件に挑戦するには',
                    'パンダ先生に聞く：転職タイミングの見極め方',
                ]; ?>
                <?php foreach ( $top10 as $i => $t ) : ?>
                    <div class="top10-item">
                        <div class="rank-num"><?php echo str_pad( $i + 1, 2, '0', STR_PAD_LEFT ); ?></div>
                        <div><h4><?php echo esc_html( $t ); ?></h4></div>
                    </div>
                <?php endforeach; ?>
            </div>
            <div style="margin-top:16px;text-align:center">
                <a href="<?php echo esc_url( home_url( '/search' ) ); ?>" class="btn btn-sm">すべての記事を見る</a>
            </div>
        </div>
    </div>
</section>
