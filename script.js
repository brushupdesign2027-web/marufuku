'use strict';

// 公開時にLINE公式アカウントのURLを設定してください（例: https://lin.ee/...）。
const SITE_CONFIG = Object.freeze({ lineUrl: '' });

const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
const mobileHeader = document.querySelector('.header-mobile');
const mobileViewport = window.matchMedia('(max-width: 767px)');
const notice = document.querySelector('.site-notice');
let noticeTimer;

function setMenuOpen(open, restoreFocus = false) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  mobileMenu.classList.toggle('is-open', open);
  mobileMenu.inert = !open;
  if (restoreFocus) menuButton.focus();
}

menuButton.addEventListener('click', () => {
  setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
});
mobileMenu.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenuOpen(false, true);
});
document.addEventListener('click', (event) => {
  if (!mobileHeader.contains(event.target)) setMenuOpen(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false, true);
  }
});
document.addEventListener('focusin', (event) => {
  if (!mobileHeader.contains(event.target)) setMenuOpen(false);
});
mobileViewport.addEventListener('change', () => setMenuOpen(false));

function showLineNotice() {
  notice.textContent = 'LINEのお問い合わせ先は準備中です。';
  notice.classList.add('is-visible');
  window.clearTimeout(noticeTimer);
  noticeTimer = window.setTimeout(() => notice.classList.remove('is-visible'), 5000);
}

document.querySelectorAll('[data-line-link]').forEach((link) => {
  if (SITE_CONFIG.lineUrl) {
    link.href = SITE_CONFIG.lineUrl;
    link.removeAttribute('aria-disabled');
    link.removeAttribute('role');
    link.removeAttribute('tabindex');
  } else {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      showLineNotice();
    });
    link.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        link.click();
      }
    });
  }
});
