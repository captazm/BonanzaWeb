import { getProducts, saveProduct } from '../data/store.js';
import { seriesInfo } from '../data/products.js';
import { storage } from '../firebase.js';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

async function getEditProduct() {
  const hash = window.location.hash;
  const match = hash.match(/id=([^&]+)/);
  if (!match) return null;
  const products = await getProducts();
  return products.find((p) => p.id === match[1]) || null;
}

// -------------------------------------------------------
// State: uploaded image URLs
// -------------------------------------------------------
const uploadedImages = [];

function getSafeName() {
  return (document.getElementById('p-name')?.value || 'product')
    .toLowerCase().replace(/[^a-z0-9]/g, '_');
}

// -------------------------------------------------------
// Single file upload helper → Promise<url>
// -------------------------------------------------------
function uploadToStorage(file, path) {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file);
    task.on('state_changed', null,
      (err) => reject(err),
      async () => resolve(await getDownloadURL(task.snapshot.ref))
    );
  });
}

/**
 * Optimizes an image file by resizing and compressing it.
 * @param {File} file 
 * @returns {Promise<Blob>}
 */
async function optimizeImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      let width = img.width;
      let height = img.height;
      const MAX_DIM = 1200;

      // Maintain aspect ratio while resizing
      if (width > height) {
        if (width > MAX_DIM) {
          height *= MAX_DIM / width;
          width = MAX_DIM;
        }
      } else {
        if (height > MAX_DIM) {
          width *= MAX_DIM / height;
          height = MAX_DIM;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // Try WebP first, then JPEG
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(img.src);
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob failed'));
      }, 'image/webp', 0.8);
    };
    img.onerror = () => reject(new Error('Image load failed'));
  });
}

// -------------------------------------------------------
// Render the image grid inside the upload zone
// -------------------------------------------------------
function renderImageGrid() {
  const grid = document.getElementById('images-grid');
  if (!grid) return;

  grid.innerHTML = uploadedImages.map((url, i) => `
    <div class="img-thumb-item" data-index="${i}" draggable="true">
      <img src="${url}" alt="Image ${i + 1}">
      <button type="button" class="img-thumb-remove" data-index="${i}" title="Remove">✕</button>
      ${i === 0 ? '<span class="img-thumb-cover">Cover</span>' : `<button type="button" class="img-thumb-make-cover" data-index="${i}" title="Make Cover">Set Cover</button>`}
    </div>
  `).join('');

  // Remove handlers
  grid.querySelectorAll('.img-thumb-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.index);
      uploadedImages.splice(idx, 1);
      renderImageGrid();
    });
  });

  // Make cover handlers
  grid.querySelectorAll('.img-thumb-make-cover').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.index);
      const [item] = uploadedImages.splice(idx, 1);
      uploadedImages.unshift(item); // move to front
      renderImageGrid();
    });
  });

  // Drag and drop to rearrange
  let dragSrcEl = null;
  grid.querySelectorAll('.img-thumb-item').forEach(item => {
    item.addEventListener('dragstart', (e) => {
      dragSrcEl = item;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', item.dataset.index);
      item.style.opacity = '0.5';
    });
    
    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      return false;
    });

    item.addEventListener('dragenter', (e) => {
      if (item !== dragSrcEl) {
        item.style.borderStyle = 'dashed';
        item.style.borderColor = 'var(--accent-primary)';
      }
    });

    item.addEventListener('dragleave', (e) => {
      item.style.borderStyle = 'solid';
      item.style.borderColor = 'var(--border-subtle)';
    });

    item.addEventListener('drop', (e) => {
      e.stopPropagation();
      item.style.borderStyle = 'solid';
      item.style.borderColor = 'var(--border-subtle)';
      if (dragSrcEl !== item) {
        const fromIdx = parseInt(dragSrcEl.dataset.index);
        const toIdx = parseInt(item.dataset.index);
        
        // Remove item from old position
        const [movedItem] = uploadedImages.splice(fromIdx, 1);
        // Insert into new position
        uploadedImages.splice(toIdx, 0, movedItem);
        renderImageGrid();
      }
      return false;
    });

    item.addEventListener('dragend', (e) => {
      grid.querySelectorAll('.img-thumb-item').forEach(i => {
        i.style.opacity = '1';
        i.style.borderStyle = 'solid';
        i.style.borderColor = 'var(--border-subtle)';
      });
    });
  });

  // Update counter
  const counter = document.getElementById('images-count');
  if (counter) counter.textContent = `${uploadedImages.length} image${uploadedImages.length !== 1 ? 's' : ''}`;
}

// -------------------------------------------------------
// Handle dropped / selected image files
// -------------------------------------------------------
async function handleImageFiles(files) {
  const statusEl = document.getElementById('images-upload-status');
  const bar = document.getElementById('images-progress-bar');
  const fill = document.getElementById('images-progress-fill');

  const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
  if (!validFiles.length) return;

  bar.style.display = 'block';
  statusEl.textContent = `Optimizing and uploading ${validFiles.length} image(s)...`;
  statusEl.className = 'upload-status uploading';

  let done = 0;
  for (const file of validFiles) {
    const ext = 'webp'; // Force webp for optimized files
    const path = `products/${getSafeName()}/img_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    try {
      // Optimize image before upload
      const optimizedBlob = await optimizeImage(file);
      const url = await uploadToStorage(optimizedBlob, path);
      uploadedImages.push(url);
      done++;
      fill.style.width = `${Math.round((done / validFiles.length) * 100)}%`;
      renderImageGrid();
    } catch (err) {
      console.error('Upload error:', err);
      statusEl.textContent = `❌ Error: ${err.message}`;
    }
  }

  bar.style.display = 'none';
  fill.style.width = '0%';
  statusEl.textContent = `✅ ${done} image(s) optimized & uploaded!`;
  statusEl.className = 'upload-status success';
}

// -------------------------------------------------------
// Handle video file
// -------------------------------------------------------
async function handleVideoFile(file) {
  const statusEl = document.getElementById('video-upload-status');
  const bar = document.getElementById('video-progress-bar');
  const fill = document.getElementById('video-progress-fill');
  const hiddenInput = document.getElementById('p-video');
  const box = document.getElementById('video-upload-box');

  bar.style.display = 'block';
  statusEl.textContent = 'Uploading video...';
  statusEl.className = 'upload-status uploading';

  const ext = file.name.split('.').pop();
  const path = `products/${getSafeName()}/video_${Date.now()}.${ext}`;

  const storageRef = ref(storage, path);
  const task = uploadBytesResumable(storageRef, file);

  task.on('state_changed',
    (snap) => {
      const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
      fill.style.width = pct + '%';
      statusEl.textContent = `Uploading... ${pct}%`;
    },
    (err) => {
      statusEl.textContent = '❌ Upload failed: ' + err.message;
      statusEl.className = 'upload-status error';
      bar.style.display = 'none';
    },
    async () => {
      const url = await getDownloadURL(task.snapshot.ref);
      hiddenInput.value = url;
      bar.style.display = 'none';
      statusEl.textContent = '✅ Video uploaded!';
      statusEl.className = 'upload-status success';
      // Show preview
      box.querySelector('.media-upload-placeholder')?.remove();
      if (!box.querySelector('video')) {
        const vid = document.createElement('video');
        vid.src = url;
        vid.controls = true;
        vid.className = 'media-preview-video';
        box.prepend(vid);
      }
      const removeBtn = document.getElementById('remove-video-btn');
      if (removeBtn) removeBtn.style.display = 'inline-block';
    }
  );
}

// -------------------------------------------------------
// Init upload zones
// -------------------------------------------------------
function initImageUploadZone() {
  const zone = document.getElementById('images-drop-zone');
  const fileInput = document.getElementById('p-images-file');
  if (!zone || !fileInput) return;

  zone.addEventListener('click', () => fileInput.click());
  zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', (e) => {
    e.preventDefault(); zone.classList.remove('drag-over');
    handleImageFiles(e.dataTransfer.files);
  });
  fileInput.addEventListener('change', (e) => handleImageFiles(e.target.files));
}

function initVideoUploadZone() {
  const box = document.getElementById('video-upload-box');
  const fileInput = document.getElementById('p-video-file');
  const removeBtn = document.getElementById('remove-video-btn');
  const hiddenInput = document.getElementById('p-video');
  const statusEl = document.getElementById('video-upload-status');
  if (!box || !fileInput) return;

  if (removeBtn) {
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hiddenInput.value = '';
      if (fileInput) fileInput.value = '';
      box.querySelector('.media-preview-video')?.remove();
      if (!box.querySelector('.media-upload-placeholder')) {
        box.insertAdjacentHTML('afterbegin', `
          <div class="media-upload-placeholder">
            <span class="upload-icon">🎬</span>
            <span>Click or drag &amp; drop a video</span>
            <span class="upload-hint">MP4, WebM — max 100MB recommended</span>
          </div>
        `);
      }
      removeBtn.style.display = 'none';
      if (statusEl) {
        statusEl.textContent = 'Video removed.';
        statusEl.className = 'upload-status';
      }
    });
  }

  box.addEventListener('click', () => fileInput.click());
  box.addEventListener('dragover', (e) => { e.preventDefault(); box.classList.add('drag-over'); });
  box.addEventListener('dragleave', () => box.classList.remove('drag-over'));
  box.addEventListener('drop', (e) => {
    e.preventDefault(); box.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('video/')) handleVideoFile(file);
  });
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleVideoFile(file);
  });
}

// -------------------------------------------------------
// Render
// -------------------------------------------------------
export async function renderAdminProductForm() {
  const product = await getEditProduct();
  const isEdit = !!product;
  const seriesOptions = Object.keys(seriesInfo);

  // Reset state
  uploadedImages.length = 0;

  const p = product || {
    id: '', name: '', series: 'Palma', tagline: '', description: '',
    price: 'Contact for Price', featured: false, badge: '',
    specs: {
      screen: '', resolution: '', cpu: '', ram: '', storage: '', os: '',
      connectivity: '', battery: '', weight: '', dimensions: '', camera: '', stylus: '', extras: ''
    },
    colors: [], images: [], image: '', video: ''
  };

  // Pre-populate images from existing product
  const existingImages = p.images?.length ? p.images : (p.image ? [p.image] : []);
  existingImages.forEach(url => uploadedImages.push(url));

  const existingThumbs = existingImages.map((url, i) => `
    <div class="img-thumb-item" data-index="${i}">
      <img src="${url}" alt="Image ${i + 1}">
      <button type="button" class="img-thumb-remove" data-index="${i}" title="Remove">✕</button>
      ${i === 0 ? '<span class="img-thumb-cover">Cover</span>' : ''}
    </div>
  `).join('');

  return `
    <section class="admin-form-page">
      <div class="admin-form-container">
        <div class="admin-form-header">
          <a href="#admin" class="btn btn-secondary">← Back</a>
          <h1>${isEdit ? 'Edit Product' : 'Add New Product'}</h1>
        </div>

        <form id="product-form" class="admin-form glass-card">
          <div class="form-grid">
            <!-- Basic Info -->
            <div class="form-section">
              <h3>📋 Basic Information</h3>
              <div class="form-group">
                <label for="p-name">Product Name *</label>
                <input type="text" id="p-name" value="${p.name}" placeholder="e.g. BOOX Palma 2 Pro" required />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="p-series">Series *</label>
                  <select id="p-series">
                    ${seriesOptions.map(s => `<option value="${s}" ${p.series === s ? 'selected' : ''}>${s}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label for="p-badge">Badge</label>
                  <select id="p-badge">
                    <option value="" ${!p.badge ? 'selected' : ''}>None</option>
                    <option value="NEW" ${p.badge === 'NEW' ? 'selected' : ''}>NEW</option>
                    <option value="POPULAR" ${p.badge === 'POPULAR' ? 'selected' : ''}>POPULAR</option>
                    <option value="PRO" ${p.badge === 'PRO' ? 'selected' : ''}>PRO</option>
                    <option value="PREMIUM" ${p.badge === 'PREMIUM' ? 'selected' : ''}>PREMIUM</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label for="p-tagline">Tagline *</label>
                <input type="text" id="p-tagline" value="${p.tagline}" placeholder='e.g. 6.13" Color Mobile ePaper with 5G' required />
              </div>
              <div class="form-group">
                <label for="p-description">Description *</label>
                <textarea id="p-description" rows="4" placeholder="Full product description..." required>${p.description}</textarea>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="p-price">Price</label>
                  <input type="text" id="p-price" value="${p.price}" placeholder="e.g. 550,000 MMK" />
                </div>
                <div class="form-group">
                  <label for="p-stock">Stock Level *</label>
                  <input type="number" id="p-stock" value="${p.stock || 0}" min="0" required />
                </div>
              </div>
              <div class="form-group">
                <label for="p-colors">Colors (comma separated)</label>
                <input type="text" id="p-colors" value="${(p.colors || []).join(', ')}" placeholder="Black, White" />
              </div>
              <div class="form-group form-checkbox">
                <label>
                  <input type="checkbox" id="p-featured" ${p.featured ? 'checked' : ''} />
                  Featured Product
                </label>
              </div>
            </div>

            <!-- Media Upload -->
            <div class="form-section form-section-full">
              <h3>🖼️ Product Gallery (Firebase Storage)</h3>

              <!-- Multi-image upload -->
              <div class="form-group">
                <label>
                  Product Images *
                  <span class="label-hint">First image is the cover shown on product cards</span>
                </label>

                <!-- Drop zone -->
                <div class="media-upload-box images-drop-zone" id="images-drop-zone">
                  <div class="media-upload-placeholder">
                    <span class="upload-icon">📷</span>
                    <span>Click or drag &amp; drop to add images</span>
                    <span class="upload-hint">PNG, JPG, WebP — you can add multiple at once</span>
                  </div>
                  <input type="file" id="p-images-file" accept="image/*" multiple class="file-input-hidden" />
                </div>

                <!-- Uploaded image grid -->
                <div class="images-grid" id="images-grid">
                  ${existingThumbs}
                </div>

                <div style="display:flex; align-items:center; justify-content:space-between; margin-top: var(--space-sm);">
                  <span class="upload-status" id="images-count">${existingImages.length} image${existingImages.length !== 1 ? 's' : ''}</span>
                  <span class="upload-status" id="images-upload-status"></span>
                </div>
                <div class="upload-progress-bar" id="images-progress-bar" style="display:none;">
                  <div class="upload-progress-fill" id="images-progress-fill"></div>
                </div>
              </div>

              <!-- Video upload -->
              <div class="form-group">
                <div style="display:flex; justify-content:space-between; align-items:flex-end;">
                  <label>Product Video (optional)</label>
                  <button type="button" id="remove-video-btn" class="btn btn-secondary" style="padding:4px 8px; font-size:0.8rem; margin-bottom:var(--space-xs); ${p.video ? '' : 'display:none;'}">Remove Video</button>
                </div>
                <div class="media-upload-box" id="video-upload-box">
                  ${p.video ? `<video src="${p.video}" controls class="media-preview-video"></video>` : `
                    <div class="media-upload-placeholder">
                      <span class="upload-icon">🎬</span>
                      <span>Click or drag &amp; drop a video</span>
                      <span class="upload-hint">MP4, WebM — max 100MB recommended</span>
                    </div>
                  `}
                  <input type="file" id="p-video-file" accept="video/*" class="file-input-hidden" />
                  <input type="hidden" id="p-video" value="${p.video || ''}" />
                </div>
                <div class="upload-progress-bar" id="video-progress-bar" style="display:none;">
                  <div class="upload-progress-fill" id="video-progress-fill"></div>
                </div>
                <p class="upload-status" id="video-upload-status"></p>
              </div>
            </div>

            <!-- Specs -->
            <div class="form-section form-section-full">
              <h3>⚙️ Specifications</h3>
              <div class="form-row">
                <div class="form-group">
                  <label for="p-screen">Screen</label>
                  <input type="text" id="p-screen" value="${p.specs.screen || ''}" placeholder='e.g. 6.13" Kaleido 3 glass screen' />
                </div>
                <div class="form-group">
                  <label for="p-resolution">Resolution</label>
                  <input type="text" id="p-resolution" value="${p.specs.resolution || ''}" placeholder="e.g. 824×1648 (300ppi)" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="p-cpu">CPU</label>
                  <input type="text" id="p-cpu" value="${p.specs.cpu || ''}" placeholder="e.g. Octa-core + BSR" />
                </div>
                <div class="form-group">
                  <label for="p-ram">RAM</label>
                  <input type="text" id="p-ram" value="${p.specs.ram || ''}" placeholder="e.g. 8GB" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="p-storage">Storage</label>
                  <input type="text" id="p-storage" value="${p.specs.storage || ''}" placeholder="e.g. 128GB" />
                </div>
                <div class="form-group">
                  <label for="p-os">OS</label>
                  <input type="text" id="p-os" value="${p.specs.os || ''}" placeholder="e.g. Android 15" />
                </div>
              </div>
              <div class="form-group">
                <label for="p-connectivity">Connectivity</label>
                <input type="text" id="p-connectivity" value="${p.specs.connectivity || ''}" placeholder="e.g. Wi-Fi + BT 5.1" />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="p-battery">Battery</label>
                  <input type="text" id="p-battery" value="${p.specs.battery || ''}" placeholder="e.g. 3,950mAh" />
                </div>
                <div class="form-group">
                  <label for="p-weight">Weight</label>
                  <input type="text" id="p-weight" value="${p.specs.weight || ''}" placeholder="e.g. 175g" />
                </div>
              </div>
              <div class="form-group">
                <label for="p-dimensions">Dimensions</label>
                <input type="text" id="p-dimensions" value="${p.specs.dimensions || ''}" placeholder="e.g. 159 × 80 × 8.8 mm" />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="p-camera">Camera</label>
                  <input type="text" id="p-camera" value="${p.specs.camera || ''}" placeholder="e.g. 16MP Rear" />
                </div>
                <div class="form-group">
                  <label for="p-stylus">Stylus</label>
                  <input type="text" id="p-stylus" value="${p.specs.stylus || ''}" placeholder="e.g. BOOX Pen3" />
                </div>
              </div>
              <div class="form-group">
                <label for="p-extras">Extras</label>
                <input type="text" id="p-extras" value="${p.specs.extras || ''}" placeholder="e.g. Fingerprint, USB-C" />
              </div>
            </div>
          </div>

          <div class="form-actions">
            <a href="#admin" class="btn btn-secondary">Cancel</a>
            <button type="submit" class="btn btn-primary" id="save-product-btn">${isEdit ? 'Save Changes' : 'Add Product'}</button>
          </div>
        </form>
      </div>
    </section>
  `;
}

export function initAdminProductForm() {
  const form = document.getElementById('product-form');

  initImageUploadZone();
  initVideoUploadZone();
  renderImageGrid();

  getEditProduct().then(existingProduct => {
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();

      const saveBtn = document.getElementById('save-product-btn');
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';

      const id = existingProduct
        ? existingProduct.id
        : document.getElementById('p-name').value.toLowerCase().replace(/[^a-z0-9]/g, '');

      const videoUrl = document.getElementById('p-video')?.value || '';

      const product = {
        id,
        name: document.getElementById('p-name').value,
        series: document.getElementById('p-series').value,
        tagline: document.getElementById('p-tagline').value,
        description: document.getElementById('p-description').value,
        price: document.getElementById('p-price').value || 'Contact for Price',
        stock: parseInt(document.getElementById('p-stock').value) || 0,
        featured: document.getElementById('p-featured').checked,
        badge: document.getElementById('p-badge').value || null,
        specs: {
          screen: document.getElementById('p-screen').value,
          resolution: document.getElementById('p-resolution').value,
          cpu: document.getElementById('p-cpu').value,
          ram: document.getElementById('p-ram').value,
          storage: document.getElementById('p-storage').value,
          os: document.getElementById('p-os').value,
          connectivity: document.getElementById('p-connectivity').value,
          battery: document.getElementById('p-battery').value,
          weight: document.getElementById('p-weight').value,
          dimensions: document.getElementById('p-dimensions').value,
          camera: document.getElementById('p-camera').value,
          stylus: document.getElementById('p-stylus').value,
          extras: document.getElementById('p-extras').value,
        },
        colors: document.getElementById('p-colors').value
          .split(',').map(c => c.trim()).filter(Boolean),
        images: [...uploadedImages],
        image: uploadedImages[0] || '',   // keep for backwards compat
        video: videoUrl || null,
      };

      await saveProduct(product);
      window.location.hash = '#admin';
    });
  });
}
