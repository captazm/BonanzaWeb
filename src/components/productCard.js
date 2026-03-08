import { t } from '../i18n.js';

export function renderProductCard(product, index = 0) {
  const badgeClass = product.badge ? `badge-${product.badge.toLowerCase()}` : '';
  const staggerClass = `stagger-${(index % 6) + 1}`;

  const quickSpecs = [];
  if (product.specs.screen) {
    const screenSize = product.specs.screen.match(/[\d.]+"/) || [''];
    quickSpecs.push(screenSize[0]);
  }
  if (product.specs.ram) quickSpecs.push(product.specs.ram + ' RAM');
  if (product.specs.storage) quickSpecs.push(product.specs.storage);
  if (product.specs.os) quickSpecs.push(product.specs.os);

  return `
    <div class="product-card animate-on-scroll ${staggerClass}" data-product-id="${product.id}">
      <div class="product-card-header">
        <div class="product-card-series">${product.series} ${t('product_series_suffix')}</div>
        ${product.badge ? `<span class="badge ${badgeClass}">${product.badge}</span>` : ''}
      </div>
      <div class="product-card-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-card-name">${product.name}</div>
      <div class="product-card-tagline">${product.tagline}</div>
      <div class="product-card-specs">
        ${quickSpecs.map(s => `<span class="spec-chip">${s}</span>`).join('')}
      </div>
      <div class="product-card-footer">
        <span class="product-card-price">${product.price}</span>
        <span class="product-card-action">
          ${t('product_view_details')}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </span>
      </div>
    </div>
  `;
}
