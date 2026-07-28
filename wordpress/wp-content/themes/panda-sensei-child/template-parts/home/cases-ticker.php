<?php
/**
 * Cases ticker — 案件情報ティッカー
 *
 * @package Panda_Sensei_Child
 */
$cases = panda_api_get( 'cases', [ 'per_page' => 20 ] );
if ( ! $cases ) {
    $cases = [
        [ 'title' => 'SAP FIコンサルタント', 'rate' => '70〜90万', 'module' => 'FI', 'urgent' => true ],
        [ 'title' => 'ABAP開発者（リモート）', 'rate' => '65〜85万', 'module' => 'ABAP', 'urgent' => false ],
        [ 'title' => 'S/4HANA移行PM', 'rate' => '90〜120万', 'module' => 'S/4', 'urgent' => true ],
        [ 'title' => 'MM導入コンサルタント', 'rate' => '75〜95万', 'module' => 'MM', 'urgent' => false ],
        [ 'title' => 'SDモジュールリード', 'rate' => '80〜100万', 'module' => 'SD', 'urgent' => false ],
        [ 'title' => 'Basis運用管理者', 'rate' => '70〜90万', 'module' => 'Basis', 'urgent' => false ],
        [ 'title' => 'PPモジュール担当者', 'rate' => '65〜85万', 'module' => 'PP', 'urgent' => false ],
    ];
}
?>
<div class="case-ticker">
    <div class="ticker-head" style="max-width:1280px;margin:0 auto;padding:0 28px 10px">
        <div class="ticker-flag">
            <span class="pulse"></span>
            SAP案件情報
        </div>
        <div class="ticker-count">全 <b><?php echo count( $cases ); ?></b> 件</div>
        <a href="<?php echo esc_url( home_url( '/cases' ) ); ?>" class="ticker-cta">案件一覧を見る →</a>
    </div>
    <div class="ticker-viewport">
        <div class="ticker-track">
            <?php for ( $i = 0; $i < 2; $i++ ) : ?>
                <?php foreach ( $cases as $c ) : ?>
                    <a href="<?php echo esc_url( home_url( '/cases' ) ); ?>" class="ticker-pill">
                        <?php if ( ! empty( $c['urgent'] ) ) : ?>
                            <span class="tp-urgent">急募</span>
                        <?php endif; ?>
                        <span class="tp-mod" style="background:<?php echo esc_attr( panda_module_color( strtolower( $c['module'] ) ) ); ?>"><?php echo esc_html( $c['module'] ); ?></span>
                        <span><?php echo esc_html( $c['title'] ); ?></span>
                        <span class="tp-rate"><?php echo esc_html( $c['rate'] ); ?></span>
                    </a>
                <?php endforeach; ?>
            <?php endfor; ?>
        </div>
    </div>
</div>
