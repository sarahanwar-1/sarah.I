// No framework or third-party scripts needed.

// Light / dark theme. The small script in <head> has already set data-theme before the page painted;
// this part runs the switch in the header and remembers the visitor's choice.
const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const themeButton = document.querySelector('.theme-toggle');
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const THEME_COLORS = { light: '#f8edf2', dark: '#070a1a' };

const showTheme = theme => {
  root.setAttribute('data-theme', theme);
  if (themeColorMeta) themeColorMeta.setAttribute('content', THEME_COLORS[theme]);
  if (themeButton) {
    const next = theme === 'dark' ? 'light' : 'dark';
    themeButton.setAttribute('aria-label', 'Switch to ' + next + ' mode');
    themeButton.setAttribute('title', 'Switch to ' + next + ' mode');
  }
};
// If the <head> script is missing (for example the page was embedded), read the saved choice here, else use light.
let savedTheme = null;
try { savedTheme = localStorage.getItem('theme'); } catch (e) {}
showTheme(root.getAttribute('data-theme') || (savedTheme === 'dark' ? 'dark' : 'light'));

if (themeButton) {
  themeButton.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', next); } catch (e) { /* private mode: the choice just isn't remembered */ }

    if (document.startViewTransition && !reducedMotion) {
      // the new theme spreads out from the button like a ripple
      const box = themeButton.getBoundingClientRect();
      const x = box.left + box.width / 2;
      const y = box.top + box.height / 2;
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      const transition = document.startViewTransition(() => showTheme(next));
      transition.ready.then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 700, easing: 'cubic-bezier(.22, .8, .3, 1)', pseudoElement: '::view-transition-new(root)' }
        );
      }).catch(() => {});
    } else {
      // no View Transitions: let the colours fade instead
      root.classList.add('theme-fade');
      showTheme(next);
      setTimeout(() => root.classList.remove('theme-fade'), 450);
    }
  });
}

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
// (the top nav and the slim section index on the right both follow the page)
const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]:not(.nav-contact), .section-rail a[href^="#"]')];
if ('IntersectionObserver' in window && navLinks.length) {
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      navLinks.filter(a => a.getAttribute('href') === '#' + entry.target.id).forEach(link => {
        link.classList.toggle('is-active', entry.isIntersecting);
        if (entry.isIntersecting) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  new Set(navLinks.map(a => a.getAttribute('href'))).forEach(id => {
    const section = document.querySelector(id);
    if (section) spy.observe(section);
  });
}

// Gentle fade-in for blocks below the first screen.
// (The hero animates with CSS only, so nothing flashes on load.)
// (headings are handled separately below: they rise word by word)
const revealTargets = document.querySelectorAll(
  '.section-lead, .service-card, .project-card, .about-monogram, .about-copy, .contact-intro > :not(h2):not(.eyebrow), .faq-aside, .faq-list details, .booking-intro > :not(h2):not(.eyebrow), .booking-calendar-card'
);
const reduceMotion = reducedMotion;
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

// Section headings rise word by word when they scroll into view.
// The words are wrapped here; the heading keeps its full text for screen readers.
if ('IntersectionObserver' in window && !reduceMotion) {
  let wordIndex;
  const splitWords = node => {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(' '); return; }
          const outer = document.createElement('span');
          outer.className = 'sw';
          outer.setAttribute('aria-hidden', 'true');
          const inner = document.createElement('span');
          inner.className = 'sw-i';
          inner.style.setProperty('--i', wordIndex++);
          inner.textContent = part;
          outer.append(inner);
          frag.append(outer);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1) {
        splitWords(child);
      }
    });
  };
  const headingIO = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      headingIO.unobserve(entry.target);
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('.section h2').forEach(h => {
    wordIndex = 0;
    h.setAttribute('aria-label', h.textContent.replace(/\s+/g, ' ').trim());
    splitWords(h);
    h.classList.add('split-ready');
    headingIO.observe(h);
  });
}

// Desktop extras (mouse only): a cursor ring that trails the pointer, and buttons that lean toward it.
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if (finePointer && !reduceMotion) {
  const ring = document.createElement('div');
  ring.className = 'cursor';
  ring.setAttribute('aria-hidden', 'true');
  ring.innerHTML = '<span>View</span>';
  document.body.append(ring);
  document.documentElement.classList.add('has-cursor');

  let tx = -100, ty = -100, x = -100, y = -100, running = false;
  const tick = () => {
    x += (tx - x) * 0.2;
    y += (ty - y) * 0.2;
    ring.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    if (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1) requestAnimationFrame(tick);
    else running = false;
  };
  document.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    tx = e.clientX; ty = e.clientY;
    ring.classList.add('is-visible');
    if (!running) { running = true; requestAnimationFrame(tick); }
    const target = e.target.closest ? e.target : null;
    const view = target && target.closest('.project-media');
    const link = target && target.closest('a, button, summary');
    ring.classList.toggle('is-view', !!view);
    ring.classList.toggle('is-link', !!link && !view);
  });
  document.addEventListener('pointerleave', () => ring.classList.remove('is-visible'));
  document.documentElement.addEventListener('mouseleave', () => ring.classList.remove('is-visible'));

  document.querySelectorAll('.button, .nav-contact, .copy-email').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      el.style.translate = `${dx * 12}px ${dy * 10}px`;
    });
    el.addEventListener('pointerleave', () => { el.style.translate = ''; });
  });
}

// Groups that arrive one item after another: the tool chips, and the rows of the contact card.
if ('IntersectionObserver' in window && !reduceMotion) {
  const groupIO = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      groupIO.unobserve(entry.target);
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('.skill-chips, .contact-card').forEach(group => {
    [...group.children].forEach((child, i) => child.style.setProperty('--i', i));
    group.classList.add('stagger-ready');
    groupIO.observe(group);
  });
}

// The big number in the hero counts up once, after the page has settled.
const statNumber = document.querySelector('.hero-stat strong');
if (statNumber && !reduceMotion && statNumber.firstChild && statNumber.firstChild.nodeType === 3) {
  const textNode = statNumber.firstChild;
  const end = parseInt(textNode.textContent, 10);
  if (end > 0) {
    textNode.textContent = '0';
    const t0 = performance.now() + 900;
    const count = now => {
      const p = Math.min(Math.max((now - t0) / 1300, 0), 1);
      textNode.textContent = String(Math.round(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(count);
    };
    requestAnimationFrame(count);
  }
}

// The marquee in the hero speeds up while you scroll and settles back when you stop.
const marqueeTrack = document.querySelector('.marquee-track');
const marqueeAnim = marqueeTrack && marqueeTrack.getAnimations ? marqueeTrack.getAnimations()[0] : null;
if (marqueeAnim && !reduceMotion) {
  let lastY = window.scrollY, push = 0, rate = 1, spinning = false;
  const settle = () => {
    push *= 0.92;   // each scroll gives a push that fades on its own
    rate += ((1 + Math.min(push, 60) / 15) - rate) * 0.12;   // never faster than about 5x
    if (push < 0.5 && rate < 1.02) {
      marqueeAnim.playbackRate = 1;
      spinning = false;
      return;
    }
    marqueeAnim.playbackRate = rate;
    requestAnimationFrame(settle);
  };
  window.addEventListener('scroll', () => {
    push = Math.max(push, Math.abs(window.scrollY - lastY));
    lastY = window.scrollY;
    if (!spinning) { spinning = true; requestAnimationFrame(settle); }
  }, { passive: true });
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
