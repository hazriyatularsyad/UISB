<?php defined('ABSPATH') || exit; get_header(); ?>
<main id="main-content" class="page-main"><section class="not-found container"><p class="eyebrow">404</p><h1><?php esc_html_e('Halaman tidak ditemukan','uisb'); ?></h1><p><?php esc_html_e('Halaman yang kamu cari mungkin sudah dipindahkan atau alamatnya salah.','uisb'); ?></p><a class="button button-primary" href="<?php echo esc_url(home_url('/')); ?>"><?php esc_html_e('Kembali ke beranda','uisb'); ?></a></section></main>
<?php get_footer(); ?>
