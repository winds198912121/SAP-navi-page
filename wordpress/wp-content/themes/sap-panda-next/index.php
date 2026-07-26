<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<base href="<?php echo home_url('/'); ?>">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<?php
/**
 * SSR (サーバーサイドレンダリング) 処理
 * クローラーの場合、Node.js SSR サーバーからレンダリング済みHTMLを注入
 */
$ssr_enabled = defined('SAP_SSR_ENABLED') && SAP_SSR_ENABLED;
$is_bot = sap_panda_next_is_bot();

if ($ssr_enabled && $is_bot) :
    $ssr_html = sap_panda_next_fetch_ssr();
    if ($ssr_html) :
        echo '<div id="root">' . $ssr_html . '</div>';
        wp_footer();
        echo '</body></html>';
        exit;
    endif;
endif;

// SSR 失敗 or 通常ユーザー → 静的HTML SPA をロード
$template_file = get_template_directory() . '/assets/index.html';
if (file_exists($template_file)) {
    $html = file_get_contents($template_file);
    // 埋め込みスクリプトを出力（head内のNext.jsスクリプトはそのまま機能）
    echo $html;
} else {
    // フォールバック SPA シェル
    echo '<div id="root"></div>';
}
?>

<?php wp_footer(); ?>
</body>
</html>
