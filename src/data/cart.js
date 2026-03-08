// Shopping Cart State Management
const CART_KEY = 'bonanza_cart';

let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

export function getCartItems() {
    return cart;
}

export function addToCart(product, quantity = 1) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: parseFloat((product.price || '0').replace(/[^0-9.]/g, '')) || 0,
            image: product.image,
            quantity: quantity
        });
    }
    saveCart();
    dispatchUpdate();
}

export function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    dispatchUpdate();
}

export function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity = Math.max(1, item.quantity + delta);
        saveCart();
        dispatchUpdate();
    }
}

export function clearCart() {
    cart = [];
    saveCart();
    dispatchUpdate();
}

export function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

export function getCartCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function dispatchUpdate() {
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: { cart, count: getCartCount() } }));
}
