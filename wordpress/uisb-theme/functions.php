<?php
defined('ABSPATH') || exit;
define('UISB_THEME_VERSION', '0.1.0');

function uisb_theme_setup(): void {
    load_theme_textdomain('uisb', get_template_directory() . '/languages');
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script']);
    add_theme_support('custom-logo', ['height' => 100, 'width' => 320, 'flex-height' => true, 'flex-width' => true]);
    register_nav_menus(['primary' => __('Navigasi utama', 'uisb'), 'footer' => __('Navigasi footer', 'uisb')]);
}
add_action('after_setup_theme', 'uisb_theme_setup');

function uisb_enqueue_assets(): void {
    wp_enqueue_style('uisb-theme', get_stylesheet_uri(), [], UISB_THEME_VERSION);
    wp_enqueue_style('uisb-main', get_template_directory_uri() . '/assets/css/theme.css', ['uisb-theme'], UISB_THEME_VERSION);
    wp_enqueue_script('uisb-main', get_template_directory_uri() . '/assets/js/theme.js', [], UISB_THEME_VERSION, true);
}
add_action('wp_enqueue_scripts', 'uisb_enqueue_assets');

function uisb_register_content_types(): void {
    $types = [
        'program' => ['Program Studi', 'Program Studi', 'dashicons-welcome-learn-more'],
        'facility' => ['Fasilitas', 'Fasilitas', 'dashicons-building'],
        'achievement' => ['Prestasi', 'Prestasi', 'dashicons-awards'],
        'dosen' => ['Dosen', 'Dosen', 'dashicons-welcome-learn-more'],
        'testimonial' => ['Testimoni', 'Testimoni', 'dashicons-format-chat'],
        'video' => ['Video', 'Video', 'dashicons-video-alt3'],
        'hero_slide' => ['Hero Slide', 'Hero Slides', 'dashicons-format-image'],
        'popup' => ['Popup Informasi', 'Popup Informasi', 'dashicons-megaphone'],
        'information' => ['Informasi', 'Informasi', 'dashicons-info'],
    ];
    foreach ($types as $slug => $labels) {
        register_post_type($slug, [
            'labels' => [
                'name' => __($labels[1], 'uisb'),
                'singular_name' => __($labels[0], 'uisb'),
                'add_new_item' => sprintf(__('Tambah %s', 'uisb'), $labels[0]),
                'edit_item' => sprintf(__('Edit %s', 'uisb'), $labels[0]),
            ],
            'public' => true,
            'show_in_rest' => true,
            'has_archive' => !in_array($slug, ['hero_slide', 'popup', 'testimonial', 'video'], true),
            'menu_icon' => $labels[2],
            'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'page-attributes'],
            'rewrite' => ['with_front' => false],
        ]);
    }
}
add_action('init', 'uisb_register_content_types');

function uisb_excerpt(int $length = 24): string {
    return wp_trim_words(get_the_excerpt(), $length, '…');
}
function uisb_meta(string $key, int $post_id = 0): string {
    $value = get_post_meta($post_id ?: get_the_ID(), '_uisb_' . $key, true);
    return is_scalar($value) ? (string) $value : '';
}
function uisb_get_posts(string $type, int $count = 6, array $extra = []): WP_Query {
    return new WP_Query(array_merge([
        'post_type' => $type, 'post_status' => 'publish', 'posts_per_page' => $count,
        'orderby' => ['menu_order' => 'ASC', 'date' => 'DESC'], 'no_found_rows' => true,
    ], $extra));
}
