<?php
/**
 * SAP Panda Academy — Theme Functions
 *
 * @package SAP_Panda_Academy
 * @version 1.0.0
 */

// -----------------------------------------------------------
//  定数
// -----------------------------------------------------------
define( 'SAP_PANDA_VERSION', '1.0.0' );

// SSR (サーバーサイドレンダリング) 設定
// SSR_ENABLED=1 で有効化。Docker 環境では compose の環境変数で制御。
define( 'SAP_SSR_ENABLED', in_array( getenv( 'SSR_ENABLED' ), array( '1', 'true', 'yes' ), true ) );
define( 'SAP_SSR_HOST', getenv( 'SSR_HOST' ) ?: 'ssr' );    // Docker 内部では ssr:3000
define( 'SAP_SSR_PORT', getenv( 'SSR_PORT' ) ?: '3000' );

// -----------------------------------------------------------
//  アセットのエンキュー
// -----------------------------------------------------------
add_action( 'wp_enqueue_scripts', 'sap_panda_enqueue_assets' );

/**
 * Vite ビルド済み JS / CSS を動的に enqueue する。
 * テーマ内 assets/ ディレクトリから index-{hash}.js / index-{hash}.css を
 * スキャンして自動的に読み込む。
 */
function sap_panda_enqueue_assets(): void {
	$theme_dir = get_template_directory();
	$theme_uri = get_template_directory_uri();

	// Google Fonts
	wp_enqueue_style(
		'sap-panda-fonts',
		'https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700;900&family=Noto+Sans+JP:wght@400;500;700;900&family=JetBrains+Mono:wght@500;600;700&family=Caveat:wght@500;700&display=swap',
		array(),
		null
	);

	// ビルド済みアセットの検出
	$assets_dir = $theme_dir . '/assets';
	if ( ! is_dir( $assets_dir ) ) {
		return;
	}

	$js_file  = '';
	$css_file = '';
	$files    = scandir( $assets_dir );

	if ( ! is_array( $files ) ) {
		return;
	}

	foreach ( $files as $file ) {
		$ext = strtolower( pathinfo( $file, PATHINFO_EXTENSION ) );

		if ( 'js' === $ext && 0 === strpos( $file, 'index-' ) ) {
			$js_file = $file;
		}

		if ( 'css' === $ext && 0 === strpos( $file, 'index-' ) ) {
			$css_file = $file;
		}
	}

	if ( $css_file ) {
		wp_enqueue_style(
			'sap-panda',
			$theme_uri . '/assets/' . $css_file,
			array(),
			filemtime( $assets_dir . '/' . $css_file )
		);
	}

	if ( $js_file ) {
		wp_enqueue_script(
			'sap-panda',
			$theme_uri . '/assets/' . $js_file,
			array(),
			filemtime( $assets_dir . '/' . $js_file ),
			array(
				'in_footer' => true,
				'strategy'  => 'defer',
			)
		);

		// React SPA に必要なデータを wp_localize_script で渡す
		wp_localize_script(
			'sap-panda',
			'SAP_PANDA_DATA',
			array(
				'ajaxUrl'  => admin_url( 'admin-ajax.php' ),
				'restUrl'  => rest_url( 'sap/v1/' ),
				'wpUrl'    => home_url(),
				'themeUrl' => $theme_uri,
				'nonce'    => wp_create_nonce( 'wp_rest' ),
			)
		);
	}

	// style.css（テーマヘッダー用、空でも WordPress が認識するために必要）
	wp_enqueue_style(
		'sap-panda-theme',
		get_stylesheet_uri(),
		array(),
		SAP_PANDA_VERSION
	);
}

// -----------------------------------------------------------
//  SPA ルーティング — すべてのフロントエンドリクエストで
//  テーマの index.php をロードする
// -----------------------------------------------------------
add_filter( 'template_include', 'sap_panda_template_include', 99 );

/**
 * 管理画面・AJAX・REST API を除くすべてのフロントエンドリクエストで
 * テーマの index.php（SPA）をロードする。
 * これにより React Router のクライアントサイドルーティングが機能する。
 *
 * @param string $template WordPress が選択したテンプレートパス。
 * @return string 常にテーマの index.php を返す（管理画面・API以外）。
 */
function sap_panda_template_include( string $template ): string {
	// 管理画面・AJAX・REST API はスキップ
	if ( is_admin() || wp_doing_ajax() || defined( 'REST_REQUEST' ) && REST_REQUEST ) {
		return $template;
	}

	return get_template_directory() . '/index.php';
}

// -----------------------------------------------------------
//  テーマサポート
// -----------------------------------------------------------
add_action( 'after_setup_theme', 'sap_panda_setup' );

/**
 * テーマに必要な機能を登録する。
 */
function sap_panda_setup(): void {
	// HTML5 対応
	add_theme_support( 'html5', array( 'script', 'style', 'comment-list', 'comment-form', 'search-form', 'gallery', 'caption' ) );

	// タイトルタグ
	add_theme_support( 'title-tag' );

	// アイキャッチ画像
	add_theme_support( 'post-thumbnails' );
}

// -----------------------------------------------------------
//  REST API の応答にテーマ情報を追加（任意）
// -----------------------------------------------------------
add_action( 'rest_api_init', 'sap_panda_register_theme_field' );

/**
 * REST API にテーマのバージョン情報を追加する。
 */
function sap_panda_register_theme_field(): void {
	register_rest_field(
		'page',
		'sap_panda_theme',
		array(
			'get_callback' => function () {
				return array(
					'version' => SAP_PANDA_VERSION,
					'name'    => wp_get_theme()->get( 'Name' ),
				);
			},
		)
	);
}

// -----------------------------------------------------------
//  プラグイン競合回避 — SPA と衝突する管理バーJSを除外
// -----------------------------------------------------------

/**
 * MonsterInsights 等のプラグインが管理バー用に読み込む
 * React / JS が SPA の React と競合するのを防ぐ。
 * 管理画面では通常通り動作する。
 */
add_action( 'wp_enqueue_scripts', 'sap_panda_dequeue_conflicting_scripts', 100 );
function sap_panda_dequeue_conflicting_scripts(): void {
	if ( is_admin() ) {
		return;
	}

	// MonsterInsights 管理バー（フロントエンドの管理バーReact競合）
	if ( defined( 'MONSTERINSIGHTS_VERSION' ) ) {
		wp_dequeue_script( 'monsterinsights-admin-bar-script' );
		wp_dequeue_style( 'monsterinsights-admin-bar-style' );
	}
}

// -----------------------------------------------------------
//  管理バー表示調整（SPA用）
// -----------------------------------------------------------
add_action( 'wp_head', 'sap_panda_admin_bar_fix' );
function sap_panda_admin_bar_fix(): void {
	if ( ! is_admin_bar_showing() ) {
		return;
	}
	?>
	<style>
	/* SPA テーマでも管理バーが正しく表示されるよう調整 */
	html { margin-top: 32px !important; }
	* html body { margin-top: 32px !important; }
	@media screen and (max-width: 782px) {
		html { margin-top: 46px !important; }
		* html body { margin-top: 46px !important; }
	}
	</style>
	<?php
}


// -----------------------------------------------------------
//  SSR (サーバーサイドレンダリング) — クローラー支援
// -----------------------------------------------------------

/**
 * 現在の User-Agent が検索エンジンクローラーかどうかを判定する。
 *
 * @return bool クローラーの場合は true。
 */
function sap_panda_is_bot(): bool {
	$ua = $_SERVER['HTTP_USER_AGENT'] ?? '';

	// 一般的なクローラー / ボットのパターン
	$bot_patterns = array(
		'googlebot',
		'bingbot',
		'yandexbot',
		'baiduspider',
		'facebookexternalhit',
		'twitterbot',
		'whatsapp',
		'slurp',
		'bot',
		'crawl',
		'spider',
		'yahoo! slurp',
		'seznambot',
		'pinterest',
		'discordbot',
		'slackbot',
		'telegrambot',
		'applebot',
		'duckduckbot',
	);

	foreach ( $bot_patterns as $pattern ) {
		if ( stripos( $ua, $pattern ) !== false ) {
			return true;
		}
	}

	return false;
}

/**
 * Node.js SSR サーバーにリクエストし、レンダリング済み HTML を取得する。
 *
 * @return string|null 成功時は <div id="root"> 内の HTML 文字列、失敗時は null。
 */
function sap_panda_fetch_ssr(): ?string {
	// 現在のリクエストパス（クエリ文字列除く、フルパスで SSR に渡す）
	$request_path = parse_url( $_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH );

	// WordPress 設置パス（例: /sap）。StaticRouter の basename として使用
	$wp_path = rtrim( parse_url( home_url(), PHP_URL_PATH ) ?: '', '/' );

	// SSR サーバーの URL
	// path パラメータ = フルパス (例: /sap/courses/123)
	// basename パラメータ = WordPress 設置パス (例: /sap)
	// StaticRouter が basename を自動除去してルーティングする
	$ssr_url = add_query_arg(
		array(
			'path'     => $request_path,
			'basename' => $wp_path,
		),
		sprintf(
			'http://%s:%s/render',
			SAP_SSR_HOST,
			SAP_SSR_PORT
		)
	);

	$response = wp_remote_get( $ssr_url, array(
		'timeout'   => 10,
		'headers'   => array(
			'Accept' => 'application/json',
		),
	) );

	if ( is_wp_error( $response ) ) {
		error_log(
			sprintf(
				'[SSR] Request failed: %s (url: %s)',
				$response->get_error_message(),
				$ssr_url
			)
		);
		return null;
	}

	$status = wp_remote_retrieve_response_code( $response );
	if ( 200 !== $status ) {
		error_log(
			sprintf(
				'[SSR] Unexpected status: %d (url: %s)',
				$status,
				$ssr_url
			)
		);
		return null;
	}

	$body = wp_remote_retrieve_body( $response );
	$data = json_decode( $body, true );

	if ( ! is_array( $data ) || ! isset( $data['html'] ) ) {
		error_log( '[SSR] Invalid response: ' . substr( $body, 0, 200 ) );
		return null;
	}

	return $data['html'];
}
