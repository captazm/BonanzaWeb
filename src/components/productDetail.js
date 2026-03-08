import { t } from '../i18n.js';
import { addToCart } from '../data/cart.js';

export function renderProductDetail(product) {
  const specs = product.specs;

  // Support both old `image` (single string) and new `images` (array) fields
  const allImages = product.images?.length
    ? product.images
    : (product.image ? [product.image] : []);

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

  const galleryHtml = allImages.length > 0 ? `
    <div class="product-gallery">
      <div class="gallery-main-wrap">
        <img src="${allImages[0]}" alt="${product.name}" class="gallery-main-img" id="gallery-main-img">
        ${allImages.length > 1 ? `
          <button class="gallery-nav gallery-prev" id="gallery-prev" aria-label="Previous">&#8249;</button>
          <button class="gallery-nav gallery-next" id="gallery-next" aria-label="Next">&#8250;</button>
        ` : ''}
      </div>
      ${allImages.length > 1 ? `
        <div class="gallery-thumbs" id="gallery-thumbs">
          ${allImages.map((img, i) => `
            <div class="gallery-thumb ${i === 0 ? 'active' : ''}" data-index="${i}">
              <img src="${img}" alt="${product.name} view ${i + 1}" loading="lazy">
            </div>
          `).join('')}
          ${product.video ? `
            <div class="gallery-thumb gallery-thumb-video" data-index="${allImages.length}">
              <div class="thumb-video-icon">▶</div>
            </div>
          ` : ''}
        </div>
      ` : ''}
      ${product.video ? `
        <div class="gallery-video-wrap" id="gallery-video-wrap" style="display:none;">
          <video src="${product.video}" controls poster="${allImages[0] || ''}" class="gallery-video"></video>
        </div>
      ` : ''}
    </div>
  ` : '';

  return `
    <div class="modal-overlay" id="product-modal">
      <div class="modal">
        <button class="modal-close" id="modal-close-btn" aria-label="Close">✕</button>
        
        <div class="modal-header">
          ${galleryHtml}
          <div class="modal-product-series">${product.series} ${t('product_series_suffix')}</div>
          <h2 class="modal-product-name">${product.name}</h2>
          <p class="modal-product-tagline">${product.tagline}</p>
          <p class="modal-product-description">${product.description}</p>
          ${product.colors?.length > 0 ? `
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
          <button class="btn btn-primary" id="modal-atc-btn">
            🛒 ${t('product_add_to_cart') || 'Add to Cart'}
          </button>
          <a href="#contact" class="btn btn-secondary" id="modal-enquire-btn">
            ${t('product_enquire')}
          </a>
          <button class="btn btn-secondary" id="modal-close-btn-2">${t('product_close')}</button>
        </div>
      </div>
    </div>
  `;
}

export function initProductDetail(product) {
  const modal = document.getElementById('product-modal');
  if (!modal) return;

  const closeBtn = document.getElementById('modal-close-btn');
  const closeBtn2 = document.getElementById('modal-close-btn-2');
  const enquireBtn = document.getElementById('modal-enquire-btn');
  const atcBtn = document.getElementById('modal-atc-btn');

  const close = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { modal.remove(); }, 300);
  };

  closeBtn?.addEventListener('click', close);
  closeBtn2?.addEventListener('click', close);
  enquireBtn?.addEventListener('click', () => { close(); });
  atcBtn?.addEventListener('click', () => {
    addToCart(product);
    close();
    // Prompt to open cart
    if (confirm(t('cart_added_confirm') || `${product.name} added to cart! View cart?`)) {
      window.dispatchEvent(new CustomEvent('toggle-cart'));
    }
  });
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  // --- Gallery Logic ---
  const mainImg = modal.querySelector('#gallery-main-img');
  const thumbs = modal.querySelectorAll('.gallery-thumb');
  const videoWrap = modal.querySelector('#gallery-video-wrap');
  const prevBtn = modal.querySelector('#gallery-prev');
  const nextBtn = modal.querySelector('#gallery-next');

  const imageUrls = Array.from(modal.querySelectorAll('.gallery-thumb:not(.gallery-thumb-video) img'))
    .map(img => img.src);
  let currentIndex = 0;

  function showSlide(index) {
    const isVideoThumb = index >= imageUrls.length;

    thumbs.forEach(t => t.classList.remove('active'));
    thumbs[index]?.classList.add('active');

    if (isVideoThumb) {
      mainImg?.style && (mainImg.style.display = 'none');
      if (videoWrap) videoWrap.style.display = 'block';
    } else {
      if (videoWrap) videoWrap.style.display = 'none';
      if (mainImg) {
        mainImg.style.display = '';
        mainImg.src = imageUrls[index];
      }
    }
    currentIndex = index;
  }

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => showSlide(i));
  });

  const totalSlides = thumbs.length;

  prevBtn?.addEventListener('click', () => {
    showSlide((currentIndex - 1 + totalSlides) % totalSlides);
  });

  nextBtn?.addEventListener('click', () => {
    showSlide((currentIndex + 1) % totalSlides);
  });

  // Keyboard arrow navigation
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') prevBtn?.click();
    if (e.key === 'ArrowRight') nextBtn?.click();
  });

  requestAnimationFrame(() => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
}
