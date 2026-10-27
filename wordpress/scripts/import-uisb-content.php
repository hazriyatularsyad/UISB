<?php
/**
 * Import a JSON export of the legacy UISB PostgreSQL content into WordPress.
 *
 * Usage:
 *   UISB_EXPORT_JSON=/secure/path/uisb-export.json wp eval-file wordpress/scripts/import-uisb-content.php
 *
 * Expected JSON object keys: news, dosen, testimonials, videos, popups, programs,
 * facilities, information, achievements, hero_slides. Each value is an array of rows
 * using the column names in src/lib/schema.sql.
 */
defined('ABSPATH') || exit;

if (!defined('WP_CLI') || !WP_CLI) {
    exit("Run this importer with WP-CLI only.\n");
}

require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';
require_once ABSPATH . 'wp-admin/includes/image.php';

$export_path = getenv('UISB_EXPORT_JSON');
if (!$export_path || !is_readable($export_path)) {
    WP_CLI::error('Set UISB_EXPORT_JSON to a readable JSON export file. Do not place database credentials in this file.');
}

$raw = file_get_contents($export_path);
$dataset = json_decode($raw, true);
if (!is_array($dataset) || json_last_error() !== JSON_ERROR_NONE) {
    WP_CLI::error('The export file is not valid JSON.');
}

$maps = [
    'news' => ['post_type' => 'post', 'title' => 'title', 'content' => 'description', 'image' => 'image', 'meta' => ['legacy_date' => 'date', 'legacy_link' => 'link']],
    'dosen' => ['post_type' => 'dosen', 'title' => 'name', 'content' => 'description', 'image' => 'image', 'meta' => ['title_role' => 'title', 'campus' => 'campus']],
    'testimonials' => ['post_type' => 'testimonial', 'title' => 'name', 'content' => 'description', 'image' => 'profile_image', 'meta' => ['designation' => 'designation']],
    'videos' => ['post_type' => 'video', 'title' => 'title', 'content' => '', 'image' => 'thumbnail', 'meta' => ['youtube_id' => 'youtube_id']],
    'popups' => ['post_type' => 'popup', 'title' => 'title', 'content' => 'description', 'image' => 'image', 'meta' => ['button_label' => 'button_label', 'button_url' => 'button_href', 'event_date' => 'event_date', 'is_active' => 'is_active', 'attendees' => 'attendees']],
    'programs' => ['post_type' => 'program', 'title' => 'title', 'content' => 'description', 'image' => 'image', 'meta' => ['label' => 'label', 'short_description' => 'short_description', 'is_active' => 'is_active']],
    'facilities' => ['post_type' => 'facility', 'title' => 'title', 'content' => 'description', 'image' => 'image', 'meta' => ['short_description' => 'short_description', 'icon' => 'icon', 'is_active' => 'is_active']],
    'information' => ['post_type' => 'information', 'title' => 'title', 'content' => 'description', 'image' => 'image', 'meta' => ['is_active' => 'is_active']],
    'achievements' => ['post_type' => 'achievement', 'title' => 'title', 'content' => 'description', 'image' => 'image', 'meta' => ['link_url' => 'link_url', 'is_active' => 'is_active']],
    'hero_slides' => ['post_type' => 'hero_slide', 'title' => 'title', 'content' => '', 'image' => 'image', 'meta' => ['device_type' => 'device_type', 'is_active' => 'is_active']],
];

function uisb_import_bool($value): string {
    return filter_var($value, FILTER_VALIDATE_BOOLEAN) ? '1' : '0';
}

function uisb_import_image(string $url, int $post_id): void {
    if ($url === '') {
        return;
    }
    $previous_url = (string) get_post_meta($post_id, '_uisb_source_image_url', true);
    if ($previous_url === $url && has_post_thumbnail($post_id)) {
        return;
    }
    $parts = wp_parse_url($url);
    if (!is_array($parts) || ($parts['scheme'] ?? '') !== 'https' || empty($parts['host'])) {
        WP_CLI::warning("Skipping non-HTTPS or invalid image URL for post {$post_id}.");
        return;
    }
    $host = strtolower($parts['host']);
    if (!str_ends_with($host, '.supabase.co') && $host !== 'supabase.co') {
        WP_CLI::warning("Skipping image URL outside the expected Supabase domain for post {$post_id}.");
        return;
    }
    $attachment_id = media_sideload_image(esc_url_raw($url), $post_id, null, 'id');
    if (is_wp_error($attachment_id)) {
        WP_CLI::warning("Image import failed for post {$post_id}: " . $attachment_id->get_error_message());
        return;
    }
    set_post_thumbnail($post_id, (int) $attachment_id);
    update_post_meta($post_id, '_uisb_source_image_url', esc_url_raw($url));
}

$created = 0;
$updated = 0;
$skipped = 0;

foreach ($maps as $table => $map) {
    $rows = $dataset[$table] ?? [];
    if (!is_array($rows)) {
        WP_CLI::warning("Skipping {$table}: expected an array.");
        continue;
    }
    foreach ($rows as $row) {
        if (!is_array($row) || !isset($row['id'])) {
            $skipped++;
            continue;
        }
        $source_id = sanitize_text_field((string) $row['id']);
        $existing = get_posts([
            'post_type' => $map['post_type'],
            'post_status' => 'any',
            'posts_per_page' => 1,
            'fields' => 'ids',
            'meta_query' => [
                ['key' => '_uisb_source_table', 'value' => $table],
                ['key' => '_uisb_source_id', 'value' => $source_id],
            ],
        ]);
        $post_id = $existing ? (int) $existing[0] : 0;
        $title_key = $map['title'];
        $title = sanitize_text_field((string) ($row[$title_key] ?? ''));
        if ($title === '') {
            $title = ucfirst(rtrim($table, 's')) . ' ' . $source_id;
        }
        $content_key = $map['content'];
        $body = $content_key !== '' ? wp_kses_post((string) ($row[$content_key] ?? '')) : '';
        $status = array_key_exists('is_active', $row) && !filter_var($row['is_active'], FILTER_VALIDATE_BOOLEAN) ? 'draft' : 'publish';
        $post_data = [
            'ID' => $post_id,
            'post_type' => $map['post_type'],
            'post_status' => $status,
            'post_title' => $title,
            'post_content' => $body,
            'menu_order' => (int) ($row['sort_order'] ?? 0),
        ];
        if (!empty($row['slug'])) {
            $post_data['post_name'] = sanitize_title((string) $row['slug']);
        }
        if ($table === 'news' && !empty($row['date'])) {
            $timestamp = strtotime((string) $row['date']);
            if ($timestamp !== false) {
                $post_data['post_date'] = wp_date('Y-m-d H:i:s', $timestamp);
            }
        }
        $saved_id = wp_insert_post(wp_slash($post_data), true);
        if (is_wp_error($saved_id)) {
            WP_CLI::warning("Could not import {$table} row {$source_id}: " . $saved_id->get_error_message());
            $skipped++;
            continue;
        }
        $post_id = (int) $saved_id;
        update_post_meta($post_id, '_uisb_source_table', $table);
        update_post_meta($post_id, '_uisb_source_id', $source_id);
        foreach ($map['meta'] as $meta_key => $column) {
            if (!array_key_exists($column, $row)) {
                continue;
            }
            $value = $row[$column];
            if (in_array($column, ['is_active'], true)) {
                $value = uisb_import_bool($value);
            } elseif (is_scalar($value) || $value === null) {
                $value = sanitize_text_field((string) $value);
            } else {
                continue;
            }
            update_post_meta($post_id, '_uisb_' . $meta_key, $value);
        }
        $image_url = isset($row[$map['image']]) ? (string) $row[$map['image']] : '';
        if ($image_url !== '') {
            uisb_import_image($image_url, $post_id);
        }
        if ($existing) {
            $updated++;
        } else {
            $created++;
        }
    }
    WP_CLI::log(sprintf('%s: processed %d row(s).', $table, count($rows)));
}

WP_CLI::success(sprintf('Import finished. Created: %d; updated: %d; skipped: %d.', $created, $updated, $skipped));
