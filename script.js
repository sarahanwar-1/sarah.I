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

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
