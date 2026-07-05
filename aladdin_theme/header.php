<?php
/**
 * サイトヘッダー
 *
 * @package Aladdin_SAP_Panda
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="profile" href="https://gmpg.org/xfn/11">
<?php wp_head(); ?>
</head>
<body <?php body_class( 'aladdin-theme' ); ?>>
<?php wp_body_open(); ?>

<div id="page" class="site">
    <a class="skip-link screen-reader-text" href="#content">
        <?php esc_html_e( 'コンテンツへスキップ', 'aladdin' ); ?>
    </a>

    <header id="masthead" class="site-header">
        <div class="header-inner container">
            <div class="site-branding">
                <?php if ( has_custom_logo() ) : ?>
                    <div class="site-logo"><?php the_custom_logo(); ?></div>
                <?php else : ?>
                    <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="site-title" rel="home">
                        🐼 SAP パンダ先生 NAVI
                    </a>
                <?php endif; ?>
            </div>

            <nav id="site-navigation" class="main-navigation" aria-label="<?php esc_attr_e( 'メインメニュー', 'aladdin' ); ?>">
                <?php
                if ( has_nav_menu( 'primary' ) ) {
                    wp_nav_menu( array(
                        'theme_location' => 'primary',
                        'menu_class'     => 'nav-menu',
                        'container'      => false,
                        'fallback_cb'    => 'aladdin_primary_menu_fallback',
                        'depth'          => 2,
                    ) );
                } else {
                    aladdin_primary_menu_fallback();
                }
                ?>
            </nav>

            <div class="header-actions">
                <button type="button" class="search-toggle" aria-label="<?php esc_attr_e( '検索', 'aladdin' ); ?>">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                </button>

                <?php if ( is_user_logged_in() ) : ?>
                    <a href="/profile" class="btn btn-ghost btn-sm header-profile-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/>
                        </svg>
                        <span class="profile-label"><?php echo esc_html( wp_get_current_user()->display_name ); ?></span>
                    </a>
                <?php else : ?>
                    <a href="/login" class="btn btn-primary btn-sm">ログイン</a>
                    <a href="/register" class="btn btn-outline btn-sm">登録</a>
                <?php endif; ?>

                <button type="button" class="mobile-menu-toggle" aria-label="<?php esc_attr_e( 'メニュー', 'aladdin' ); ?>">
                    <span class="hamburger-box"><span class="hamburger-inner"></span></span>
                </button>
            </div>
        </div>

        <div class="header-search" id="header-search" style="display:none;">
            <form role="search" method="get" action="/search" class="search-form">
                <input type="search" name="q" placeholder="<?php esc_attr_e( '記事を検索…', 'aladdin' ); ?>" required>
                <button type="submit">検索</button>
            </form>
        </div>
    </header>

    <div class="mobile-menu-overlay" id="mobile-menu-overlay"></div>
    <nav class="mobile-menu-panel" id="mobile-menu-panel">
        <div class="mobile-menu-header">
            <span class="mobile-menu-title">メニュー</span>
            <button type="button" class="mobile-menu-close">&times;</button>
        </div>
        <div class="mobile-menu-content">
            <?php
            if ( has_nav_menu( 'mobile' ) ) {
                wp_nav_menu( array(
                    'theme_location' => 'mobile',
                    'menu_class'     => 'mobile-nav',
                    'container'      => false,
                    'fallback_cb'    => 'aladdin_mobile_menu_fallback',
                    'depth'          => 1,
                ) );
            } else {
                aladdin_mobile_menu_fallback();
            }
            ?>
            <div class="mobile-menu-auth">
                <?php if ( is_user_logged_in() ) : ?>
                    <a href="/profile" class="btn btn-primary btn-block">プロフィール</a>
                    <a href="#" class="btn btn-outline btn-block" id="mobile-logout-btn">ログアウト</a>
                <?php else : ?>
                    <a href="/login" class="btn btn-primary btn-block">ログイン</a>
                    <a href="/register" class="btn btn-outline btn-block">新規登録</a>
                <?php endif; ?>
            </div>
        </div>
    </nav>

    <div id="content" class="site-content">
