<?php
/**
 * SAPモジュール一覧
 *
 * @package Aladdin_SAP_Panda
 */
$modules = aladdin_api_get( 'modules' ) ?: [];
$module_names = [
    'fi' => '財務会計', 'co' => '管理会計', 'mm' => '資材管理',
    'sd' => '販売管理', 'pp' => '生産管理', 'hr' => '人事管理',
    'abap' => 'ABAP', 'basis' => 'BASIS', 's4' => 'S/4HANA',
];
$module_descs = [
    'fi' => '財務諸表・債権債務管理',
    'co' => '原価管理・利益管理',
    'mm' => '購買・在庫管理',
    'sd' => '受注・出荷・請求',
    'pp' => '生産計画・実行',
    'hr' => '給与・人材管理',
    'abap' => 'カスタム開発言語',
    'basis' => 'システム基盤管理',
    's4' => '次世代ERPスイート',
];

get_header();
?>
<div class="container" style="padding-top:var(--spacing-xl);padding-bottom:var(--spacing-2xl);">
    <div class="breadcrumb">
        <a href="/">ホーム</a>
        <span class="separator">›</span>
        <span>SAPモジュール</span>
    </div>
    <h1>SAPモジュール</h1>
    <p style="color:var(--color-text-light);margin-bottom:var(--spacing-xl);">
        SAPの主要9モジュールを体系的に学べます。
    </p>
    <div class="module-grid">
        <?php foreach ( $modules as $mod ) :
            $m_slug = $mod['slug'] ?? '';
            $color = aladdin_module_color( $m_slug );
        ?>
        <a href="/category/<?php echo esc_attr( $m_slug ); ?>" class="module-card" style="text-decoration:none;color:inherit;">
            <div class="module-icon" style="background:<?php echo esc_attr( $color ); ?>">
                <?php echo esc_html( strtoupper( substr( $m_slug, 0, 2 ) ) ); ?>
            </div>
            <div class="module-info">
                <h3><?php echo esc_html( $module_names[ $m_slug ] ?? $mod['name'] ?? $m_slug ); ?></h3>
                <p><?php echo esc_html( $module_descs[ $m_slug ] ?? $mod['description'] ?? '' ); ?></p>
            </div>
        </a>
        <?php endforeach; ?>
    </div>
</div>
<?php get_footer(); ?>
