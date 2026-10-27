<?php defined('ABSPATH') || exit; ?>
<footer class="site-footer"><div class="container footer-grid">
  <div class="footer-brand"><a class="footer-title" href="<?php echo esc_url(home_url('/')); ?>"><?php bloginfo('name'); ?></a><p><?php esc_html_e('Towards The Global Digital Business University', 'uisb'); ?></p></div>
  <div><h2><?php esc_html_e('Jelajahi', 'uisb'); ?></h2><?php wp_nav_menu(['theme_location' => 'footer', 'container' => false, 'fallback_cb' => 'uisb_footer_fallback']); ?></div>
  <div><h2><?php esc_html_e('Kontak', 'uisb'); ?></h2><p><?php esc_html_e('Universitas Islam Sumatera Barat', 'uisb'); ?></p><a href="https://pmb.uisb.ac.id/"><?php esc_html_e('Informasi Pendaftaran', 'uisb'); ?></a></div>
</div><div class="footer-bottom"><div class="container"><span>© <?php echo esc_html(wp_date('Y')); ?> <?php bloginfo('name'); ?></span><a href="<?php echo esc_url(wp_login_url()); ?>"><?php esc_html_e('Admin', 'uisb'); ?></a></div></div></footer>
<?php wp_footer(); ?>
</body></html>
