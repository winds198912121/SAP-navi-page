<?php
/**
 * Aladdin SAP Panda — Theme Functions
 *
 * 標準WordPressテーマ版。React SPAと同じ sap/v1/ REST API を共有します。
 * 管理画面のテンプレートも含む、完全なフロントテーマです。
 *
 * @package Aladdin_SAP_Panda
 * @version 1.0.0
 */

// -----------------------------------------------------------
//  定数
// -----------------------------------------------------------
define( 'ALADDIN_VERSION', '1.0.0' );
define( 'ALADDIN_THEME_DIR', get_template_directory() );
define( 'ALADDIN_THEME_URI', get_template_directory_uri() );
define( 'ALADDIN_REST_URL', rest_url( 'sap/v1/' ) );

// -----------------------------------------------------------
//  テーマセットアップ
// -----------------------------------------------------------
add_action( 'after_setup_theme', 'aladdin_setup' );

function aladdin_setup(): void {
    // HTML5 対応
    add_theme_support( 'html5', [
        'script', 'style', 'comment-list', 'comment-form',
        'search-form', 'gallery', 'caption', 'navigation-widgets',
    ] );

    // タイトルタグ
    add_theme_support( 'title-tag' );

    // アイキャッチ画像
    add_theme_support( 'post-thumbnails' );

    // ロゴ
    add_theme_support( 'custom-logo', [
        'height'      => 60,
        'width'       => 200,
        'flex-height' => true,
        'flex-width'  => true,
    ] );

    // メニュー登録
    register_nav_menus( [
        'primary'   => __( 'メインメニュー', 'aladdin' ),
        'footer'    => __( 'フッターメニュー', 'aladdin' ),
        'mobile'    => __( 'モバイルメニュー', 'aladdin' ),
    ] );

    // カスタム画像サイズ
    add_image_size( 'aladdin-card', 400, 250, true );
    add_image_size( 'aladdin-hero', 1200, 600, true );
}

// -----------------------------------------------------------
//  アセットのエンキュー
// -----------------------------------------------------------
add_action( 'wp_enqueue_scripts', 'aladdin_enqueue_assets' );

function aladdin_enqueue_assets(): void {
    $theme_uri = ALADDIN_THEME_URI;

    // Google Fonts
    wp_enqueue_style(
        'aladdin-fonts',
        'https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700;900&family=Noto+Sans+JP:wght@400;500;700;900&family=JetBrains+Mono:wght@500;600;700&family=Caveat:wght@500;700&display=swap',
        [],
        null
    );

    // メインスタイル
    wp_enqueue_style(
        'aladdin-main',
        $theme_uri . '/assets/css/main.css',
        [],
        ALADDIN_VERSION
    );

    // レスポンシブスタイル
    wp_enqueue_style(
        'aladdin-responsive',
        $theme_uri . '/assets/css/responsive.css',
        [ 'aladdin-main' ],
        ALADDIN_VERSION
    );

    // 管理画面スタイル
    $is_admin_page = is_page_template( 'page-templates/admin/dashboard.php' )
        || get_query_var( 'aladdin_admin' )
        || strpos( $_SERVER['REQUEST_URI'] ?? '', '/admin' ) !== false;
    if ( $is_admin_page ) {
        wp_enqueue_style(
            'aladdin-admin',
            $theme_uri . '/assets/css/admin.css',
            [ 'aladdin-main' ],
            ALADDIN_VERSION
        );
    }

    // メインスクリプト
    wp_enqueue_script(
        'aladdin-main',
        $theme_uri . '/assets/js/main.js',
        [],
        ALADDIN_VERSION,
        [ 'in_footer' => true, 'strategy' => 'defer' ]
    );

    // WordPress データを JS に渡す
    wp_localize_script(
        'aladdin-main',
        'ALADDIN_DATA',
        [
            'ajaxUrl'       => admin_url( 'admin-ajax.php' ),
            'restUrl'       => ALADDIN_REST_URL,
            'wpUrl'         => home_url(),
            'themeUrl'      => $theme_uri,
            'nonce'         => wp_create_nonce( 'wp_rest' ),
            'isUserLoggedIn'=> is_user_logged_in(),
            'currentUserId' => get_current_user_id(),
        ]
    );

    // style.css（テーマヘッダー用）
    wp_enqueue_style(
        'aladdin-theme',
        get_stylesheet_uri(),
        [],
        ALADDIN_VERSION
    );
}

// -----------------------------------------------------------
//  管理バー調整
// -----------------------------------------------------------
add_action( 'wp_head', 'aladdin_admin_bar_fix' );
function aladdin_admin_bar_fix(): void {
    if ( ! is_admin_bar_showing() ) return;
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

// -----------------------------------------------------------
//  API ヘルパー関数
// -----------------------------------------------------------

/**
 * sap/v1/ REST API からデータを取得する。
 *
 * @param string $endpoint API エンドポイント（例: 'articles'）
 * @param array  $params   クエリパラメータ
 * @param string $method   HTTP メソッド
 * @param array  $body     POST/PUT のボディ
 * @return array|null 成功時は data 配列
 */
function aladdin_api_get( string $endpoint, array $params = [], string $method = 'GET', array $body = [] ): ?array {
    $url = ALADDIN_REST_URL . $endpoint;

    $args = [
        'timeout' => 15,
        'headers' => [ 'Content-Type' => 'application/json' ],
    ];

    $token = aladdin_get_token();
    if ( $token ) {
        $args['headers']['Authorization'] = 'Bearer ' . $token;
    }

    if ( 'GET' === strtoupper( $method ) ) {
        if ( ! empty( $params ) ) {
            $url = add_query_arg( $params, $url );
        }
    } else {
        $args['method'] = strtoupper( $method );
        if ( ! empty( $body ) ) {
            $args['body'] = wp_json_encode( $body );
        }
        if ( ! empty( $params ) ) {
            $url = add_query_arg( $params, $url );
        }
    }

    $response = wp_remote_request( $url, $args );

    if ( is_wp_error( $response ) ) {
        error_log( '[Aladdin API] Request failed: ' . $response->get_error_message() );
        return null;
    }

    $status = wp_remote_retrieve_response_code( $response );
    $body   = wp_remote_retrieve_body( $response );
    $data   = json_decode( $body, true );

    if ( ! is_array( $data ) ) {
        return null;
    }

    if ( isset( $data['success'] ) && $data['success'] && isset( $data['data'] ) ) {
        return $data['data'];
    }

    if ( isset( $data['success'] ) && ! $data['success'] ) {
        error_log( '[Aladdin API] Error: ' . ( $data['message'] ?? '' ) );
        return null;
    }

    if ( in_array( $status, [ 200, 201 ], true ) ) {
        return $data;
    }

    return null;
}

function aladdin_api_post( string $endpoint, array $body = [], array $params = [] ): ?array {
    return aladdin_api_get( $endpoint, $params, 'POST', $body );
}

function aladdin_api_put( string $endpoint, array $body = [], array $params = [] ): ?array {
    return aladdin_api_get( $endpoint, $params, 'PUT', $body );
}

function aladdin_api_delete( string $endpoint, array $params = [] ): ?array {
    return aladdin_api_get( $endpoint, $params, 'DELETE' );
}

// -----------------------------------------------------------
//  JWT トークン管理（Cookie ベース）
// -----------------------------------------------------------

function aladdin_get_token(): ?string {
    $token = $_COOKIE['aladdin_token'] ?? '';

    if ( ! $token && is_user_logged_in() ) {
        $token = get_transient( 'aladdin_token_' . get_current_user_id() );
    }

    return $token ?: null;
}

function aladdin_set_token( string $token, int $user_id = 0 ): void {
    if ( ! $user_id ) {
        $user_id = get_current_user_id();
    }
    setcookie( 'aladdin_token', $token, time() + DAY_IN_SECONDS * 30, COOKIEPATH, COOKIE_DOMAIN, is_ssl(), true );
    if ( $user_id ) {
        set_transient( 'aladdin_token_' . $user_id, $token, DAY_IN_SECONDS * 30 );
    }
}

function aladdin_clear_token(): void {
    setcookie( 'aladdin_token', '', time() - HOUR_IN_SECONDS, COOKIEPATH, COOKIE_DOMAIN, is_ssl(), true );
    if ( is_user_logged_in() ) {
        delete_transient( 'aladdin_token_' . get_current_user_id() );
    }
}

// -----------------------------------------------------------
//  カスタマイザー設定
// -----------------------------------------------------------
add_action( 'customize_register', 'aladdin_customize_register' );
function aladdin_customize_register( WP_Customize_Manager $wp_customize ): void {
    $wp_customize->add_setting( 'aladdin_color_scheme', [
        'default'           => 'bamboo',
        'sanitize_callback' => 'sanitize_text_field',
    ] );
    $wp_customize->add_control( 'aladdin_color_scheme', [
        'label'   => __( 'カラースキーム', 'aladdin' ),
        'section' => 'colors',
        'type'    => 'select',
        'choices' => [
            'bamboo' => '竹林（デフォルト）',
            'warm'   => '温もり',
            'fresh'  => '清新',
        ],
    ] );
}

// -----------------------------------------------------------
//  テンプレート階層フィルター
// -----------------------------------------------------------
add_filter( 'template_include', 'aladdin_template_include', 99 );
function aladdin_template_include( string $template ): string {
    if ( is_admin() || wp_doing_ajax() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
        return $template;
    }

    $request_uri = parse_url( $_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH );
    $wp_path     = rtrim( parse_url( home_url(), PHP_URL_PATH ) ?: '', '/' );
    $path        = '/' . ltrim( substr( $request_uri, strlen( $wp_path ) ), '/' );
    $parts       = array_values( array_filter( explode( '/', trim( $path, '/' ) ) ) );

    if ( empty( $parts[0] ) ) {
        return ALADDIN_THEME_DIR . '/page-templates/home.php';
    }

    $slug = $parts[0] ?? '';
    $id   = $parts[1] ?? '';
    $sub  = $parts[2] ?? '';

    // 管理画面ルート
    if ( 'admin' === $slug ) {
        $admin_templates = [
            'articles'       => 'page-templates/admin/articles.php',
            'courses'        => 'page-templates/admin/courses.php',
            'lessons'        => 'page-templates/admin/lessons.php',
            'knowledge'      => 'page-templates/admin/knowledge.php',
            'cases'          => 'page-templates/admin/cases.php',
            'videos'         => 'page-templates/admin/videos.php',
            'modules'        => 'page-templates/admin/modules.php',
            'quizzes'        => 'page-templates/admin/quizzes.php',
            'learning-paths' => 'page-templates/admin/learning-paths.php',
            'applications'   => 'page-templates/admin/applications.php',
            'users'          => 'page-templates/admin/users.php',
            'pages'          => 'page-templates/admin/site-pages.php',
            'contact'        => 'page-templates/admin/contact-inquiries.php',
            'notes'          => 'page-templates/admin/notes.php',
            'plugins'        => 'page-templates/admin/plugins.php',
            'seo-geo'        => 'page-templates/admin/seo-geo.php',
        ];

        if ( ! $id ) {
            return ALADDIN_THEME_DIR . '/page-templates/admin/dashboard.php';
        }

        if ( isset( $admin_templates[ $id ] ) ) {
            set_query_var( 'aladdin_admin_view', $id );
            set_query_var( 'aladdin_sub_view', $sub );
            set_query_var( 'aladdin_item_id', isset( $parts[3] ) ? (int) $parts[3] : 0 );
            return ALADDIN_THEME_DIR . '/' . $admin_templates[ $id ];
        }

        // 未知の管理画面ルート
        return ALADDIN_THEME_DIR . '/page-templates/admin/dashboard.php';
    }

    // 公開ルートマッピング
    $routes = [
        'article'   => [ 't' => 'page-templates/single-article.php',          'id' => true ],
        'course'    => [ 't' => 'page-templates/single-course.php',           'id' => true ],
        'lesson'    => [ 't' => 'page-templates/single-lesson.php',           'id' => true ],
        'knowledge' => [ 't' => 'page-templates/single-knowledge.php',        'id' => true ],
        'note'      => [ 't' => 'page-templates/single-note.php',             'id' => true ],
        'step'      => [ 't' => 'page-templates/single-step.php',             'id' => true ],
        'learning'  => [ 't' => 'page-templates/single-learning-path.php',    'id' => true ],
        'category'  => [ 't' => 'page-templates/archive-articles.php',        'id' => false ],
        'modules'   => [ 't' => 'page-templates/archive-modules.php',         'id' => false ],
        'paths'     => [ 't' => 'page-templates/archive-learning-paths.php',  'id' => false ],
        'video'     => [ 't' => 'page-templates/archive-videos.php',          'id' => false ],
        'cases'     => [ 't' => 'page-templates/archive-cases.php',           'id' => false ],
        'search'    => [ 't' => 'page-templates/search-page.php',             'id' => false ],
        'login'     => [ 't' => 'page-templates/login.php',                   'id' => false ],
        'register'  => [ 't' => 'page-templates/register.php',                'id' => false ],
        'profile'   => [ 't' => 'page-templates/profile.php',                 'id' => false ],
        'membership'=> [ 't' => 'page-templates/membership.php',              'id' => false ],
        'about'     => [ 't' => 'page-templates/static/about.php',           'id' => false ],
        'team'      => [ 't' => 'page-templates/static/team.php',            'id' => false ],
        'contact'   => [ 't' => 'page-templates/static/contact.php',         'id' => false ],
        'privacy'   => [ 't' => 'page-templates/static/privacy.php',         'id' => false ],
        'terms'     => [ 't' => 'page-templates/static/terms.php',           'id' => false ],
        'quiz-page' => [ 't' => 'page-templates/quiz-page.php',               'id' => false ],
        'glossary'  => [ 't' => 'page-templates/topic-page.php',              'id' => false ],
        'trends'    => [ 't' => 'page-templates/topic-page.php',              'id' => false ],
        'career'    => [ 't' => 'page-templates/topic-page.php',              'id' => false ],
    ];

    if ( isset( $routes[ $slug ] ) ) {
        $r = $routes[ $slug ];
        if ( $r['id'] && $id ) {
            set_query_var( 'aladdin_item_id', (int) $id );
            set_query_var( 'aladdin_item_slug', $sub );
        }
        return ALADDIN_THEME_DIR . '/' . $r['t'];
    }

    // 該当なし → 404
    return ALADDIN_THEME_DIR . '/404.php';
}

// -----------------------------------------------------------
//  クエリ変数
// -----------------------------------------------------------
add_filter( 'query_vars', 'aladdin_query_vars' );
function aladdin_query_vars( array $vars ): array {
    return array_merge( $vars, [
        'aladdin_item_id',
        'aladdin_item_slug',
        'aladdin_admin_view',
        'aladdin_sub_view',
    ] );
}

// -----------------------------------------------------------
//  リライトルール
// -----------------------------------------------------------
add_action( 'init', 'aladdin_rewrite_rules' );
function aladdin_rewrite_rules(): void {
    // WordPress が自動的にルーティングを処理するので、
    // 明示的なリライトルールは不要。template_include フィルターで対応。
}

add_action( 'after_switch_theme', 'aladdin_theme_activation' );
function aladdin_theme_activation(): void {
    flush_rewrite_rules();
}

// -----------------------------------------------------------
//  ヘルパー関数
// -----------------------------------------------------------

function aladdin_module_color( string $slug ): string {
    $colors = [
        'fi'   => '#e74c3c',
        'co'   => '#f39c12',
        'mm'   => '#2ecc71',
        'sd'   => '#3498db',
        'pp'   => '#9b59b6',
        'hr'   => '#e91e63',
        'abap' => '#607d8b',
        'basis'=> '#795548',
        's4'   => '#00bcd4',
    ];
    return $colors[ $slug ] ?? '#4CAF50';
}

function aladdin_difficulty_label( string $level ): string {
    $map = [ 'beginner' => '初級', 'intermediate' => '中級', 'advanced' => '上級' ];
    return $map[ $level ] ?? $level;
}

function aladdin_difficulty_class( string $level ): string {
    $map = [ 'beginner' => 'badge-beginner', 'intermediate' => 'badge-intermediate', 'advanced' => 'badge-advanced' ];
    return $map[ $level ] ?? '';
}

/**
 * ページタイトルを生成
 */
function aladdin_page_title( string $default = '' ): string {
    $title = $default ?: get_the_title();
    if ( is_home() ) {
        $title = get_bloginfo( 'name' );
    }
    return $title;
}

/**
 * 現在のページが管理画面か判定
 */
function aladdin_is_admin_area(): bool {
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    return strpos( $uri, '/admin' ) !== false;
}

// -----------------------------------------------------------
//  メニューフォールバック
// -----------------------------------------------------------

/**
 * プライマリメニュー未設定時のフォールバック
 */
function aladdin_primary_menu_fallback(): void {
    ?>
    <ul class="nav-menu">
        <li><a href="/">ホーム</a></li>
        <li><a href="/modules">モジュール</a></li>
        <li><a href="/paths">学習パス</a></li>
        <li><a href="/courses">コース</a></li>
        <li><a href="/quiz-page">今日のクイズ</a></li>
        <li><a href="/cases">案件</a></li>
        <li><a href="/video">動画</a></li>
    </ul>
    <?php
}

/**
 * モバイルメニュー未設定時のフォールバック
 */
function aladdin_mobile_menu_fallback(): void {
    ?>
    <ul class="mobile-nav">
        <li><a href="/">ホーム</a></li>
        <li><a href="/modules">SAPモジュール</a></li>
        <li><a href="/paths">学習パス</a></li>
        <li><a href="/courses">コース一覧</a></li>
        <li><a href="/quiz-page">今日のクイズ</a></li>
        <li><a href="/cases">案件一覧</a></li>
        <li><a href="/video">動画一覧</a></li>
        <li><a href="/search">検索</a></li>
        <li><a href="/about">このサイトについて</a></li>
        <li><a href="/contact">お問い合わせ</a></li>
    </ul>
    <?php
}
