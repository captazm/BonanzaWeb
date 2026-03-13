import { t } from '../i18n.js';

export function renderAbout() {
  return `
    <div class="page-header">
      <div class="container">
        <h1 class="section-title">${t('about_title')}</h1>
        <p class="section-subtitle">${t('about_subtitle')}</p>
      </div>
    </div>

    <section class="section" style="padding-top: 0;">
      <div class="container">
        <div class="about-grid">
          <div class="about-image animate-on-scroll">
            <img src="/images/store-photo.png" alt="Bonanza Store" class="about-img">
          </div>
          <div class="about-content">
            <h2 class="animate-on-scroll" style="font-size: 1.8rem; font-weight: 700; margin-bottom: var(--space-lg);">${t('about_story_title')}</h2>
            <p class="animate-on-scroll">${t('about_story_p1')}</p>
            <p class="animate-on-scroll">${t('about_story_p2')}</p>
            <p class="animate-on-scroll">${t('about_story_p3')}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section" style="background: var(--bg-secondary);">
      <div class="container">
        <h2 class="section-title animate-on-scroll" style="text-align: center;">${t('about_values_title')}</h2>
        <p class="section-subtitle animate-on-scroll" style="text-align: center; margin-left: auto; margin-right: auto;">${t('about_values_subtitle')}</p>
        <div class="features-grid">
          <div class="feature-card animate-on-scroll stagger-1">
            <div class="feature-icon">🎯</div>
            <h3 class="feature-title">${t('about_value_auth_title')}</h3>
            <p class="feature-description">${t('about_value_auth_desc')}</p>
          </div>
          <div class="feature-card animate-on-scroll stagger-2">
            <div class="feature-icon">🤝</div>
            <h3 class="feature-title">${t('about_value_trust_title')}</h3>
            <p class="feature-description">${t('about_value_trust_desc')}</p>
          </div>
          <div class="feature-card animate-on-scroll stagger-3">
            <div class="feature-icon">💡</div>
            <h3 class="feature-title">${t('about_value_innovation_title')}</h3>
            <p class="feature-description">${t('about_value_innovation_desc')}</p>
          </div>
          <div class="feature-card animate-on-scroll stagger-4">
            <div class="feature-icon">🌏</div>
            <h3 class="feature-title">${t('about_value_community_title')}</h3>
            <p class="feature-description">${t('about_value_community_desc')}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2 class="section-title animate-on-scroll" style="text-align: center;">${t('about_milestones_title')}</h2>
        <p class="section-subtitle animate-on-scroll" style="text-align: center; margin-left: auto; margin-right: auto;">${t('about_milestones_subtitle')}</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-xl); margin-top: var(--space-2xl);">
          <div class="feature-card animate-on-scroll stagger-1" style="text-align: center;">
            <div style="font-size: 2.5rem; font-weight: 800; font-family: var(--font-heading); color: var(--accent-primary); margin-bottom: var(--space-sm);">2019</div>
            <p class="feature-description">${t('about_milestone_1')}</p>
          </div>
          <div class="feature-card animate-on-scroll stagger-2" style="text-align: center;">
            <div style="font-size: 2.5rem; font-weight: 800; font-family: var(--font-heading); color: var(--accent-primary); margin-bottom: var(--space-sm);">1000+</div>
            <p class="feature-description">${t('about_milestone_2')}</p>
          </div>
          <div class="feature-card animate-on-scroll stagger-3" style="text-align: center;">
            <div style="font-size: 2.5rem; font-weight: 800; font-family: var(--font-heading); color: var(--accent-primary); margin-bottom: var(--space-sm);">8+</div>
            <p class="feature-description">${t('about_milestone_3')}</p>
          </div>
          <div class="feature-card animate-on-scroll stagger-4" style="text-align: center;">
            <div style="font-size: 2.5rem; font-weight: 800; font-family: var(--font-heading); color: var(--accent-primary); margin-bottom: var(--space-sm);">6+</div>
            <p class="feature-description">${t('about_milestone_4')}</p>
          </div>
        </div>
      </div>
    </section>
  `;
}
