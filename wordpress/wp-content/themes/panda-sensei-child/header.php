<?php
/**
 * Header — SAP Panda Kadence child theme
 *
 * Next.js版のヘッダーを再現。ロゴ、ナビゲーション、検索ピル、ログイン/ユーザーメニュー。
 *
 * @package Panda_Sensei_Child
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="profile" href="https://gmpg.org/xfn/11">
<?php wp_head(); ?>
</head>
<body <?php body_class( 'panda-sensei-theme' ); ?>>
<?php wp_body_open(); ?>

<div id="page" class="site">

    <?php
    /***** パンダ先生のSVGアバター *****/
    $panda_avatar = '
    <svg width="38" height="38" viewBox="-4 -8 108 108" class="panda-svg">
      <circle cx="50" cy="52" r="46" fill="#e8f0fb" opacity="0.4"/>
      <g>
        <ellipse cx="22" cy="18" rx="13" ry="12" fill="#1a1612"/>
        <ellipse cx="78" cy="18" rx="13" ry="12" fill="#1a1612"/>
        <path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2"/>
        <g>
          <path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612"/>
          <path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612"/>
        </g>
        <circle cx="30" cy="44" r="3.4" fill="#fff"/>
        <circle cx="30" cy="44" r="2.4" fill="#0e0a05"/>
        <circle cx="70" cy="44" r="3.4" fill="#fff"/>
        <circle cx="70" cy="44" r="2.4" fill="#0e0a05"/>
        <ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612"/>
        <path d="M 50 64 L 50 67" stroke="#1a1612" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M 43 70 Q 50 74 57 70" fill="none" stroke="#1a1612" stroke-width="1.8" stroke-linecap="round"/>
      </g>
    </svg>';

    $current_user = wp_get_current_user();
    $is_logged_in = is_user_logged_in();
    $user_initial = $is_logged_in ? strtoupper( mb_substr( $current_user->display_name, 0, 1 ) ) : '?';
    $is_admin     = $is_logged_in && in_array( 'administrator', (array) $current_user->roles, true );

    /* アクティブページ判定 */
    $request_path = parse_url( $_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH );
    $nav_links = [
        'home'    => [ 'label' => 'ホーム',    'href' => home_url( '/' ) ],
        'modules' => [ 'label' => 'モジュール', 'href' => home_url( '/modules' ) ],
        'paths'   => [ 'label' => '学習パス',   'href' => home_url( '/paths' ) ],
        'quiz'    => [ 'label' => '今日の一問', 'href' => home_url( '/quiz-page' ) ],
        'cases'   => [ 'label' => '案件・仕事', 'href' => home_url( '/cases' ) ],
        'yt'      => [ 'label' => '動画',      'href' => home_url( '/video' ) ],
    ];
    $active_id = '';
    foreach ( $nav_links as $id => $link ) {
        $path = parse_url( $link['href'], PHP_URL_PATH );
        if ( $path && $path !== '/' && str_starts_with( $request_path, $path ) ) {
            $active_id = $id;
            break;
        }
    }
    if ( $request_path === '/' || $request_path === '' ) {
        $active_id = 'home';
    }
    ?>

    <!-- Page background decoration -->
    <div class="page-bg"></div>

    <?php
    /***** ヘッダー *****/ ?>
    <header class="site-header">
        <div class="nav-wrap">

            <!-- Brand -->
            <a class="brand" href="<?php echo esc_url( home_url( '/' ) ); ?>">
                <div class="logo-panda"><?php echo $panda_avatar; // phpcs:ignore ?></div>
                <div class="brand-text">
                    <div class="brand-name">パンダ<span class="sensei">先生</span></div>
                    <div class="brand-sub">SAP NAVI · パンダ ナビ</div>
                </div>
            </a>

            <!-- Main navigation -->
            <nav class="nav-main">
                <?php foreach ( $nav_links as $id => $link ) : ?>
                    <a href="<?php echo esc_url( $link['href'] ); ?>"
                       class="nav-link <?php echo $active_id === $id ? 'active' : ''; ?>">
                        <?php echo esc_html( $link['label'] ); ?>
                    </a>
                <?php endforeach; ?>
            </nav>

            <!-- Right section -->
            <div class="nav-right">

                <!-- Search pill -->
                <div class="search-pill" onclick="window.location.href='<?php echo esc_url( home_url( '/search' ) ); ?>'">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
                        <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
                    </svg>
                    <span style="flex:1;font-size:13px;color:var(--ink-3);user-select:none">モジュール、用語、エラー番号...</span>
                    <span class="kbd">⌘K</span>
                </div>

                <!-- User / Login -->
                <div class="user-menu-container" style="position:relative">
                    <?php if ( $is_logged_in ) : ?>
                        <button type="button" class="user-menu-btn" id="user-menu-btn">
                            <span class="user-avatar"><?php echo esc_html( $user_initial ); ?></span>
                            <span style="max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
                                <?php echo esc_html( $current_user->display_name ); ?>
                            </span>
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" class="user-chevron">
                                <path d="M2 3.5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <div class="user-dropdown" id="user-dropdown" style="display:none">
                            <div class="user-dropdown-header">
                                <div class="user-dropdown-name"><?php echo esc_html( $current_user->display_name ); ?></div>
                                <div class="user-dropdown-email"><?php echo esc_html( $current_user->user_email ); ?></div>
                                <?php if ( $is_admin ) : ?>
                                    <span class="user-dropdown-role">管理者</span>
                                <?php endif; ?>
                            </div>
                            <a href="<?php echo esc_url( home_url( '/profile' ) ); ?>" class="user-dropdown-item">👤 プロフィール</a>
                            <?php if ( $is_admin ) : ?>
                                <a href="<?php echo esc_url( home_url( '/admin' ) ); ?>" class="user-dropdown-item">⚙ 管理画面</a>
                            <?php endif; ?>
                            <div class="user-dropdown-divider"></div>
                            <button type="button" class="user-dropdown-logout" id="user-logout-btn">🚪 ログアウト</button>
                        </div>
                    <?php else : ?>
                        <a href="<?php echo esc_url( home_url( '/login' ) ); ?>" class="btn sm accent">無料登録</a>
                    <?php endif; ?>
                </div>

                <!-- Mobile menu button -->
                <button type="button" class="mobile-menu-btn" id="mobile-menu-btn" aria-label="メニュー">☰</button>

            </div>
        </div>
    </header>

    <?php
    /***** モバイルメニュー（オーバーレイ） *****/ ?>
    <div class="mobile-menu-overlay" id="mobile-menu-overlay" style="display:none">
        <div class="mobile-menu-panel" id="mobile-menu-panel">
            <?php if ( $is_logged_in ) : ?>
                <div class="mobile-menu-user">
                    <span class="user-avatar" style="width:36px;height:36px;font-size:16px"><?php echo esc_html( $user_initial ); ?></span>
                    <div>
                        <div style="font-size:14px;font-weight:700;color:var(--ink-0)"><?php echo esc_html( $current_user->display_name ); ?></div>
                        <div style="font-size:12px;color:var(--ink-3)"><?php echo esc_html( $current_user->user_email ); ?></div>
                    </div>
                </div>
            <?php endif; ?>
            <nav class="mobile-nav-links">
                <?php foreach ( $nav_links as $id => $link ) : ?>
                    <a href="<?php echo esc_url( $link['href'] ); ?>" class="mobile-nav-link"><?php echo esc_html( $link['label'] ); ?></a>
                <?php endforeach; ?>
            </nav>
            <div class="mobile-nav-extra">
                <?php if ( $is_logged_in ) : ?>
                    <a href="<?php echo esc_url( home_url( '/profile' ) ); ?>" class="mobile-nav-link">👤 プロフィール</a>
                    <?php if ( $is_admin ) : ?>
                        <a href="<?php echo esc_url( home_url( '/admin' ) ); ?>" class="mobile-nav-link">⚙ 管理画面</a>
                    <?php endif; ?>
                <?php endif; ?>
                <a href="<?php echo esc_url( home_url( '/glossary' ) ); ?>" class="mobile-nav-link">📚 用語集</a>
                <a href="<?php echo esc_url( home_url( '/trends' ) ); ?>" class="mobile-nav-link">📈 SAPトレンド</a>
                <a href="<?php echo esc_url( home_url( '/career' ) ); ?>" class="mobile-nav-link">🎯 転職ガイド</a>
                <?php if ( $is_logged_in ) : ?>
                    <button type="button" class="mobile-nav-logout" id="mobile-logout-btn">🚪 ログアウト</button>
                <?php endif; ?>
            </div>
            <button type="button" class="mobile-menu-close" id="mobile-menu-close">✕</button>
        </div>
    </div>

    <?php
    /***** モバイルボトムナビ（固定） *****/ ?>
    <nav class="mob-bottom-nav">
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="mob-nav-item <?php echo $active_id === 'home' ? 'mob-active' : ''; ?>">
            <span class="mob-nav-icon">🏠</span>
            <span class="mob-nav-label">ホーム</span>
        </a>
        <a href="<?php echo esc_url( home_url( '/modules' ) ); ?>" class="mob-nav-item <?php echo $active_id === 'modules' ? 'mob-active' : ''; ?>">
            <span class="mob-nav-icon">📦</span>
            <span class="mob-nav-label">モジュール</span>
        </a>
        <a href="<?php echo esc_url( home_url( '/paths' ) ); ?>" class="mob-nav-item <?php echo $active_id === 'paths' ? 'mob-active' : ''; ?>">
            <span class="mob-nav-icon">🗺️</span>
            <span class="mob-nav-label">学習パス</span>
        </a>
        <a href="<?php echo esc_url( home_url( '/quiz-page' ) ); ?>" class="mob-nav-item <?php echo $active_id === 'quiz' ? 'mob-active' : ''; ?>">
            <span class="mob-nav-icon">❓</span>
            <span class="mob-nav-label">クイズ</span>
        </a>
        <a href="<?php echo esc_url( home_url( '/search' ) ); ?>" class="mob-nav-item">
            <span class="mob-nav-icon">🔍</span>
            <span class="mob-nav-label">検索</span>
        </a>
    </nav>

    <div id="content" class="site-content">
