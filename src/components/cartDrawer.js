import { getCartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } from '../data/cart.js';
import { t } from '../i18n.js';

export function renderCartDrawer() {
    const items = getCartItems();
    const total = getCartTotal();

    return `
        <div class="cart-drawer-overlay" id="cart-drawer-overlay">
            <div class="cart-drawer glass-card" id="cart-drawer">
                <div class="cart-drawer-header">
                    <h2>🛒 ${t('cart_title') || 'Shopping Cart'}</h2>
                    <button class="cart-close" id="cart-close-btn">✕</button>
                </div>

                <div class="cart-items">
                    ${items.length === 0 ? `
                        <div class="cart-empty">
                            <div class="cart-empty-icon">🛍️</div>
                            <p>${t('cart_empty') || 'Your cart is empty'}</p>
                            <a href="#products" class="btn btn-secondary" id="cart-shop-btn">${t('cart_shop_now') || 'Shop Now'}</a>
                        </div>
                    ` : items.map(item => `
                        <div class="cart-item">
                            <div class="cart-item-img">
                                <img src="${item.image}" alt="${item.name}">
                            </div>
                            <div class="cart-item-info">
                                <div class="cart-item-name">${item.name}</div>
                                <div class="cart-item-price">${item.price.toLocaleString()} MMK</div>
                                <div class="cart-item-actions">
                                    <div class="quantity-controls">
                                        <button class="qty-btn minus" data-id="${item.id}">−</button>
                                        <span class="qty-val">${item.quantity}</span>
                                        <button class="qty-btn plus" data-id="${item.id}">+</button>
                                    </div>
                                    <button class="cart-item-remove" data-id="${item.id}">${t('cart_remove') || 'Remove'}</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                ${items.length > 0 ? `
                    <div class="cart-footer">
                        <div class="cart-total">
                            <span>${t('cart_total') || 'Total'}</span>
                            <span class="total-val">${total.toLocaleString()} MMK</span>
                        </div>
                        <div class="cart-actions">
                            <button class="btn btn-secondary" id="cart-clear-btn">${t('cart_clear') || 'Clear Cart'}</button>
                            <a href="#checkout" class="btn btn-primary" id="cart-checkout-btn">
                                ${t('cart_checkout') || 'Checkout'}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </a>
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

export function initCartDrawer() {
    const overlay = document.getElementById('cart-drawer-overlay');
    const drawer = document.getElementById('cart-drawer');
    if (!overlay || !drawer) return;

    const close = () => {
        drawer.classList.remove('active');
        setTimeout(() => {
            overlay.classList.remove('active');
            overlay.remove();
        }, 300);
        document.body.style.overflow = '';
    };

    document.getElementById('cart-close-btn')?.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.getElementById('cart-shop-btn')?.addEventListener('click', close);

    // Quantity controls
    drawer.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            updateQuantity(id, btn.classList.contains('plus') ? 1 : -1);
            refreshCart();
        });
    });

    // Remove item
    drawer.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            removeFromCart(btn.dataset.id);
            refreshCart();
        });
    });

    // Clear cart
    document.getElementById('cart-clear-btn')?.addEventListener('click', () => {
        if (confirm(t('cart_clear_confirm') || 'Clear your cart?')) {
            clearCart();
            refreshCart();
        }
    });

    // Checkout
    document.getElementById('cart-checkout-btn')?.addEventListener('click', () => {
        close();
    });

    // Trigger entrance animation
    requestAnimationFrame(() => {
        overlay.classList.add('active');
        drawer.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

function refreshCart() {
    const container = document.getElementById('cart-drawer-overlay');
    if (container) {
        container.innerHTML = renderCartDrawer();
        // Extract the inner HTML of the newly rendered overlay to update the existing one
        const temp = document.createElement('div');
        temp.innerHTML = renderCartDrawer();
        const newOverlay = temp.firstElementChild;

        // Instead of full re-render which breaks event listeners, we re-init
        // But for simplicity in this component structure, we replace and re-init
        const oldOverlay = document.getElementById('cart-drawer-overlay');
        oldOverlay.innerHTML = newOverlay.innerHTML;
        initCartDrawer();
    }
}

// Global listener to open cart from anywhere
window.addEventListener('toggle-cart', () => {
    let overlay = document.getElementById('cart-drawer-overlay');
    if (!overlay) {
        const div = document.createElement('div');
        div.innerHTML = renderCartDrawer();
        overlay = div.firstElementChild;
        document.body.appendChild(overlay);
        initCartDrawer();
    }
});
