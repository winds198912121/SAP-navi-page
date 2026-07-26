<?php
/**
 * SAP Panda Next — Theme Functions
 *
 * Next.js 静的エクスポート + SSR 統合 WordPress テーマ
 *
 * @package SAP_Panda_Next
 * @version 2.0.0
 */

defined('ABSPATH') || exit;

define('SAP_PANDA_NEXT_VERSION', '2.0.0');

// SSR設定（環境変数で制御）
define('SAP_SSR_ENABLED', in_array(getenv('SSR_ENABLED'), ['1', 'true', 'yes'], true));
define('SAP_SSR_HOST', getenv('SSR_HOST') ?: 'ssr');
define('SAP_SSR_PORT', getenv('SSR_PORT') ?: '3000');

// -----------------------------------------------------------
//  SPAルーティング — すべてのフロントエンドリクエストを index.php へ
// -----------------------------------------------------------
add_filter('template_include', 'sap_panda_next_template_include', 99);
function sap_panda_next_template_include(string $template): string {
    if (is_admin() || wp_doing_ajax() || (defined('REST_REQUEST') && REST_REQUEST)) {
        return $template;
    }
    return get_template_directory() . '/index.php';
}

// -----------------------------------------------------------
//  アセットエンキュー
// -----------------------------------------------------------
add_action('wp_enqueue_scripts', 'sap_panda_next_enqueue_assets');
function sap_panda_next_enqueue_assets(): void {
    $theme_uri = get_template_directory_uri();
    $assets_uri = $theme_uri . '/assets';

    // Google Fonts
    wp_enqueue_style(
        'sap-panda-next-fonts',
        'https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700;900&family=Noto+Sans+JP:wght@400;500;700;900&family=JetBrains+Mono:wght@500;600;700&display=swap',
        [],
        null
    );

    // React SPAにWordPressデータを渡す
    wp_localize_script('sap-panda-next-app', 'SAP_PANDA_DATA', [
        'ajaxUrl'  => admin_url('admin-ajax.php'),
        'restUrl'  => rest_url('sap/v1/'),
        'wpUrl'    => home_url(),
        'themeUrl' => $theme_uri,
        'nonce'    => wp_create_nonce('wp_rest'),
    ]);

    // style.css
    wp_enqueue_style(
        'sap-panda-next-theme',
        get_stylesheet_uri(),
        [],
        SAP_PANDA_NEXT_VERSION
    );
}

// -----------------------------------------------------------
//  テーマ機能サポート
// -----------------------------------------------------------
add_action('after_setup_theme', 'sap_panda_next_setup');
function sap_panda_next_setup(): void {
    add_theme_support('html5', ['script', 'style', 'comment-list', 'comment-form', 'search-form', 'gallery', 'caption']);
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
}

// -----------------------------------------------------------
//  SSR — クローラー支援
// -----------------------------------------------------------
function sap_panda_next_is_bot(): bool {
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $patterns = [
        'googlebot', 'bingbot', 'yandexbot', 'baiduspider',
        'facebookexternalhit', 'twitterbot', 'whatsapp', 'slurp',
        'bot', 'crawl', 'spider', 'yahoo! slurp', 'seznambot',
        'pinterest', 'discordbot', 'slackbot', 'telegrambot',
        'applebot', 'duckduckbot',
    ];
    foreach ($patterns as $pattern) {
        if (stripos($ua, $pattern) !== false) return true;
    }
    return false;
}

function sap_panda_next_fetch_ssr(): ?string {
    $request_path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
    $wp_path = rtrim(parse_url(home_url(), PHP_URL_PATH) ?: '', '/');

    $ssr_url = add_query_arg(
        ['path' => $request_path, 'basename' => $wp_path],
        sprintf('http://%s:%s/render', SAP_SSR_HOST, SAP_SSR_PORT)
    );

    $response = wp_remote_get($ssr_url, [
        'timeout' => 10,
        'headers' => ['Accept' => 'application/json'],
    ]);

    if (is_wp_error($response)) {
        error_log(sprintf('[SSR] Request failed: %s (url: %s)', $response->get_error_message(), $ssr_url));
        return null;
    }

    $status = wp_remote_retrieve_response_code($response);
    if (200 !== $status) {
        error_log(sprintf('[SSR] Unexpected status: %d (url: %s)', $status, $ssr_url));
        return null;
    }

    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);
    return (is_array($data) && isset($data['html'])) ? $data['html'] : null;
}

// -----------------------------------------------------------
//  管理バー調整（SPA用）
// -----------------------------------------------------------
add_action('wp_head', 'sap_panda_next_admin_bar_fix');
function sap_panda_next_admin_bar_fix(): void {
    if (!is_admin_bar_showing()) return;
    ?>
    <style>
    html { margin-top: 32px !important; }
    * html body { margin-top: 32px !important; }
    @media screen and (max-width: 782px) {
        html { margin-top: 46px !important; }
        * html body { margin-top: 46px !important; }
    }
    </style>
    <?php
}
