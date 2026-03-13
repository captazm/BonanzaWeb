import { t } from '../i18n.js';
import { renderHero } from '../components/hero.js';
import { renderProductCard } from '../components/productCard.js';
import { getProducts } from '../data/store.js';

export async function renderHome() {
  const products = await getProducts();
  const featuredProducts = products.filter(p => p.featured);

  return `
    ${renderHero()}

    <section class="section" id="featured-section">
      <div class="container">
        <h2 class="section-title animate-on-scroll">${t('home_featured_title')}</h2>
        <p class="section-subtitle animate-on-scroll">${t('home_featured_subtitle')}</p>
        <div class="featured-grid">
          ${featuredProducts.map((p, i) => renderProductCard(p, i)).join('')}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2 class="section-title animate-on-scroll">${t('home_why_title')}</h2>
        <p class="section-subtitle animate-on-scroll">${t('home_why_subtitle')}</p>
        <div class="features-grid">
          <div class="feature-card animate-on-scroll stagger-1">
            <div class="feature-icon">🏆</div>
            <h3 class="feature-title">${t('home_feature_auth_title')}</h3>
            <p class="feature-description">${t('home_feature_auth_desc')}</p>
          </div>
          <div class="feature-card animate-on-scroll stagger-2">
            <div class="feature-icon">🔧</div>
            <h3 class="feature-title">${t('home_feature_support_title')}</h3>
            <p class="feature-description">${t('home_feature_support_desc')}</p>
          </div>
          <div class="feature-card animate-on-scroll stagger-3">
            <div class="feature-icon">🚚</div>
            <h3 class="feature-title">${t('home_feature_delivery_title')}</h3>
            <p class="feature-description">${t('home_feature_delivery_desc')}</p>
          </div>
          <div class="feature-card animate-on-scroll stagger-4">
            <div class="feature-icon">💎</div>
            <h3 class="feature-title">${t('home_feature_premium_title')}</h3>
            <p class="feature-description">${t('home_feature_premium_desc')}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section" style="background: var(--bg-secondary);">
      <div class="container">
        <div class="about-grid">
          <div class="about-image animate-on-scroll">
            <img src="/images/about-home.png" alt="Bonanza E-Reader Store" class="about-img">
          </div>
          <div class="about-content">
            <h2 class="section-title animate-on-scroll">${t('home_about_title')}</h2>
            <p class="animate-on-scroll">${t('home_about_p1')}</p>
            <p class="animate-on-scroll">${t('home_about_p2')}</p>
            <div class="about-highlights animate-on-scroll">
              <div class="highlight-item">${t('home_about_highlight_1')}</div>
              <div class="highlight-item">${t('home_about_highlight_2')}</div>
              <div class="highlight-item">${t('home_about_highlight_3')}</div>
              <div class="highlight-item">${t('home_about_highlight_4')}</div>
            </div>
            <div style="margin-top: var(--space-xl);" class="animate-on-scroll">
              <a href="#about" class="btn btn-secondary">${t('home_about_cta')}</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container" style="text-align: center;">
        <h2 class="section-title animate-on-scroll">${t('home_cta_title')}</h2>
        <p class="section-subtitle animate-on-scroll" style="margin-left: auto; margin-right: auto;">
          ${t('home_cta_subtitle')}
        </p>
        <div style="display: flex; gap: var(--space-md); justify-content: center; flex-wrap: wrap;" class="animate-on-scroll">
          <a href="#products" class="btn btn-primary">${t('home_cta_browse')}</a>
          <a href="#contact" class="btn btn-secondary">${t('home_cta_contact')}</a>
        </div>
      </div>
    </section>
  `;
}
