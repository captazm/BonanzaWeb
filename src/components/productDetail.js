import { t } from '../i18n.js';

export function renderProductDetail(product) {
  const specs = product.specs;

  const specEntries = Object.entries(specs).map(([key, value]) => {
    const labels = {
      screen: t('spec_display'),
      resolution: t('spec_resolution'),
      cpu: t('spec_processor'),
      ram: t('spec_ram'),
      storage: t('spec_storage'),
      os: t('spec_os'),
      connectivity: t('spec_connectivity'),
      battery: t('spec_battery'),
      weight: t('spec_weight'),
      dimensions: t('spec_dimensions'),
      camera: t('spec_camera'),
      stylus: t('spec_stylus'),
      extras: t('spec_extras')
    };
    return { label: labels[key] || key, value };
  });

  return `
    <div class="modal-overlay" id="product-modal">
      <div class="modal">
        <button class="modal-close" id="modal-close-btn" aria-label="Close">✕</button>
        
        <div class="modal-header">
          <div class="modal-product-media">
            <img src="${product.image}" alt="${product.name}" class="modal-main-image">
            ${product.video ? `
              <div class="modal-video-container">
                <video src="${product.video}" controls poster="${product.image}" class="product-video"></video>
              </div>
            ` : ''}
          </div>
          <div class="modal-product-series">${product.series} ${t('product_series_suffix')}</div>
          <h2 class="modal-product-name">${product.name}</h2>
          <p class="modal-product-tagline">${product.tagline}</p>
          <p class="modal-product-description">${product.description}</p>
          ${product.colors.length > 0 ? `
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
              ${product.colors.map(c => `<span class="spec-chip">${c}</span>`).join('')}
            </div>
          ` : ''}
        </div>
        
        <div class="modal-body">
          <div class="specs-title">${t('product_specs_title')}</div>
          <div class="specs-grid">
            ${specEntries.map(({ label, value }) => `
              <div class="spec-item">
                <div class="spec-label">${label}</div>
                <div class="spec-value">${value}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="modal-footer">
          <a href="#contact" class="btn btn-primary" id="modal-enquire-btn">
            ${t('product_enquire')}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <button class="btn btn-secondary" id="modal-close-btn-2">${t('product_close')}</button>
        </div>
      </div>
    </div>
  `;
}

export function initProductDetail() {
  const modal = document.getElementById('product-modal');
  if (!modal) return;

  const closeBtn = document.getElementById('modal-close-btn');
  const closeBtn2 = document.getElementById('modal-close-btn-2');
  const enquireBtn = document.getElementById('modal-enquire-btn');

  const close = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      modal.remove();
    }, 300);
  };

  closeBtn?.addEventListener('click', close);
  closeBtn2?.addEventListener('click', close);

  enquireBtn?.addEventListener('click', () => {
    close();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  // Activate after a frame for animation
  requestAnimationFrame(() => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
}
