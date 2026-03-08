import './index.css';
import { renderHeader, initHeader } from './src/components/header.js';
import { renderFooter } from './src/components/footer.js';
import { renderProductDetail, initProductDetail } from './src/components/productDetail.js';
import { renderHome } from './src/pages/home.js';
import { renderProducts, initProductsPage } from './src/pages/products.js';
import { renderAbout } from './src/pages/about.js';
import { renderContact, initContactPage } from './src/pages/contact.js';
import { renderBlog } from './src/pages/blog.js';
import { renderBlogPost } from './src/pages/blogPost.js';
import { renderAdminLogin, initAdminLogin } from './src/pages/adminLogin.js';
import { renderAdmin, initAdmin } from './src/pages/admin.js';
import { renderAdminProductForm, initAdminProductForm } from './src/pages/adminProductForm.js';
import { renderAdminBlogForm, initAdminBlogForm } from './src/pages/adminBlogForm.js';
import { renderCheckout, initCheckout } from './src/pages/checkout.js';
import './src/components/cartDrawer.js'; // Just import to register global listener
import { getProducts, isLoggedIn, getMaintenanceMode } from './src/data/store.js';
import { initTheme } from './src/theme.js';

// Initialize Theme
initTheme();

const app = document.getElementById('app');

// ========================================
// Router
// ========================================
function getRoute() {
    const hash = window.location.hash.slice(1) || 'home';
    return hash.split('?')[0];
}

const ADMIN_ROUTES = ['admin', 'admin-product', 'admin-blog-form'];

async function renderPage() {
    const route = getRoute();
    const isAdmin = ADMIN_ROUTES.includes(route);
    let pageContent = '';

    // Auth guard for admin routes
    if (isAdmin && !isLoggedIn()) {
        window.location.hash = '#admin-login';
        return;
    }

    // Maintenance mode check (skip for admin routes)
    if (!isAdmin && route !== 'admin-login') {
        const inMaintenance = await getMaintenanceMode();
        if (inMaintenance) {
            app.innerHTML = `
                ${renderHeader(route)}
                <main id="main-content">
                  <div class="maintenance-page">
                    <div class="maintenance-inner">
                      <div class="maintenance-icon">🚧</div>
                      <h1>Under Maintenance</h1>
                      <p>We're currently making some improvements to bring you a better experience.<br>We'll be back shortly. Thank you for your patience!</p>
                      <div class="maintenance-divider"></div>
                      <p class="maintenance-sub">For urgent inquiries, please contact us via Facebook or Viber.</p>
                    </div>
                  </div>
                </main>
                ${renderFooter()}
            `;
            initHeader(renderPage);
            return;
        }
    }

    // Show loading state
    app.innerHTML = `
        <div class="loading-overlay">
            <div class="loader"></div>
        </div>
    `;

    switch (route) {
        case 'home':
            pageContent = await renderHome();
            break;
        case 'products':
            pageContent = await renderProducts();
            break;
        case 'about':
            pageContent = renderAbout();
            break;
        case 'contact':
            pageContent = renderContact();
            break;
        case 'blog':
            pageContent = await renderBlog();
            break;
        case 'blog-post':
            pageContent = await renderBlogPost();
            break;
        case 'checkout':
            pageContent = await renderCheckout();
            break;
        case 'admin-login':
            pageContent = renderAdminLogin();
            break;
        case 'admin':
            pageContent = await renderAdmin();
            break;
        case 'admin-product':
            pageContent = await renderAdminProductForm();
            break;
        case 'admin-blog-form':
            pageContent = await renderAdminBlogForm();
            break;
        default:
            pageContent = await renderHome();
    }

    // Admin pages: no header/footer
    if (isAdmin || route === 'admin-login') {
        app.innerHTML = `
      <main id="main-content" class="admin-layout">
        ${pageContent}
      </main>
    `;
    } else {
        app.innerHTML = `
      ${renderHeader(route)}
      <main id="main-content">
        ${pageContent}
      </main>
      ${renderFooter()}
    `;
        // Pass renderPage as lang change callback
        initHeader(renderPage);
    }

    // Initialize page-specific functionality
    initScrollAnimations();

    switch (route) {
        case 'products':
            initProductsPage();
            initProductCards();
            break;
        case 'home':
            initProductCards();
            break;
        case 'contact':
            initContactPage();
            break;
        case 'blog-post':
            // Assuming initBlogPost is defined elsewhere or not needed for this change
            // If initBlogPost is a function, it needs to be imported or defined.
            // The instruction only asked to import renderCheckout and initCheckout.
            // initBlogPost();
            break;
        case 'checkout':
            initCheckout();
            break;
        case 'admin-login':
            initAdminLogin();
            break;
        case 'admin':
            initAdmin();
            break;
        case 'admin-product':
            initAdminProductForm();
            break;
        case 'admin-blog-form':
            initAdminBlogForm();
            break;
    }

    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'instant' });
}

// ========================================
// Scroll Animations (Intersection Observer)
// ========================================
function initScrollAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        }
    );

    window._scrollObserver = observer;

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        observer.observe(el);
    });
}

// ========================================
// Product Card Click → Modal
// ========================================
function initProductCards() {
    getProducts().then(products => {
        document.querySelectorAll('.product-card').forEach((card) => {
            card.addEventListener('click', () => {
                const productId = card.dataset.productId;
                const product = products.find((p) => p.id === productId);
                if (!product) return;

                const modalContainer = document.createElement('div');
                modalContainer.innerHTML = renderProductDetail(product);
                document.body.appendChild(modalContainer.firstElementChild);
                initProductDetail(product);
            });
        });
    });
}

// ========================================
// Initialize
// ========================================
window.addEventListener('hashchange', renderPage);
renderPage();
