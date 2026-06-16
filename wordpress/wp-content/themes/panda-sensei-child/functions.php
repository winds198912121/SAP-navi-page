<?php
/**
 * SAP Panda Sensei Child Theme Functions
 *
 * @package Panda_Sensei_Child
 */

// Enqueue parent + child styles
add_action('wp_enqueue_scripts', 'panda_sensei_enqueue');
function panda_sensei_enqueue() {
    wp_enqueue_style('kadence-parent', get_template_directory_uri() . '/style.css');
    wp_enqueue_style('panda-sensei-child', get_stylesheet_uri(), ['kadence-parent'], '1.0.0');
}

// Enqueue Google Fonts
add_action('wp_enqueue_scripts', 'panda_sensei_fonts', 5);
function panda_sensei_fonts() {
    wp_enqueue_style('panda-google-fonts',
        'https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700;900&family=Noto+Sans+JP:wght@400;500;700;900&family=JetBrains+Mono:wght@500;600;700&family=Caveat:wght@500;700&display=swap',
        [],
        null
    );
}

// Register Navigation Menus
add_action('after_setup_theme', 'panda_sensei_menus');
function panda_sensei_menus() {
    register_nav_menus([
        'primary'          => 'メインナビゲーション',
        'footer-modules'   => 'フッター：モジュール',
        'footer-content'   => 'フッター：コンテンツ',
        'footer-about'     => 'フッター：About',
    ]);

    // Add theme supports
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo', [
        'height'      => 60,
        'width'       => 200,
        'flex-height' => true,
        'flex-width'  => true,
    ]);
}

// Register widget areas
add_action('widgets_init', 'panda_sensei_widgets');
function panda_sensei_widgets() {
    register_sidebar([
        'name'          => '記事サイドバー',
        'id'            => 'article-sidebar',
        'before_widget' => '<div class="widget %s">',
        'after_widget'  => '</div>',
    ]);
}

// Add custom body classes
add_filter('body_class', 'panda_sensei_body_class');
function panda_sensei_body_class($classes) {
    $classes[] = 'panda-sensei-theme';
    return $classes;
}

// Set custom excerpt length
add_filter('excerpt_length', function() { return 30; });

// Set excerpt more
add_filter('excerpt_more', function() { return '...'; });

// Remove default Kadence page title on front page
add_filter('kadence_title', function($title) {
    if (is_front_page()) return false;
    return $title;
});
