import { t } from '../i18n.js';
import { renderProductCard } from '../components/productCard.js';
import { getProducts, seriesInfo } from '../data/store.js';

export async function renderProducts() {
  const products = await getProducts();
  const series = ['All', ...Object.keys(seriesInfo)];

  return `
    <div class="page-header">
      <div class="container">
        <h1 class="section-title">${t('products_title')}</h1>
        <p class="section-subtitle">${t('products_subtitle')}</p>
      </div>
    </div>

    <section class="section" style="padding-top: 0;">
      <div class="container">
        <div class="filter-bar" id="filter-bar">
          ${series.map(s => `
            <button class="filter-btn ${s === 'All' ? 'active' : ''}" data-filter="${s}">
              ${s === 'All' ? t('products_filter_all') : `${seriesInfo[s]?.icon || ''} ${s}`}
            </button>
          `).join('')}
        </div>
        <div class="products-grid" id="products-grid">
          ${products.map((p, i) => renderProductCard(p, i)).join('')}
        </div>
      </div>
    </section>
  `;
}

export function initProductsPage() {
  const filterBar = document.getElementById('filter-bar');
  const grid = document.getElementById('products-grid');
  if (!filterBar || !grid) return;

  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    const filter = btn.dataset.filter;

    // Update active button
    filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    getProducts().then(products => {
      // Filter products
      const filtered = filter === 'All'
        ? products
        : products.filter(p => p.series === filter);

      grid.innerHTML = filtered.map((p, i) => renderProductCard(p, i)).join('');

      // Re-observe for scroll animations
      grid.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.classList.remove('visible');
        if (window._scrollObserver) {
          window._scrollObserver.observe(el);
        }
      });

      // Trigger immediate visibility check
      setTimeout(() => {
        grid.querySelectorAll('.animate-on-scroll').forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight) {
            el.classList.add('visible');
          }
        });
      }, 50);
    });
  });
}
