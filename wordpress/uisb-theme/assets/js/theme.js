(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-navigation');
  if (toggle && nav) toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('is-open', !expanded);
  });
  document.querySelectorAll('[data-hero-slides]').forEach((root) => {
    const slides = Array.from(root.querySelectorAll('[data-hero-slide]'));
    if (slides.length < 2) return;
    let current = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
    const show = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        const active = i === current;
        slide.classList.toggle('is-active', active);
        slide.hidden = !active;
      });
    };
    const container = root.closest('.hero-section');
    container?.querySelector('[data-hero-prev]')?.addEventListener('click', () => show(current - 1));
    container?.querySelector('[data-hero-next]')?.addEventListener('click', () => show(current + 1));
  });
  const targets = document.querySelectorAll('.content-card, .section-heading, .achievement-item');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    targets.forEach((target) => { target.classList.add('reveal-on-scroll'); observer.observe(target); });
  }
})();
