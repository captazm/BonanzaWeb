import { t } from '../i18n.js';
import { getCartItems, getCartTotal, clearCart } from '../data/cart.js';
import { placeOrder } from '../data/store.js';

export async function renderCheckout() {
    const items = getCartItems();
    const total = getCartTotal();

    if (items.length === 0) {
        return `
            <div class="checkout-page section" style="padding-top: 100px;">
                <div class="container text-center">
                    <div class="cart-empty-icon" style="font-size: 5rem; margin-bottom: 2rem;">🛒</div>
                    <h2>${t('cart_empty')}</h2>
                    <p style="margin: 1.5rem 0 2rem;">${t('checkout_subtitle')}</p>
                    <a href="#products" class="btn btn-primary">${t('cart_shop_now')}</a>
                </div>
            </div>
        `;
    }

    return `
        <div class="checkout-page section" style="padding-top: 100px;">
            <div class="container">
                <h1 class="section-title" style="margin-bottom: var(--space-xl);">${t('checkout_title')}</h1>
                
                <div class="checkout-grid" style="display: grid; grid-template-columns: 1.5fr 1fr; gap: var(--space-3xl);">
                    <div class="checkout-form-container glass-card" style="padding: var(--space-2xl);">
                        <h3 style="margin-bottom: var(--space-xl);">${t('contact_form_title')}</h3>
                        <form id="checkout-form">
                            <div class="form-group">
                                <label>${t('checkout_form_name')}</label>
                                <input type="text" id="customer-name" required placeholder="${t('contact_placeholder_name')}">
                            </div>
                            <div class="form-group">
                                <label>${t('checkout_form_phone')}</label>
                                <input type="tel" id="customer-phone" required placeholder="${t('contact_placeholder_phone')}">
                            </div>
                            <div class="form-group">
                                <label>${t('checkout_form_email')}</label>
                                <input type="email" id="customer-email" placeholder="${t('contact_placeholder_email')}">
                            </div>
                            <div class="form-group">
                                <label>${t('checkout_form_address')}</label>
                                <textarea id="customer-address" required placeholder="Street House, Township..." style="width:100%; min-height:100px; background: var(--bg-tertiary); border: 1px solid var(--border-medium); border-radius: var(--radius-md); padding: 1rem; color: var(--text-primary);"></textarea>
                            </div>
                            <div class="form-group">
                                <label>${t('checkout_form_delivery')}</label>
                                <select id="delivery-method" style="width:100%; background: var(--bg-tertiary); border: 1px solid var(--border-medium); border-radius: var(--radius-md); padding: 1rem; color: var(--text-primary);">
                                    <option value="standard">${t('checkout_delivery_standard')}</option>
                                    <option value="express">${t('checkout_delivery_express')}</option>
                                </select>
                            </div>
                            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: var(--space-xl); height: 55px; font-size: 1.1rem;">
                                ${t('checkout_place_order')}
                            </button>
                        </form>
                    </div>

                    <div class="order-summary-container glass-card" style="padding: var(--space-2xl); height: fit-content; position: sticky; top: 100px;">
                        <h3 style="margin-bottom: var(--space-xl);">${t('checkout_order_summary')}</h3>
                        <div class="summary-items" style="margin-bottom: var(--space-xl);">
                            ${items.map(item => `
                                <div class="summary-item" style="display: flex; justify-content: space-between; margin-bottom: var(--space-md); font-size: 0.95rem;">
                                    <span>${item.name} <strong style="color:var(--text-tertiary);">x ${item.quantity}</strong></span>
                                    <span>${(item.price * item.quantity).toLocaleString()} MMK</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="summary-total" style="border-top: 1px solid var(--border-medium); padding-top: var(--space-xl); display: flex; justify-content: space-between; font-size: 1.25rem; font-weight: 800;">
                            <span>${t('cart_total')}</span>
                            <span style="color: var(--accent-primary);">${total.toLocaleString()} MMK</span>
                        </div>
                        <div style="margin-top: var(--space-xl); font-size: 0.85rem; color: var(--text-tertiary); text-align: center;">
                            <p>🔒 ${t('contact_warranty_title')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function initCheckout() {
    const form = document.getElementById('checkout-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const items = getCartItems();
        const total = getCartTotal();

        const orderData = {
            customerName: document.getElementById('customer-name').value,
            phone: document.getElementById('customer-phone').value,
            email: document.getElementById('customer-email').value,
            address: document.getElementById('customer-address').value,
            deliveryMethod: document.getElementById('delivery-method').value,
            items: items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })),
            total: total,
            status: 'pending',
            type: 'website',
            createdAt: new Date().toISOString()
        };

        try {
            await placeOrder(orderData);

            // Show success
            const container = document.querySelector('.checkout-page .container');
            container.innerHTML = `
                <div class="text-center animate-fade-in" style="padding: var(--space-4xl) 0;">
                    <div style="font-size: 6rem; margin-bottom: 2rem;">🎉</div>
                    <h2 class="section-title">${t('checkout_success_title')}</h2>
                    <p style="margin: 1.5rem 0 2.5rem; font-size: 1.1rem; color: var(--text-secondary); max-width: 500px; margin-left: auto; margin-right: auto;">
                        ${t('checkout_success_msg')}
                    </p>
                    <a href="#home" class="btn btn-primary">${t('checkout_back_home')}</a>
                </div>
            `;

            clearCart();
        } catch (err) {
            console.error(err);
            alert(`Failed to place order: ${err.message}`);
        }
    });
}
