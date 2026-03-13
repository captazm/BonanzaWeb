import { t } from '../i18n.js';

export function renderHero() {
  return `
    <section class="hero" id="hero">
      <div class="hero-content">
        <div class="hero-text">
          <div class="hero-badge">${t('hero_badge')}</div>
          <h1>
            ${t('hero_title_1')}<br />
            <span class="highlight">${t('hero_title_2')}</span>
          </h1>
          <p class="hero-description">
            ${t('hero_description')}
          </p>
          <div class="hero-cta">
            <a href="#products" class="btn btn-primary">
              ${t('hero_cta_explore')}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="#about" class="btn btn-secondary">${t('hero_cta_story')}</a>
          </div>
          <div class="hero-stats">
            <div class="stat">
              <div class="stat-value">6+</div>
              <div class="stat-label">${t('hero_stat_years')}</div>
            </div>
            <div class="stat">
              <div class="stat-value">8+</div>
              <div class="stat-label">${t('hero_stat_models')}</div>
            </div>
            <div class="stat">
              <div class="stat-value">1000+</div>
              <div class="stat-label">${t('hero_stat_customers')}</div>
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-orbit"></div>
          <div class="hero-device">
            <img src="/images/hero-device.png" alt="BOOX Device" class="hero-device-img">
          </div>
        </div>
      </div>
    </section>
  `;
}
