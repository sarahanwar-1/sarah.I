// No framework or third-party scripts needed.
const menuButton = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');

if (menuButton && mainNav) {
  const closeMenu = () => {
    mainNav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  };

  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    mainNav.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', e => {
    if (!mainNav.contains(e.target) && !menuButton.contains(e.target)) closeMenu();
  });
}

const copyButton = document.querySelector('[data-copy-email]');
const copyStatus = document.querySelector('#copy-status');
let statusTimer;
if (copyButton && copyStatus) {
  copyButton.addEventListener('click', async () => {
    const email = 'sarahanwarismael@gmail.com';
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        const input = document.createElement('textarea');
        input.value = email;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.append(input);
        input.select();
        if (!document.execCommand('copy')) throw new Error('Copy unavailable');
        input.remove();
      }
      copyStatus.textContent = 'Email address copied';
    } catch {
      copyStatus.textContent = 'Please select and copy the email address above';
    }
    copyStatus.classList.add('visible');
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => copyStatus.classList.remove('visible'), 2600);
  });
}

// Highlight the nav link of the section currently on screen
const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]:not(.nav-contact)')];
if ('IntersectionObserver' in window && navLinks.length) {
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const link = navLinks.find(a => a.getAttribute('href') === '#' + entry.target.id);
      if (!link) return;
      link.classList.toggle('is-active', entry.isIntersecting);
      if (entry.isIntersecting) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach(a => {
    const section = document.querySelector(a.getAttribute('href'));
    if (section) spy.observe(section);
  });
}

// Gentle fade-in for blocks below the first screen.
// (The hero animates with CSS only, so nothing flashes on load.)
const revealTargets = document.querySelectorAll(
  '.section-heading, .service-card, .project-card, .about-title-col, .about-copy, .contact-intro, .contact-card, .faq-grid > div:first-child, .faq-list details, .booking-intro, .booking-calendar-card'
);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.remove('reveal');
      el.classList.add('revealed');
      io.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealTargets.forEach(el => {
    const position = Array.prototype.indexOf.call(el.parentElement.children, el);
    el.style.setProperty('--d', Math.min(position, 3) * 0.08 + 's');
    el.classList.add('reveal');
    io.observe(el);
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
