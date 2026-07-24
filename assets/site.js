document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.getElementById('progressBar');
  const nav = document.getElementById('nav');
  let scrollTicking = false;

  const updateProgress = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = maxScroll > 0
      ? `${Math.min(100, (window.scrollY / maxScroll) * 100)}%`
      : '0%';
    scrollTicking = false;
  };

  window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(updateProgress);
  }, { passive: true });

  const reveal = (element, from, duration = 760, delay = 0) => {
    if (!element) return;

    if (reduceMotion) {
      element.style.opacity = '1';
      element.style.transform = 'none';
      return;
    }

    const animation = element.animate(
      [
        { opacity: 0, transform: from },
        { opacity: 1, transform: 'none' }
      ],
      {
        duration,
        delay,
        easing: 'cubic-bezier(.22,.8,.24,1)',
        fill: 'forwards'
      }
    );

    animation.addEventListener('finish', () => {
      element.style.opacity = '1';
      element.style.transform = 'none';
      animation.cancel();
    }, { once: true });
  };

  nav.style.opacity = '1';
  updateProgress();

  reveal(document.querySelector('.hero__eyebrow'), 'translateY(18px)', 560, 80);
  reveal(document.querySelector('.hero__title'), 'translateY(26px)', 820, 150);
  reveal(document.querySelector('.hero__subtitle'), 'translateY(16px)', 620, 280);
  reveal(document.querySelector('.hero__scroll'), 'translateY(10px)', 480, 420);

  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale'
  );

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(element => reveal(element, 'none', 0));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      let from = 'translateY(32px)';

      if (element.classList.contains('reveal-left')) from = 'translateX(-30px)';
      if (element.classList.contains('reveal-right')) from = 'translateX(30px)';
      if (element.classList.contains('reveal-scale')) from = 'scale(.975)';

      reveal(element, from);
      currentObserver.unobserve(element);
    });
  }, {
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.03
  });

  revealElements.forEach(element => observer.observe(element));
});
