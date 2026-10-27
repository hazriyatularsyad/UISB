<?php
defined('ABSPATH') || exit;
?><!doctype html>
<html <?php language_attributes(); ?>>
<head><meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width, initial-scale=1"><?php wp_head(); ?></head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#main-content"><?php esc_html_e('Lewati ke konten', 'uisb'); ?></a>
<div class="uisb-top-accent" aria-hidden="true"><span></span><span></span><span></span></div>
<header class="site-header"><div class="container header-inner">
  <div class="site-branding"><?php if (has_custom_logo()) : the_custom_logo(); else : ?><a class="site-title" href="<?php echo esc_url(home_url('/')); ?>"><?php bloginfo('name'); ?></a><?php endif; ?></div>
  <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation"><span class="screen-reader-text"><?php esc_html_e('Buka navigasi', 'uisb'); ?></span><span></span><span></span><span></span></button>
  <nav id="primary-navigation" class="primary-navigation" aria-label="<?php esc_attr_e('Navigasi utama', 'uisb'); ?>">
    <?php wp_nav_menu(['theme_location' => 'primary', 'container' => false, 'fallback_cb' => 'uisb_primary_fallback']); ?>
    <a class="nav-cta" href="<?php echo esc_url(apply_filters('uisb_admission_url', 'https://pmb.uisb.ac.id/')); ?>"><?php esc_html_e('Pendaftaran', 'uisb'); ?></a>
  </nav>
</div></header>
