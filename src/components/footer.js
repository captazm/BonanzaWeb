import { t } from '../i18n.js';

export function renderFooter() {
  return `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="#home" class="logo">
              <img src="/logo.svg" alt="Bonanza" class="logo-img" />
              <div class="logo-text">
                <span class="logo-name">BONANZA</span>
                <span class="logo-sub">${t('logo_sub')}</span>
              </div>
            </a>
            <p>${t('footer_description')}</p>
            <div class="footer-authorized">
              ${t('footer_authorized')}
            </div>
          </div>
          
          <div>
            <div class="footer-title">${t('footer_products')}</div>
            <div class="footer-links">
              <a href="#products" class="footer-link" data-filter="Palma">Palma ${t('product_series_suffix')}</a>
              <a href="#products" class="footer-link" data-filter="Note">Note ${t('product_series_suffix')}</a>
              <a href="#products" class="footer-link" data-filter="Go">Go ${t('product_series_suffix')}</a>
              <a href="#products" class="footer-link" data-filter="Tab">Tab ${t('product_series_suffix')}</a>
              <a href="#products" class="footer-link" data-filter="Page">Page</a>
            </div>
          </div>
          
          <div>
            <div class="footer-title">${t('footer_quick_links')}</div>
            <div class="footer-links">
              <a href="#home" class="footer-link">${t('footer_home')}</a>
              <a href="#products" class="footer-link">${t('footer_all_products')}</a>
              <a href="#about" class="footer-link">${t('footer_about')}</a>
              <a href="#contact" class="footer-link">${t('footer_contact')}</a>
            </div>
          </div>
          
          <div>
            <div class="footer-title">${t('footer_support')}</div>
            <div class="footer-links">
              <a href="https://help.boox.com" target="_blank" rel="noopener" class="footer-link">${t('footer_help_center')}</a>
              <a href="https://shop.boox.com/pages/firmware" target="_blank" rel="noopener" class="footer-link">${t('footer_firmware')}</a>
              <a href="#contact" class="footer-link">${t('footer_warranty')}</a>
              <a href="#contact" class="footer-link">${t('footer_get_in_touch')}</a>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} ${t('footer_copyright')}</p>
          <div class="footer-socials">
            <a href="https://www.facebook.com/BonanzaEreaderStore" target="_blank" rel="noopener" class="social-link" aria-label="Facebook" title="Facebook">f</a>
            <a href="#" class="social-link" aria-label="Viber" title="Viber">V</a>
            <a href="#" class="social-link" aria-label="Telegram" title="Telegram">T</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}
