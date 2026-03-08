import { db } from '../firebase.js';
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { products as defaultProducts, seriesInfo } from './products.js';

// ========================================
// localStorage Data Store (Legacy/Fallback)
// ========================================
const KEYS = {
    products: 'bonanza_products',
    posts: 'bonanza_posts',
    auth: 'bonanza_auth',
    orders: 'bonanza_orders',
};

const ADMIN_PASSWORD = 'bonanza2019';

// ========================================
// Products
// ========================================
export async function getProducts() {
    try {
        const q = query(collection(db, "products"), orderBy("name", "asc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (data.length > 0) return data;
    } catch (error) {
        console.error('Firebase fetch error:', error);
    }

    // Fallback to localStorage
    const stored = localStorage.getItem(KEYS.products);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return [...defaultProducts];
        }
    }
    // Seed defaults
    localStorage.setItem(KEYS.products, JSON.stringify(defaultProducts));
    return [...defaultProducts];
}

export async function saveProduct(product) {
    const productData = {
        ...product,
        stock: parseInt(product.stock) || 0,
        updatedAt: new Date().toISOString()
    };

    try {
        await setDoc(doc(db, "products", productData.id), productData);
    } catch (error) {
        console.error('Firebase save error:', error);
    }

    // Always update local for redundancy/fallback
    const products = await getProducts();
    const idx = products.findIndex((p) => p.id === productData.id);
    if (idx >= 0) {
        products[idx] = productData;
    } else {
        products.push(productData);
    }
    localStorage.setItem(KEYS.products, JSON.stringify(products));
    return products;
}

export async function deleteProduct(id) {
    try {
        await deleteDoc(doc(db, "products", id));
    } catch (error) {
        console.error('Firebase delete error:', error);
    }

    const products = (await getProducts()).filter((p) => p.id !== id);
    localStorage.setItem(KEYS.products, JSON.stringify(products));
    return products;
}

// ========================================
// Blog Posts
// ========================================
export async function getPosts() {
    try {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Firebase posts fetch error:', error);
    }

    const stored = localStorage.getItem(KEYS.posts);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return [];
        }
    }
    return [];
}

export async function savePost(post) {
    const enrichedPost = {
        ...post,
        updatedAt: new Date().toISOString()
    };

    if (!post.createdAt) enrichedPost.createdAt = new Date().toISOString();

    try {
        await setDoc(doc(db, "posts", post.id), enrichedPost);
    } catch (error) {
        console.error('Firebase post save error:', error);
    }

    const posts = await getPosts();
    const idx = posts.findIndex((p) => p.id === post.id);
    if (idx >= 0) {
        posts[idx] = enrichedPost;
    } else {
        posts.push(enrichedPost);
    }
    localStorage.setItem(KEYS.posts, JSON.stringify(posts));
    return posts;
}

export async function deletePost(id) {
    try {
        await deleteDoc(doc(db, "posts", id));
    } catch (error) {
        console.error('Firebase post delete error:', error);
    }

    const posts = (await getPosts()).filter((p) => p.id !== id);
    localStorage.setItem(KEYS.posts, JSON.stringify(posts));
    return posts;
}

// ========================================
// Messages (Contact Inquiries)
// ========================================
export async function saveMessage(message) {
    const enrichedMessage = {
        ...message,
        id: message.id || `msg_${Date.now()}`,
        status: 'unread',
        createdAt: new Date().toISOString()
    };

    try {
        await setDoc(doc(db, "messages", enrichedMessage.id), enrichedMessage);
        return true;
    } catch (error) {
        console.error('Firebase message save error:', error);
        return false;
    }
}

export async function getMessages() {
    try {
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Firebase messages fetch error:', error);
        return [];
    }
}

export function subscribeToMessages(callback) {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(messages);
    });
}

export async function deleteMessage(id) {
    try {
        await deleteDoc(doc(db, "messages", id));
        return true;
    } catch (error) {
        console.error('Firebase message delete error:', error);
        return false;
    }
}

export async function markMessageAsRead(id) {
    try {
        const messages = await getMessages();
        const msg = messages.find(m => m.id === id);
        if (msg) {
            await setDoc(doc(db, "messages", id), { ...msg, status: 'read' });
        }
        return true;
    } catch (error) {
        console.error('Firebase message update error:', error);
        return false;
    }
}

// ========================================
// Orders / Sales
// ========================================
export async function getOrders() {
    try {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Firebase orders fetch error:', error);
        return [];
    }
}

export async function saveOrder(order) {
    const enrichedOrder = {
        ...order,
        id: order.id || `ord_${Date.now()}`,
        createdAt: new Date().toISOString()
    };

    try {
        await setDoc(doc(db, "orders", enrichedOrder.id), enrichedOrder);
        return true;
    } catch (error) {
        console.error('Firebase order save error:', error);
        return false;
    }
}

export async function recordSale(productId, quantity, customerName, price) {
    try {
        const products = await getProducts();
        const product = products.find(p => p.id === productId);
        if (!product) return false;

        const order = {
            productId,
            productName: product.name,
            quantity,
            price,
            total: price * quantity,
            customerName: customerName || 'Walk-in Customer',
            type: 'manual',
            status: 'completed',
            createdAt: new Date().toISOString()
        };

        const ok = await saveOrder(order);
        if (ok) {
            product.stock = Math.max(0, (product.stock || 0) - quantity);
            await saveProduct(product);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Record sale error:', error);
        return false;
    }
}

/**
 * Places a full order from the website.
 * Decrements stock for all items and saves the order.
 */
export async function placeOrder(orderData) {
    const products = await getProducts();

    // 1. Check stock for all items first
    for (const item of orderData.items) {
        const product = products.find(p => p.id === item.id);
        if (!product || (product.stock || 0) < item.quantity) {
            throw new Error(`Insufficient stock for ${product?.name || 'unknown product'}`);
        }
    }

    // 2. Decrement stock
    for (const item of orderData.items) {
        const productIdx = products.findIndex(p => p.id === item.id);
        const product = products[productIdx];
        product.stock -= item.quantity;
        await saveProduct(product);
    }

    // 3. Save Order
    return await saveOrder(orderData);
}

// ========================================
// Site Settings / Maintenance Mode
// ========================================
export async function getMaintenanceMode() {
    try {
        const snap = await getDoc(doc(db, 'settings', 'maintenance'));
        if (snap.exists()) return snap.data().enabled === true;
    } catch (e) {
        console.error('Firebase maintenance fetch error:', e);
    }
    return false;
}

export async function setMaintenanceMode(enabled) {
    try {
        await setDoc(doc(db, 'settings', 'maintenance'), { enabled });
        return true;
    } catch (e) {
        console.error('Firebase maintenance set error:', e);
        return false;
    }
}

// ========================================
// Authentication
// ========================================
export function isLoggedIn() {
    return localStorage.getItem(KEYS.auth) === 'true';
}

export function login(password) {
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem(KEYS.auth, 'true');
        return true;
    }
    return false;
}

export function logout() {
    localStorage.removeItem(KEYS.auth);
}

// Re-export series info
export { seriesInfo };
