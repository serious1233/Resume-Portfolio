const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#site-nav');

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
}));

document.querySelector('#year').textContent = new Date().getFullYear();

// Start each page load at the document top, overriding browser/Live Server scroll restoration.
window.addEventListener('pageshow', (event) => {
  if (event.persisted) return;

  history.scrollRestoration = 'manual';
  if (window.location.hash) {
    history.replaceState(
      history.state,
      '',
      `${window.location.pathname}${window.location.search}`
    );
  }

  const resetScroll = () => window.scrollTo(0, 0);
  document.documentElement.style.scrollBehavior = 'auto';
  resetScroll();
  requestAnimationFrame(resetScroll);

  window.setTimeout(() => {
    resetScroll();
    document.documentElement.style.removeProperty('scroll-behavior');
    history.scrollRestoration = 'auto';
  }, 120);
}, { once: true });

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('has-scroll-reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');

        // On phones, keep a section visible after its first reveal. Removing
        // the class while scrolling can leave the viewport blank between tall sections.
        if (window.matchMedia('(max-width: 760px)').matches) {
          revealObserver.unobserve(entry.target);
        }
      } else if (!window.matchMedia('(max-width: 760px)').matches) {
        entry.target.classList.remove('is-visible');
      }
    });
  }, { threshold: 0.01, rootMargin: '140px 0px 140px 0px' });

  document.querySelectorAll('.section, .contact').forEach((section) => {
    revealObserver.observe(section);
  });
}
