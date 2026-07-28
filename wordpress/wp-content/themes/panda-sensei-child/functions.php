<?php
/**
 * SAP Panda Sensei — Kadence Child Theme Functions
 *
 * Next.js版のデザインシステムを踏襲したKadence子テーマ。
 * REST API、カスタムテンプレート、アセット管理を提供。
 *
 * @package Panda_Sensei_Child
 * @version 2.0.0
 */

// -----------------------------------------------------------
// Constants
// -----------------------------------------------------------
define( 'PANDA_CHILD_VERSION', '2.0.0' );
define( 'PANDA_CHILD_DIR', get_stylesheet_directory() );
define( 'PANDA_CHILD_URI', get_stylesheet_directory_uri() );
define( 'PANDA_REST_URL', rest_url( 'sap/v1/' ) );

// -----------------------------------------------------------
//  Setup — after parent theme
// -----------------------------------------------------------
add_action( 'after_setup_theme', 'panda_child_setup', 20 );

function panda_child_setup(): void {
    // Navigation menus matching Next.js header links
    register_nav_menus( [
        'primary'         => __( 'メインナビゲーション', 'panda-sensei' ),
        'mobile'          => __( 'モバイルメニュー', 'panda-sensei' ),
        'footer-modules'  => __( 'フッター：モジュール', 'panda-sensei' ),
        'footer-content'  => __( 'フッター：コンテンツ', 'panda-sensei' ),
        'footer-about'    => __( 'フッター：About', 'panda-sensei' ),
    ] );

    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'custom-logo', [
        'height'      => 60,
        'width'       => 200,
        'flex-height' => true,
        'flex-width'  => true,
    ] );
}

// -----------------------------------------------------------
//  Enqueue assets
// -----------------------------------------------------------
add_action( 'wp_enqueue_scripts', 'panda_child_enqueue', 20 );

function panda_child_enqueue(): void {
    $ver = PANDA_CHILD_VERSION;

    // Google Fonts
    wp_enqueue_style(
        'panda-google-fonts',
        'https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700;900&family=Noto+Sans+JP:wght@400;500;700;900&family=JetBrains+Mono:wght@500;600;700&family=Caveat:wght@500;700&display=swap',
        [],
        null
    );

    // Child theme CSS (設計トークン＋全スタイル)
    wp_enqueue_style(
        'panda-child-style',
        PANDA_CHILD_URI . '/style.css',
        [ 'kadence-global' ],
        $ver
    );

    // Custom JS
    wp_enqueue_script(
        'panda-child-script',
        PANDA_CHILD_URI . '/assets/js/main.js',
        [],
        $ver,
        [ 'strategy' => 'defer', 'in_footer' => true ]
    );

    // Pass server data to JS
    wp_localize_script( 'panda-child-script', 'PANDA_DATA', [
        'restUrl'        => PANDA_REST_URL,
        'themeUrl'       => PANDA_CHILD_URI,
        'homeUrl'        => home_url(),
        'nonce'          => wp_create_nonce( 'wp_rest' ),
        'isLoggedIn'     => is_user_logged_in(),
        'currentUser'    => panda_child_current_user_data(),
    ] );
}

/**
 * Get current user data for JS localization.
 */
function panda_child_current_user_data(): ?array {
    if ( ! is_user_logged_in() ) {
        return null;
    }
    $current = wp_get_current_user();
    return [
        'id'           => $current->ID,
        'display_name' => $current->display_name,
        'email'        => $current->user_email,
        'avatar'       => get_avatar_url( $current->ID, [ 'size' => 32 ] ),
        'roles'        => $current->roles,
    ];
}

// -----------------------------------------------------------
//  Kadence overrides — suppress default header/footer
// -----------------------------------------------------------

/**
 * Remove Kadence default header so we can provide our own.
 */
add_filter( 'kadence_has_header', '__return_false' );

/**
 * Remove Kadence default footer so we can provide our own.
 */
add_filter( 'kadence_has_footer', '__return_false' );

/**
 * Disable Kadence page title on front page.
 */
add_filter( 'kadence_title', function ( $title ) {
    if ( is_front_page() ) {
        return false;
    }
    return $title;
} );

// -----------------------------------------------------------
//  Template routing — custom rewrite for SPA-like URLs
// -----------------------------------------------------------

/**
 * Add custom query vars.
 */
add_filter( 'query_vars', 'panda_child_query_vars' );
function panda_child_query_vars( array $vars ): array {
    return array_merge( $vars, [
        'panda_page',
        'panda_id',
        'panda_slug',
        'panda_sub',
    ] );
}

/**
 * Intercept template routing.
 * Maps Next.js-style URLs to WordPress template files.
 */
add_filter( 'template_include', 'panda_child_template_include', 99 );
function panda_child_template_include( string $template ): string {
    if ( is_admin() || wp_doing_ajax() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
        return $template;
    }

    // Parse the request path
    $request_uri = parse_url( $_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH );
    $wp_path     = rtrim( parse_url( home_url(), PHP_URL_PATH ) ?: '', '/' );
    $path        = '/' . ltrim( substr( $request_uri, strlen( $wp_path ) ), '/' );
    $parts       = array_values( array_filter( explode( '/', trim( $path, '/' ) ) ) );

    // Homepage
    if ( empty( $parts[0] ) ) {
        return PANDA_CHILD_DIR . '/template-parts/home/home.php';
    }

    $slug = $parts[0] ?? '';
    $id   = $parts[1] ?? '';
    $sub  = $parts[2] ?? '';

    // Route map: Next.js-style URL → template file
    $routes = [
        // Static pages
        'about'     => [ 't' => 'template-parts/static/page.php',       'id' => false ],
        'team'      => [ 't' => 'template-parts/static/page.php',       'id' => false ],
        'contact'   => [ 't' => 'template-parts/static/contact.php',    'id' => false ],
        'privacy'   => [ 't' => 'template-parts/static/page.php',       'id' => false ],
        'terms'     => [ 't' => 'template-parts/static/page.php',       'id' => false ],

        // Archive pages
        'modules'   => [ 't' => 'template-parts/archive/modules.php',   'id' => false ],
        'paths'     => [ 't' => 'template-parts/archive/paths.php',     'id' => false ],
        'video'     => [ 't' => 'template-parts/archive/videos.php',    'id' => false ],
        'cases'     => [ 't' => 'template-parts/archive/cases.php',     'id' => false ],
        'search'    => [ 't' => 'template-parts/archive/search.php',    'id' => false ],
        'quiz-page' => [ 't' => 'template-parts/quiz/quiz-page.php',    'id' => false ],

        // Single detail pages
        'article'   => [ 't' => 'template-parts/single/article.php',    'id' => true ],
        'course'    => [ 't' => 'template-parts/single/course.php',     'id' => true ],
        'lesson'    => [ 't' => 'template-parts/single/lesson.php',     'id' => true ],
        'knowledge' => [ 't' => 'template-parts/single/knowledge.php',  'id' => true ],
        'note'      => [ 't' => 'template-parts/single/note.php',       'id' => true ],
        'step'      => [ 't' => 'template-parts/single/step.php',       'id' => true ],
        'learning'  => [ 't' => 'template-parts/single/learning-path.php', 'id' => true ],

        // Category — filter by module
        'category'  => [ 't' => 'template-parts/archive/category.php',  'id' => false ],

        // Auth pages
        'login'     => [ 't' => 'template-parts/auth/login.php',        'id' => false ],
        'register'  => [ 't' => 'template-parts/auth/register.php',     'id' => false ],
        'profile'   => [ 't' => 'template-parts/auth/profile.php',      'id' => false ],
        'membership'=> [ 't' => 'template-parts/auth/membership.php',   'id' => false ],

        // Topic/glossary pages
        'glossary'  => [ 't' => 'template-parts/archive/topic.php',     'id' => false ],
        'trends'    => [ 't' => 'template-parts/archive/topic.php',     'id' => false ],
        'career'    => [ 't' => 'template-parts/archive/topic.php',     'id' => false ],
    ];

    if ( isset( $routes[ $slug ] ) ) {
        $r = $routes[ $slug ];
        set_query_var( 'panda_page', $slug );
        if ( $r['id'] && $id ) {
            set_query_var( 'panda_id', (int) $id );
            set_query_var( 'panda_slug', $sub );
        }
        $tpl = PANDA_CHILD_DIR . '/' . $r['t'];
        if ( file_exists( $tpl ) ) {
            return $tpl;
        }
    }

    // No match → keep Kadence's default template
    return $template;
}

// -----------------------------------------------------------
//  API helpers
// -----------------------------------------------------------

/**
 * Fetch data from the sap/v1/ REST API.
 */
function panda_api_get( string $endpoint, array $params = [] ): ?array {
    $url = PANDA_REST_URL . $endpoint;
    if ( ! empty( $params ) ) {
        $url = add_query_arg( $params, $url );
    }

    $args = [
        'timeout' => 15,
        'headers' => [ 'Content-Type' => 'application/json' ],
    ];

    $token = panda_get_token();
    if ( $token ) {
        $args['headers']['Authorization'] = 'Bearer ' . $token;
    }

    $response = wp_remote_get( $url, $args );
    if ( is_wp_error( $response ) ) {
        return null;
    }

    $body = json_decode( wp_remote_retrieve_body( $response ), true );
    if ( ! is_array( $body ) ) {
        return null;
    }

    return $body['success'] ? ( $body['data'] ?? $body ) : null;
}

/**
 * Get JWT token from cookie or transient.
 */
function panda_get_token(): ?string {
    $token = $_COOKIE['aladdin_token'] ?? '';
    if ( ! $token && is_user_logged_in() ) {
        $token = get_transient( 'aladdin_token_' . get_current_user_id() );
    }
    return $token ?: null;
}

// -----------------------------------------------------------
//  Helper functions
// -----------------------------------------------------------

/**
 * Module color by slug.
 */
function panda_module_color( string $slug ): string {
    $colors = [
        'fi'   => '#2f6d44', 'co' => '#2641a1',
        'mm'   => '#a25411', 'sd' => '#b62a4a',
        'pp'   => '#4828a8', 'hr' => '#8a6212',
        'abap' => '#1f6f6f', 'basis' => '#4a432d',
        's4'   => '#1864a3',
    ];
    return $colors[ $slug ] ?? 'var(--accent)';
}

/**
 * Difficulty label.
 */
function panda_difficulty_label( string $level ): string {
    $labels = [ 'beginner' => '初級', 'intermediate' => '中級', 'advanced' => '上級' ];
    return $labels[ $level ] ?? $level;
}

/**
 * Difficulty CSS class.
 */
function panda_difficulty_class( string $level ): string {
    $map = [ 'beginner' => 'l1', 'intermediate' => 'l2', 'advanced' => 'l3' ];
    return $map[ $level ] ?? '';
}

/**
 * Format date string.
 */
function panda_format_date( string $date ): string {
    $ts = strtotime( $date );
    if ( ! $ts ) {
        return $date;
    }
    return date( 'Y.m.d', $ts );
}

/**
 * Truncate text.
 */
function panda_excerpt( string $text, int $len = 80 ): string {
    if ( mb_strlen( $text ) <= $len ) {
        return $text;
    }
    return mb_substr( $text, 0, $len ) . '…';
}

/**
 * Default homepage modules fallback.
 */
function panda_default_modules(): array {
    return [
        [ 'slug' => 'fi',   'code' => 'FI',   'name_ja' => '財務会計',      'name_en' => 'Financial Accounting', 'description' => '会計帳簿、決算、勘定科目。', 'color' => '#2f6d44', 'bg_color' => '#d8ead9', 'article_count' => 48, 'levels' => ['初級','中級','上級'] ],
        [ 'slug' => 'co',   'code' => 'CO',   'name_ja' => '管理会計',      'name_en' => 'Controlling',         'description' => '原価計算、利益分析、予算管理。', 'color' => '#2641a1', 'bg_color' => '#dde4fc', 'article_count' => 32, 'levels' => ['初級','中級'] ],
        [ 'slug' => 'mm',   'code' => 'MM',   'name_ja' => '購買・在庫',    'name_en' => 'Material Management',  'description' => '購買依頼から入庫まで。', 'color' => '#a25411', 'bg_color' => '#fde0c2', 'article_count' => 41, 'levels' => ['初級','中級','上級'] ],
        [ 'slug' => 'sd',   'code' => 'SD',   'name_ja' => '販売管理',      'name_en' => 'Sales & Distribution', 'description' => '受注、出荷、請求。', 'color' => '#b62a4a', 'bg_color' => '#ffdfe6', 'article_count' => 36, 'levels' => ['初級','中級','上級'] ],
        [ 'slug' => 'pp',   'code' => 'PP',   'name_ja' => '生産計画',      'name_en' => 'Production Planning',  'description' => 'MRP、BOM、製造指示。', 'color' => '#4828a8', 'bg_color' => '#e4dffb', 'article_count' => 22, 'levels' => ['中級','上級'] ],
        [ 'slug' => 'hr',   'code' => 'HR',   'name_ja' => '人事管理',      'name_en' => 'Human Resources',     'description' => '人事マスタ、給与、勤怠。', 'color' => '#8a6212', 'bg_color' => '#fee9b3', 'article_count' => 18, 'levels' => ['初級','中級'] ],
        [ 'slug' => 'abap', 'code' => 'ABAP', 'name_ja' => '開発言語',      'name_en' => 'ABAP',                'description' => 'SAP独自の開発言語。', 'color' => '#1f6f6f', 'bg_color' => '#cfecec', 'article_count' => 54, 'levels' => ['初級','中級','上級'] ],
        [ 'slug' => 'basis','code' => 'Basis','name_ja' => '基盤管理',      'name_en' => 'Basis',               'description' => 'システム運用、権限、パッチ。', 'color' => '#4a432d', 'bg_color' => '#e3e1d8', 'article_count' => 26, 'levels' => ['中級','上級'] ],
        [ 'slug' => 's4',   'code' => 'S/4',  'name_ja' => 'S/4HANA',       'name_en' => 'Next-gen ERP',        'description' => '次世代ERP。', 'color' => '#1864a3', 'bg_color' => '#d1ecf9', 'article_count' => 39, 'levels' => ['初級','中級','上級'] ],
    ];
}

/**
 * Default learning paths fallback.
 */
function panda_default_paths(): array {
    return [
        [ 'id' => 1, 'audience' => '新人さん向け', 'title' => 'SAPって何？からはじめる入門コース', 'description' => '初日からつまずきがちな用語と基本フローをやさしく整理。', 'accent' => '#5a9d6e', 'duration' => '約3週間', 'steps' => [ ['title' => 'SAPの世界観を知る', 'time' => '20 min'], ['title' => 'GUI操作の基本', 'time' => '30 min'], ['title' => 'マスタとトランザクション', 'time' => '40 min'], ['title' => 'はじめての仕訳入力', 'time' => '45 min'] ] ],
        [ 'id' => 2, 'audience' => 'コンサル中級', 'title' => 'プロジェクトで通用する設計力', 'description' => 'Fit/Gap、業務プロセス設計、カスタマイズ判断。', 'accent' => '#d97548', 'duration' => '約6週間', 'steps' => [ ['title' => '要件定義の進め方', 'time' => '50 min'], ['title' => '組織構造の設計', 'time' => '60 min'], ['title' => 'マスタ設計のコツ', 'time' => '45 min'], ['title' => 'テストシナリオ作成', 'time' => '40 min'] ] ],
        [ 'id' => 3, 'audience' => '開発者向け', 'title' => 'ABAP × S/4HANA モダン開発', 'description' => 'CDS Views、AMDP、RAP — 新世代のABAP開発。', 'accent' => '#d96570', 'duration' => '約8週間', 'steps' => [ ['title' => 'モダンABAP構文', 'time' => '40 min'], ['title' => 'CDS Views入門', 'time' => '55 min'], ['title' => 'ODataサービス公開', 'time' => '50 min'], ['title' => 'Fiori連携の基礎', 'time' => '60 min'] ] ],
    ];
}

/**
 * Default articles fallback.
 */
function panda_default_articles(): array {
    return [
        [ 'id' => 1, 'title' => '【保存版】SAP用語集 — はじめての100単語', 'slug' => 'sap-glossary', 'excerpt' => 'SAPに出てくる専門用語を100個厳選', 'module' => ['slug' => 'fi', 'name' => '財務会計'], 'difficulty' => ['slug' => 'beginner', 'name' => '初級'], 'reading_time' => 15, 'views' => 12500, 'author' => ['display_name' => 'パンダ先生'] ],
        [ 'id' => 2, 'title' => 'BAPI とは何か、なぜ使うのか', 'slug' => 'bapi-intro', 'excerpt' => 'SAPの拡張開発でよく聞くBAPIを5分で解説', 'module' => ['slug' => 'abap', 'name' => 'ABAP'], 'difficulty' => ['slug' => 'intermediate', 'name' => '中級'], 'reading_time' => 5, 'views' => 8200, 'author' => ['display_name' => 'パンダ先生'] ],
        [ 'id' => 3, 'title' => 'Fiori vs SAP GUI — 結局どう使い分ける？', 'slug' => 'fiori-vs-gui', 'excerpt' => 'モダンFioriとクラシックGUIの比較', 'module' => ['slug' => 's4', 'name' => 'S/4HANA'], 'difficulty' => ['slug' => 'beginner', 'name' => '初級'], 'reading_time' => 8, 'views' => 6100, 'author' => ['display_name' => 'パンダ先生'] ],
    ];
}

/**
 * Default videos fallback.
 */
function panda_default_videos(): array {
    return [
        [ 'id' => 1, 'title' => 'SAPとは？初心者向け解説', 'youtube_id' => 'dQw4w9WgXcQ', 'duration' => '15:32', 'module' => ['slug' => 'fi', 'name' => '財務会計'] ],
        [ 'id' => 2, 'title' => 'FIモジュール入門', 'youtube_id' => 'dQw4w9WgXcQ', 'duration' => '22:18', 'module' => ['slug' => 'fi', 'name' => '財務会計'] ],
        [ 'id' => 3, 'title' => 'MM購買プロセスを完全理解', 'youtube_id' => 'dQw4w9WgXcQ', 'duration' => '18:45', 'module' => ['slug' => 'mm', 'name' => '購買管理'] ],
        [ 'id' => 4, 'title' => 'ABAPプログラミング超入門', 'youtube_id' => 'dQw4w9WgXcQ', 'duration' => '35:00', 'module' => ['slug' => 'abap', 'name' => '開発言語'] ],
    ];
}

// -----------------------------------------------------------
//  JWT token management (cookie-based)
// -----------------------------------------------------------
function panda_set_token( string $token, int $user_id = 0 ): void {
    if ( ! $user_id ) {
        $user_id = get_current_user_id();
    }
    setcookie( 'aladdin_token', $token, time() + DAY_IN_SECONDS * 30, COOKIEPATH, COOKIE_DOMAIN, is_ssl(), true );
    if ( $user_id ) {
        set_transient( 'aladdin_token_' . $user_id, $token, DAY_IN_SECONDS * 30 );
    }
}

function panda_clear_token(): void {
    setcookie( 'aladdin_token', '', time() - HOUR_IN_SECONDS, COOKIEPATH, COOKIE_DOMAIN, is_ssl(), true );
    if ( is_user_logged_in() ) {
        delete_transient( 'aladdin_token_' . get_current_user_id() );
    }
}

// -----------------------------------------------------------
//  Body class
// -----------------------------------------------------------
add_filter( 'body_class', 'panda_child_body_class' );
function panda_child_body_class( array $classes ): array {
    $classes[] = 'panda-sensei-theme';
    return $classes;
}

// -----------------------------------------------------------
//  Excerpt length
// -----------------------------------------------------------
add_filter( 'excerpt_length', function () { return 30; } );
add_filter( 'excerpt_more', function () { return '…'; } );

// -----------------------------------------------------------
//  AJAX login / register handlers
// -----------------------------------------------------------

/**
 * AJAX login — authenticate and set JWT token.
 */
add_action( 'wp_ajax_nopriv_panda_ajax_login', 'panda_handle_ajax_login' );
function panda_handle_ajax_login(): void {
    check_ajax_referer( 'panda_login_nonce', 'nonce' );

    $email    = sanitize_email( $_POST['email'] ?? '' );
    $password = $_POST['password'] ?? '';

    if ( ! $email || ! $password ) {
        wp_send_json_error( [ 'message' => 'メールアドレスとパスワードを入力してください。' ] );
    }

    // Try WordPress authentication first
    $user = wp_authenticate( $email, $password );
    if ( is_wp_error( $user ) ) {
        // Try JWP-based REST API auth
        $response = wp_remote_post( PANDA_REST_URL . 'auth/login', [
            'headers' => [ 'Content-Type' => 'application/json' ],
            'body'    => wp_json_encode( [ 'email' => $email, 'password' => $password ] ),
            'timeout' => 15,
        ] );

        if ( is_wp_error( $response ) ) {
            wp_send_json_error( [ 'message' => 'ログインに失敗しました。' ] );
        }

        $body = json_decode( wp_remote_retrieve_body( $response ), true );
        if ( ! empty( $body['success'] ) && ! empty( $body['data']['token'] ) ) {
            panda_set_token( $body['data']['token'], $body['data']['user']['id'] ?? 0 );
            wp_send_json_success( [
                'message' => 'ログインしました。',
                'user'    => $body['data']['user'],
            ] );
        }

        wp_send_json_error( [ 'message' => 'メールアドレスまたはパスワードが正しくありません。' ] );
    }

    // WordPress auth succeeded — log in
    wp_set_auth_cookie( $user->ID, true );
    $token_data = [ 'success' => true, 'data' => [ 'user' => [
        'id'           => $user->ID,
        'display_name' => $user->display_name,
        'email'        => $user->user_email,
        'roles'        => $user->roles,
    ]]];
    wp_send_json_success( $token_data['data'] );
}

/**
 * AJAX register — create a new user.
 */
add_action( 'wp_ajax_nopriv_panda_ajax_register', 'panda_handle_ajax_register' );
function panda_handle_ajax_register(): void {
    check_ajax_referer( 'panda_register_nonce', 'nonce' );

    $email       = sanitize_email( $_POST['email'] ?? '' );
    $password    = $_POST['password'] ?? '';
    $display_name = sanitize_text_field( $_POST['display_name'] ?? '' );

    if ( ! $email || ! $password || ! $display_name ) {
        wp_send_json_error( [ 'message' => 'すべての項目を入力してください。' ] );
    }

    if ( strlen( $password ) < 8 ) {
        wp_send_json_error( [ 'message' => 'パスワードは8文字以上で入力してください。' ] );
    }

    if ( email_exists( $email ) ) {
        wp_send_json_error( [ 'message' => 'このメールアドレスは既に登録されています。' ] );
    }

    $user_id = wp_insert_user( [
        'user_login'    => $email,
        'user_email'    => $email,
        'user_pass'     => $password,
        'display_name'  => $display_name,
        'role'          => 'subscriber',
    ] );

    if ( is_wp_error( $user_id ) ) {
        wp_send_json_error( [ 'message' => '登録に失敗しました: ' . $user_id->get_error_message() ] );
    }

    // Auto-login after registration
    wp_set_auth_cookie( $user_id, true );
    $user = get_userdata( $user_id );

    wp_send_json_success( [
        'message' => '登録が完了しました。',
        'user'    => [
            'id'           => $user->ID,
            'display_name' => $user->display_name,
            'email'        => $user->user_email,
        ],
    ] );
}

// -----------------------------------------------------------
//  Flush rewrite rules on theme switch
// -----------------------------------------------------------
add_action( 'after_switch_theme', function () {
    flush_rewrite_rules();
} );
