import { getProducts, deleteProduct, getPosts, deletePost, getMessages, deleteMessage, markMessageAsRead, subscribeToMessages, logout, getMaintenanceMode, setMaintenanceMode, getOrders, recordSale } from '../data/store.js';

export async function renderAdmin() {
  const products = await getProducts();
  const posts = await getPosts();
  const maintenanceEnabled = await getMaintenanceMode();

  return `
    <section class="admin-page">
      <div class="admin-container">
        <div class="admin-sidebar glass-card">
          <div class="admin-sidebar-header">
            <h2>⚡ Admin</h2>
          </div>
          <nav class="admin-nav">
            <button class="admin-nav-btn active" data-tab="products">
              <span>📦</span> Products
            </button>
            <button class="admin-nav-btn" data-tab="blog">
              <span>📝</span> Blog Posts
            </button>
            <button class="admin-nav-btn" data-tab="messages">
              <span>💬</span> Messages
              <span id="msg-badge" class="badge-count" style="display:none">0</span>
            </button>
            <button class="admin-nav-btn" data-tab="sales">
              <span>💰</span> Sales
            </button>
            <button class="admin-nav-btn" data-tab="settings">
              <span>⚙️</span> Settings
            </button>
            <button class="admin-nav-btn admin-nav-logout" id="admin-logout">
              <span>🚪</span> Sign Out
            </button>
          </nav>
        </div>

        <div class="admin-content">
          <!-- Stats -->
          <div class="admin-stats">
            <div class="admin-stat-card glass-card">
              <div class="admin-stat-icon">📦</div>
              <div class="admin-stat-info">
                <span class="admin-stat-value">${products.length}</span>
                <span class="admin-stat-label">Products</span>
              </div>
            </div>
            <div class="admin-stat-card glass-card">
              <div class="admin-stat-icon">📝</div>
              <div class="admin-stat-info">
                <span class="admin-stat-value">${posts.length}</span>
                <span class="admin-stat-label">Posts</span>
              </div>
            </div>
            <div class="admin-stat-card glass-card">
              <div class="admin-stat-icon">💬</div>
              <div class="admin-stat-info">
                <span class="admin-stat-value" id="unread-count">...</span>
                <span class="admin-stat-label">Inquiries</span>
              </div>
            </div>
            <div class="admin-stat-card glass-card">
              <div class="admin-stat-icon">💰</div>
              <div class="admin-stat-info">
                <span class="admin-stat-value" id="total-sales-count">...</span>
                <span class="admin-stat-label">Sales</span>
              </div>
            </div>
          </div>


          <!-- Products Tab -->
          <div class="admin-tab active" id="tab-products">
            <div class="admin-tab-header">
              <h2>Products</h2>
              <a href="#admin-product" class="btn btn-primary">+ Add Product</a>
            </div>
            <div class="admin-table-wrap glass-card">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Series</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Badge</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${products.map(p => `
                    <tr>
                      <td>
                        <div class="admin-product-name">
                          <strong>${p.name}</strong>
                          <small>${p.tagline}</small>
                        </div>
                      </td>
                      <td><span class="badge badge-new">${p.series}</span></td>
                      <td>${p.price}</td>
                      <td>
                        <span class="stock-badge ${p.stock <= 2 ? 'low-stock' : ''}">
                          ${p.stock || 0}
                        </span>
                      </td>
                      <td>${p.badge ? `<span class="badge badge-${(p.badge || '').toLowerCase()}">${p.badge}</span>` : '—'}</td>
                      <td>${p.featured ? '⭐' : '—'}</td>
                      <td>
                        <div class="admin-actions">
                          <a href="#admin-product?id=${p.id}" class="admin-action-btn edit" title="Edit">✏️</a>
                          <button class="admin-action-btn delete" data-delete-product="${p.id}" title="Delete">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              ${products.length === 0 ? '<p class="admin-empty">No products yet. Click "Add Product" to start.</p>' : ''}
            </div>
          </div>

          <!-- Blog Tab -->
          <div class="admin-tab" id="tab-blog">
            <div class="admin-tab-header">
              <h2>Blog Posts</h2>
              <a href="#admin-blog-form" class="btn btn-primary">+ New Post</a>
            </div>
            <div class="admin-table-wrap glass-card">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Published</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${posts.map(p => `
                    <tr>
                      <td>
                        <div class="admin-product-name">
                          <strong>${p.title}</strong>
                          <small>${(p.excerpt || '').substring(0, 60)}...</small>
                        </div>
                      </td>
                      <td><span class="badge badge-new">${p.category || 'General'}</span></td>
                      <td>${p.published ? '<span style="color:var(--accent-tertiary)">✔ Live</span>' : '<span style="color:var(--text-tertiary)">Draft</span>'}</td>
                      <td>${p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}</td>
                      <td>
                        <div class="admin-actions">
                          <a href="#admin-blog-form?id=${p.id}" class="admin-action-btn edit" title="Edit">✏️</a>
                          <button class="admin-action-btn delete" data-delete-post="${p.id}" title="Delete">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              ${posts.length === 0 ? '<p class="admin-empty">No blog posts yet. Click "New Post" to start writing.</p>' : ''}
            </div>
          </div>

          <!-- Messages Tab -->
          <div class="admin-tab" id="tab-messages">
            <div class="admin-tab-header">
              <h2>Contact Inquiries</h2>
            </div>
            <div class="admin-messages-list" id="messages-container">
              <p class="admin-empty">Loading messages...</p>
            </div>
          </div>

          <!-- Sales Tab -->
          <div class="admin-tab" id="tab-sales">
            <div class="admin-tab-header">
              <h2>Sales & Orders</h2>
              <button class="btn btn-primary" id="record-sale-btn">+ Record Sale</button>
            </div>
            <div class="admin-table-wrap glass-card">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Customer</th>
                  </tr>
                </thead>
                <tbody id="sales-table-body">
                  <!-- Loaded via JS -->
                </tbody>
              </table>
              <div id="sales-empty-msg" class="admin-empty">No sales recorded yet.</div>
            </div>
          </div>

          <!-- Settings Tab -->
          <div class="admin-tab" id="tab-settings">
            <div class="admin-tab-header">
              <h2>Site Settings</h2>
            </div>
            <div class="admin-settings-grid">
              <div class="admin-setting-card glass-card">
                <div class="admin-setting-info">
                  <div class="admin-setting-icon">🚧</div>
                  <div>
                    <h3>Maintenance Mode</h3>
                    <p>When enabled, visitors will see a maintenance notice instead of the website. Admin routes are still accessible.</p>
                  </div>
                </div>
                <label class="admin-toggle" title="Toggle maintenance mode">
                  <input type="checkbox" id="maintenance-toggle" ${maintenanceEnabled ? 'checked' : ''}>
                  <span class="admin-toggle-slider"></span>
                </label>
              </div>
              <div class="admin-setting-status glass-card ${maintenanceEnabled ? 'status-on' : 'status-off'}" id="maintenance-status">
                <span class="status-dot"></span>
                <span id="maintenance-status-text">${maintenanceEnabled ? 'Site is currently <strong>OFFLINE</strong> — Maintenance mode is active.' : 'Site is currently <strong>ONLINE</strong> — All visitors can browse normally.'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="admin-notifications" class="admin-notifications"></div>
    </section>
  `;
}

export function initAdmin() {
  // Tab switching
  document.querySelectorAll('.admin-nav-btn[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      const tab = document.getElementById(`tab-${btn.dataset.tab}`);
      if (tab) tab.classList.add('active');
    });
  });

  // Logout
  document.getElementById('admin-logout')?.addEventListener('click', () => {
    logout();
    window.location.hash = '#home';
  });

  // Delete product
  document.querySelectorAll('[data-delete-product]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.deleteProduct;
      if (confirm('Delete this product? This cannot be undone.')) {
        await deleteProduct(id);
        window.location.hash = '#admin';
        // Force re-render
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      }
    });
  });

  // Delete post
  document.querySelectorAll('[data-delete-post]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.deletePost;
      if (confirm('Delete this blog post? This cannot be undone.')) {
        deletePost(id);
        window.location.hash = '#admin';
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      }
    });
  });

  // Real-time messages listener
  let lastMessageId = null;
  const unsubscribe = subscribeToMessages((messages) => {
    const unread = messages.filter(m => m.status === 'unread');

    // Update Badge & Stats
    const badge = document.getElementById('msg-badge');
    const stat = document.getElementById('unread-count');
    if (badge) {
      badge.textContent = unread.length;
      badge.style.display = unread.length > 0 ? 'flex' : 'none';
    }
    if (stat) stat.textContent = unread.length;

    // Notification Toast for new incoming message
    const newest = messages[0];
    if (newest && newest.id !== lastMessageId) {
      if (lastMessageId !== null && newest.status === 'unread') {
        showAdminNotification(`New message from ${newest.name}`);
      }
      lastMessageId = newest.id;
    }

    // Render messages list
    const container = document.getElementById('messages-container');
    if (container) {
      if (messages.length === 0) {
        container.innerHTML = '<p class="admin-empty">No messages yet.</p>';
      } else {
        container.innerHTML = messages.map(m => `
          <div class="message-card glass-card ${m.status === 'unread' ? 'unread' : ''}">
            <div class="message-card-header">
              <div class="message-user">
                <strong>${m.name}</strong>
                <span>${m.email} | ${m.phone}</span>
              </div>
              <div class="message-meta">
                <span>${new Date(m.createdAt).toLocaleString()}</span>
                <div class="message-actions">
                  ${m.status === 'unread' ? `<button class="admin-action-btn" data-read-msg="${m.id}" title="Mark as Read">👁️</button>` : ''}
                  <button class="admin-action-btn delete" data-delete-msg="${m.id}" title="Delete">🗑️</button>
                </div>
              </div>
            </div>
            <div class="message-body">
              <div class="message-subject">Re: ${m.subject || 'General Inquiry'}</div>
              <p>${m.message}</p>
            </div>
          </div>
        `).join('');

        // Attach listeners to new elements
        container.querySelectorAll('[data-read-msg]').forEach(b => {
          b.addEventListener('click', async () => {
            await markMessageAsRead(b.dataset.readMsg);
          });
        });
        container.querySelectorAll('[data-delete-msg]').forEach(b => {
          b.addEventListener('click', async () => {
            if (confirm('Delete this message?')) {
              await deleteMessage(b.dataset.deleteMsg);
            }
          });
        });
      }
    }
  });

  // Maintenance mode toggle
  const toggle = document.getElementById('maintenance-toggle');
  if (toggle) {
    toggle.addEventListener('change', async () => {
      const enabled = toggle.checked;
      const ok = await setMaintenanceMode(enabled);
      const statusCard = document.getElementById('maintenance-status');
      const statusText = document.getElementById('maintenance-status-text');
      if (ok) {
        if (statusCard) {
          statusCard.className = `admin-setting-status glass-card ${enabled ? 'status-on' : 'status-off'}`;
        }
        if (statusText) {
          statusText.innerHTML = enabled
            ? 'Site is currently <strong>OFFLINE</strong> — Maintenance mode is active.'
            : 'Site is currently <strong>ONLINE</strong> — All visitors can browse normally.';
        }
        showAdminNotification(enabled ? '🚧 Maintenance mode enabled' : '✅ Site is back online');
      } else {
        toggle.checked = !enabled; // revert on failure
        showAdminNotification('⚠️ Failed to update maintenance mode');
      }
    });
  }

  // Load Sales Data
  const loadSales = async () => {
    const orders = await getOrders();
    const tableBody = document.getElementById('sales-table-body');
    const emptyMsg = document.getElementById('sales-empty-msg');
    const salesCountEl = document.getElementById('total-sales-count');

    if (salesCountEl) salesCountEl.textContent = orders.length;

    if (tableBody) {
      if (orders.length === 0) {
        tableBody.innerHTML = '';
        if (emptyMsg) emptyMsg.style.display = 'block';
      } else {
        if (emptyMsg) emptyMsg.style.display = 'none';
        tableBody.innerHTML = orders.map(o => {
          const isWebsite = o.type === 'website';
          const itemsDisplay = isWebsite
            ? o.items.map(i => `${i.name} (x${i.quantity})`).join('<br>')
            : o.productName;

          const qtyDisplay = isWebsite ? o.items.reduce((sum, i) => sum + i.quantity, 0) : o.quantity;
          const priceDisplay = isWebsite ? '—' : o.price.toLocaleString();

          return `
            <tr>
              <td>${new Date(o.createdAt).toLocaleDateString()}</td>
              <td>
                <div class="admin-product-name">
                  <strong>${isWebsite ? o.items.map(i => i.name).join(', ') : itemsDisplay}</strong>
                  ${isWebsite ? `<small>${o.items.length} unique items</small>` : ''}
                </div>
              </td>
              <td style="text-align:center">${qtyDisplay}</td>
              <td>${priceDisplay}</td>
              <td><strong>${(o.total || (o.price * o.quantity)).toLocaleString()}</strong></td>
              <td>
                <div class="admin-actions" style="justify-content: space-between; align-items: center; gap: 8px;">
                  <span>${o.customerName}</span>
                  ${isWebsite ? `<button class="admin-action-btn" data-view-order="${o.id}" title="Order Details">📄</button>` : ''}
                </div>
              </td>
            </tr>
          `;
        }).join('');

        // Attach listeners for "View Order"
        tableBody.querySelectorAll('[data-view-order]').forEach(btn => {
          btn.addEventListener('click', () => {
            const order = orders.find(ord => ord.id === btn.dataset.viewOrder);
            if (order) showOrderDetailsModal(order);
          });
        });
      }
    }
  };

  loadSales();

  // Record Sale Modal
  document.getElementById('record-sale-btn')?.addEventListener('click', async () => {
    const products = await getProducts();
    const productOptions = products.map(p => `<option value="${p.id}" data-price="${parseFloat((p.price || '0').replace(/[^0-9.]/g, '')) || 0}">${p.name} (Stock: ${p.stock || 0})</option>`).join('');

    const modalHtml = `
      <div class="admin-modal-overlay" id="sale-modal">
        <div class="admin-modal glass-card">
          <h3>Record New Sale</h3>
          <form id="sale-form">
            <div class="form-group">
              <label>Product</label>
              <select id="s-product" required>
                <option value="">Select Product...</option>
                ${productOptions}
              </select>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Quantity</label>
                <input type="number" id="s-qty" value="1" min="1" required />
              </div>
              <div class="form-group">
                <label>Price (per unit)</label>
                <input type="number" id="s-price" required />
              </div>
            </div>
            <div class="form-group">
              <label>Customer Name</label>
              <input type="text" id="s-customer" placeholder="Optional" />
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" id="close-sale-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Record Sale</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.getElementById('sale-modal');
    const form = document.getElementById('sale-form');
    const productSelect = document.getElementById('s-product');
    const priceInput = document.getElementById('s-price');

    productSelect.addEventListener('change', () => {
      const selected = productSelect.options[productSelect.selectedIndex];
      if (selected.dataset.price) {
        priceInput.value = selected.dataset.price;
      }
    });

    document.getElementById('close-sale-modal').addEventListener('click', () => modal.remove());

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pId = productSelect.value;
      const qty = parseInt(document.getElementById('s-qty').value);
      const price = parseFloat(priceInput.value);
      const customer = document.getElementById('s-customer').value;

      const success = await recordSale(pId, qty, customer, price);
      if (success) {
        showAdminNotification('✅ Sale recorded and stock updated');
        modal.remove();
        // Refresh products list and sales list
        window.location.hash = '#admin';
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      } else {
        alert('Failed to record sale. Please check stock levels.');
      }
    });
  });

  // Track unsubscribe for cleanup when page changes
  window.adminUnsubscribe = unsubscribe;
}

function showAdminNotification(text) {
  const container = document.getElementById('admin-notifications');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'admin-toast glass-card animate-in';
  toast.innerHTML = `
    <span>🔔</span>
    <p>${text}</p>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('animate-out');
    setTimeout(() => toast.remove(), 500);
  }, 5000);
}

function showOrderDetailsModal(order) {
  const status = order.status || 'completed';
  const modalHtml = `
      <div class="admin-modal-overlay" id="order-details-modal">
        <div class="admin-modal glass-card" style="max-width: 600px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: var(--space-xl);">
            <h3>Order Details</h3>
            <span class="badge badge-new">${status.toUpperCase()}</span>
          </div>
          
          <div class="checkout-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap: var(--space-xl); margin-bottom: var(--space-xl);">
            <div>
                <label>Customer Info</label>
                <p><strong>${order.customerName}</strong></p>
                <p>${order.phone}</p>
                <p>${order.email || 'No email'}</p>
            </div>
            <div>
                <label>Delivery Details</label>
                <p>${order.deliveryMethod === 'express' ? '🚀 Express' : '📦 Standard'}</p>
                <p style="font-size: 0.85rem;">${order.address}</p>
            </div>
          </div>

          <label>Ordered Items</label>
          <div class="admin-table-wrap" style="margin-bottom: var(--space-xl);">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(i => `
                        <tr>
                            <td>${i.name}</td>
                            <td>${i.quantity}</td>
                            <td>${i.price.toLocaleString()}</td>
                            <td>${(i.price * i.quantity).toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; border-top: 1px solid var(--border-medium); padding-top: var(--space-lg);">
            <div style="font-size: 1.25rem; font-weight: 800;">
                Total: <span style="color: var(--accent-primary)">${order.total.toLocaleString()} MMK</span>
            </div>
            <button class="btn btn-secondary" id="close-order-modal">Close</button>
          </div>
        </div>
      </div>
    `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  document.getElementById('close-order-modal').addEventListener('click', () => {
    document.getElementById('order-details-modal').remove();
  });
}
