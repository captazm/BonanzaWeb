import { t, getLang, setLang } from '../i18n.js';
import { getTheme, setTheme } from '../theme.js';
import { getCartCount } from '../data/cart.js';

export function renderHeader(currentPage) {
  const lang = getLang();
  const theme = getTheme();

  return `
    <header class="header" id="main-header">
      <div class="header-inner">
        <a href="#home" class="logo">
          <img src="/logo.png" alt="Bonanza E-Reader Store" class="logo-img" />
        </a>
        <nav class="nav" id="main-nav">
          <a href="#home" class="nav-link ${currentPage === 'home' ? 'active' : ''}" data-nav="home">${t('nav_home')}</a>
          <a href="#products" class="nav-link ${currentPage === 'products' ? 'active' : ''}" data-nav="products">${t('nav_products')}</a>
          <a href="#about" class="nav-link ${currentPage === 'about' ? 'active' : ''}" data-nav="about">${t('nav_about')}</a>
          <a href="#blog" class="nav-link ${currentPage === 'blog' ? 'active' : ''}" data-nav="blog">${t('nav_blog')}</a>
          <a href="#contact" class="nav-link ${currentPage === 'contact' ? 'active' : ''}" data-nav="contact">${t('nav_contact')}</a>
        </nav>
        
        <div class="header-actions">
          <div class="lang-toggle" id="lang-toggle" title="Switch Language">
            <span class="lang-label ${lang === 'en' ? 'active' : ''}" data-lang="en">EN</span>
            <span class="lang-label ${lang === 'my' ? 'active' : ''}" data-lang="my">မြန်မာ</span>
            <span class="lang-slider"></span>
          </div>

          <button class="cart-toggle" id="cart-toggle" title="View Cart">
            <span class="cart-icon">🛒</span>
            <span id="cart-badge" class="cart-badge" style="${getCartCount() > 0 ? '' : 'display:none'}">${getCartCount()}</span>
          </button>

          <button class="theme-toggle" id="theme-toggle" title="${theme === 'dark' ? t('theme_light') : t('theme_dark')}">
            <span class="sun-icon">☀️</span>
            <span class="moon-icon">🌙</span>
          </button>
        </div>

        <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  `;
}

export function initHeader(onLangChange) {
  const header = document.getElementById('main-header');
  const menuBtn = document.getElementById('mobile-menu-btn');
  const nav = document.getElementById('main-nav');
  const langToggle = document.getElementById('lang-toggle');
  const themeToggle = document.getElementById('theme-toggle');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });
  }

  // Close mobile menu on link click
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Language toggle
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const current = getLang();
      const next = current === 'en' ? 'my' : 'en';
      setLang(next);
      if (onLangChange) onLangChange();
    });
  }

  // Theme toggle
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = getTheme();
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
      themeToggle.title = next === 'dark' ? t('theme_light') : t('theme_dark');
    });
  }

  // Cart update listener
  window.addEventListener('cart-updated', (e) => {
    const badge = document.getElementById('cart-badge');
    if (badge) {
      badge.textContent = e.detail.count;
      badge.style.display = e.detail.count > 0 ? 'flex' : 'none';
    }
  });

  // Cart toggle
  document.getElementById('cart-toggle')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('toggle-cart'));
  });
}
