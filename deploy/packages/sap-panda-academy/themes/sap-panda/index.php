<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<?php
/**
 * SSR (サーバーサイドレンダリング) 処理
 *
 * 検索エンジンクローラーからのリクエストを検出し、
 * Node.js SSR サーバーで事前レンダリングした HTML を注入する。
 *
 * 通常ユーザーは従来通り SPA として動作する。
 */

$ssr_enabled = defined( 'SAP_SSR_ENABLED' ) && SAP_SSR_ENABLED;
$is_bot      = sap_panda_is_bot();

if ( $ssr_enabled && $is_bot ) :
	$ssr_html = sap_panda_fetch_ssr();
	if ( $ssr_html ) :
		// SSR 成功 — レンダリング済み HTML を含む <div id="root"> を出力
		echo '<div id="root">' . $ssr_html . '</div>';
		wp_footer();
		echo '</body></html>';
		exit;
	endif;
	// SSR 失敗 → 通常の SPA にフォールスルー
endif;
?>

<div id="root"></div>
<?php wp_footer(); ?>
</body>
</html>
