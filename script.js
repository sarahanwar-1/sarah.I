'use strict';

// A quiet layer of binary numbers echoes the original portfolio background.
// The page remains completely readable if JavaScript is disabled.
const binaryBackground = document.getElementById('binary-background');
if (binaryBackground) {
  const lines = [
    { left: '1%', top: '20%', text: '01001101\n10110010\n00101101\n11010010' },
    { left: '91%', top: '13%', text: '10010110\n01101001\n10100110\n00111011' },
    { left: '6%', top: '75%', text: '01100111\n10101101\n01001011\n11010101' },
    { left: '86%', top: '67%', text: '01101010\n10011101\n00110101\n11001010' },
    { left: '46%', top: '92%', text: '11010101 01001111 10010100' }
  ];
  for (const line of lines) {
    const el = document.createElement('span');
    el.style.left = line.left;
    el.style.top = line.top;
    el.textContent = line.text;
    binaryBackground.appendChild(el);
  }
}

const menuButton = document.querySelector('.menu-toggle');
const siteNav = document.getElementById('site-nav');
if (menuButton && siteNav) {
  function closeMenu() {
    siteNav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
  }
  menuButton.addEventListener('click', () => {
    const opening = !siteNav.classList.contains('is-open');
    siteNav.classList.toggle('is-open', opening);
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.setAttribute('aria-label', opening ? 'Close menu' : 'Open menu');
  });
  siteNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', event => {
    if (!siteNav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
}

const copyButton = document.getElementById('copy-email');
const emailAddress = document.getElementById('email-address');
const copyStatus = document.getElementById('copy-status');
if (copyButton && emailAddress) {
  copyButton.addEventListener('click', async () => {
    const email = emailAddress.textContent.trim();
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        const hiddenInput = document.createElement('textarea');
        hiddenInput.value = email;
        hiddenInput.setAttribute('readonly', '');
        hiddenInput.style.position = 'fixed';
        hiddenInput.style.opacity = '0';
        document.body.appendChild(hiddenInput);
        hiddenInput.select();
        if (!document.execCommand('copy')) throw new Error('Copy unavailable');
        hiddenInput.remove();
      }
      copyButton.textContent = 'Copied ✓';
      copyStatus.textContent = 'Email copied to clipboard.';
      window.setTimeout(() => { copyButton.textContent = 'Copy ⧉'; copyStatus.textContent = ''; }, 2400);
    } catch {
      copyStatus.textContent = 'Please select and copy the email address above.';
    }
  });
}

const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
