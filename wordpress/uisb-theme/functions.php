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

function uisb_primary_fallback(): void {
    echo '<ul>';
    foreach ([
        __('Beranda', 'uisb') => home_url('/'),
        __('Akademik', 'uisb') => get_post_type_archive_link('program'),
        __('Fasilitas', 'uisb') => get_post_type_archive_link('facility'),
        __('Informasi', 'uisb') => get_post_type_archive_link('information'),
    ] as $label => $url) {
        if ($url) {
            printf('<li><a href="%s">%s</a></li>', esc_url($url), esc_html($label));
        }
    }
    echo '</ul>';
}
function uisb_footer_fallback(): void {
    uisb_primary_fallback();
}

function uisb_meta_box_fields(): array {
    return [
        'program' => [
            'label' => ['text', 'Label program studi'],
            'short_description' => ['textarea', 'Deskripsi singkat'],
        ],
        'facility' => [
            'short_description' => ['textarea', 'Deskripsi singkat'],
            'icon' => ['text', 'Nama ikon (opsional)'],
        ],
        'achievement' => [
            'link_url' => ['url', 'URL terkait (opsional)'],
        ],
        'dosen' => [
            'title_role' => ['text', 'Jabatan / gelar'],
            'campus' => ['text', 'Kampus'],
        ],
        'testimonial' => [
            'designation' => ['text', 'Jabatan / program'],
        ],
        'video' => [
            'youtube_id' => ['text', 'YouTube video ID'],
            'external_url' => ['url', 'URL video (opsional)'],
        ],
        'hero_slide' => [
            'device_type' => ['select', 'Tipe perangkat', ['desktop' => 'Desktop', 'mobile' => 'Mobile', 'both' => 'Keduanya']],
            'button_label' => ['text', 'Label tombol (opsional)'],
            'button_url' => ['url', 'URL tombol (opsional)'],
        ],
        'popup' => [
            'button_label' => ['text', 'Label tombol'],
            'button_url' => ['url', 'URL tombol'],
            'event_date' => ['text', 'Tanggal acara (YYYY-MM-DD)'],
            'is_active' => ['checkbox', 'Aktifkan popup'],
        ],
        'information' => [
            'link_url' => ['url', 'URL terkait (opsional)'],
        ],
    ];
}

function uisb_add_meta_boxes(): void {
    foreach (uisb_meta_box_fields() as $post_type => $fields) {
        add_meta_box(
            'uisb_content_fields',
            __('Informasi UISB', 'uisb'),
            'uisb_render_meta_box',
            $post_type,
            'normal',
            'default',
            ['fields' => $fields]
        );
    }
}
add_action('add_meta_boxes', 'uisb_add_meta_boxes');

function uisb_render_meta_box(WP_Post $post, array $box): void {
    $fields = $box['args']['fields'] ?? [];
    wp_nonce_field('uisb_save_meta_' . $post->ID, 'uisb_meta_nonce');
    echo '<div class="uisb-meta-fields">';
    foreach ($fields as $key => $definition) {
        $type = $definition[0];
        $label = $definition[1];
        $value = get_post_meta($post->ID, '_uisb_' . $key, true);
        printf('<p><label for="uisb_%1$s"><strong>%2$s</strong></label><br>', esc_attr($key), esc_html($label));
        if ($type === 'textarea') {
            printf('<textarea class="widefat" rows="3" id="uisb_%1$s" name="uisb_meta[%1$s]">%2$s</textarea>', esc_attr($key), esc_textarea((string) $value));
        } elseif ($type === 'select') {
            printf('<select class="widefat" id="uisb_%1$s" name="uisb_meta[%1$s]">', esc_attr($key));
            foreach (($definition[2] ?? []) as $option => $option_label) {
                printf('<option value="%1$s" %2$s>%3$s</option>', esc_attr((string) $option), selected((string) $value, (string) $option, false), esc_html($option_label));
            }
            echo '</select>';
        } elseif ($type === 'checkbox') {
            printf('<input type="checkbox" id="uisb_%1$s" name="uisb_meta[%1$s]" value="1" %2$s>', esc_attr($key), checked((string) $value, '1', false));
        } else {
            printf('<input class="widefat" type="%1$s" id="uisb_%2$s" name="uisb_meta[%2$s]" value="%3$s">', esc_attr($type), esc_attr($key), esc_attr((string) $value));
        }
        echo '</p>';
    }
    echo '<p class="description">' . esc_html__('Gunakan Gambar Unggulan untuk gambar/thumbnail utama. Simpan perubahan sebelum melihat hasil di website.', 'uisb') . '</p></div>';
}

function uisb_save_meta_box(int $post_id): void {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (wp_is_post_revision($post_id) || !isset($_POST['uisb_meta_nonce'])) {
        return;
    }
    $nonce = sanitize_text_field(wp_unslash($_POST['uisb_meta_nonce']));
    if (!wp_verify_nonce($nonce, 'uisb_save_meta_' . $post_id)) {
        return;
    }
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    $post_type = get_post_type($post_id);
    $fields = uisb_meta_box_fields()[$post_type] ?? [];
    $submitted = isset($_POST['uisb_meta']) && is_array($_POST['uisb_meta']) ? wp_unslash($_POST['uisb_meta']) : [];
    foreach ($fields as $key => $definition) {
        $type = $definition[0];
        if ($type === 'checkbox') {
            update_post_meta($post_id, '_uisb_' . $key, isset($submitted[$key]) && $submitted[$key] === '1' ? '1' : '0');
            continue;
        }
        if (!array_key_exists($key, $submitted)) {
            continue;
        }
        $raw = is_scalar($submitted[$key]) ? (string) $submitted[$key] : '';
        if ($type === 'url') {
            $value = esc_url_raw($raw);
        } elseif ($type === 'textarea') {
            $value = sanitize_textarea_field($raw);
        } else {
            $value = sanitize_text_field($raw);
        }
        update_post_meta($post_id, '_uisb_' . $key, $value);
    }
}
add_action('save_post', 'uisb_save_meta_box');
