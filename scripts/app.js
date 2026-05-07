// ==========================================
// GURU TEJA HERITAGE EXPORTS - MAIN APP
// ==========================================

/**
 * Global App State
 */
let appState = {
    currentPage: 'home',
    currentProductId: 1,
    filterState: {
        types: [],
        grainLength: 'all'
    },
    sortBy: 'default'
};

/**
 * Navigate to a specific page
 * @param {string} page - Page name (home, catalog, product, inquiry, admin-dashboard, export-tracking, cart, checkout, login, register, user-dashboard, order-success, wholesale, partner-dashboard, wishlist, splash)
 * @param {number} productId - Optional product ID for product page or order ID for order-success
 */
function navigateTo(page, productId = null) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => {
        p.classList.remove('active');
        p.classList.add('hidden');
    });

    // Hide splash screen if navigating away from it
    const splashPage = document.getElementById('splash-page');
    if (splashPage && page !== 'splash') {
        splashPage.style.display = 'none';
    }

    // Update app state
    appState.currentPage = page;

    // Show target page
    const targetPage = document.getElementById(page + '-page');
    if (targetPage) {
        targetPage.classList.remove('hidden');
        targetPage.classList.add('active');

        // Handle page-specific initialization
        if (page === 'product' && productId) {
            appState.currentProductId = productId;
            initProductPage(productId);
        } else if (page === 'catalog') {
            initCatalogPage();
        } else if (page === 'admin-dashboard') {
            initAdminDashboard();
        } else if (page === 'export-tracking') {
            initExportTracking();
        } else if (page === 'cart') {
            renderCartPage();
        } else if (page === 'checkout') {
            renderCheckoutPage();
        } else if (page === 'login') {
            renderLoginPage();
        } else if (page === 'register') {
            renderRegisterPage();
        } else if (page === 'user-dashboard') {
            renderUserDashboard();
        } else if (page === 'order-success') {
            if (productId) {
                targetPage.innerHTML = renderOrderSuccessPage(productId);
            }
        } else if (page === 'wishlist') {
            renderWishlistPage();
        } else if (page === 'wholesale-catalog') {
            // Wholesale page has static content
        } else if (page === 'partner-dashboard') {
            // Partner dashboard has static content
        } else if (page === 'splash') {
            if (splashPage) splashPage.style.display = 'flex';
        }
    }

    // Scroll to top smoothly
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    // Update navigation active states
    updateNavigation(page);
}

/**
 * Update navigation active states
 * @param {string} activePage - Current page name
 */
function updateNavigation(activePage) {
    // Try to update based on data-page attribute
    const navLinks = document.querySelectorAll('a[data-page]');
    navLinks.forEach(link => {
        const pageAttr = link.getAttribute('data-page');
        if (pageAttr === activePage) {
            link.style.borderBottomColor = '#944600';
            link.style.color = '#944600';
        } else {
            link.style.borderBottomColor = 'transparent';
            link.style.color = '#3d2817';
        }
    });
    
    // Fallback for older nav structure
    const oldNavLinks = document.querySelectorAll('.nav-link');
    oldNavLinks.forEach(link => {
        link.classList.remove('active');
        const pageAttr = link.getAttribute('data-page');
        if (pageAttr === activePage) {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize app on page load
 */
function initializeApp() {
    console.log('Initializing Guru Teja Heritage Exports Application');

    // Initialize components (navbar, footer)
    if (typeof initializeComponents === 'function') {
        initializeComponents();
    }

    // Initialize navigation
    setupNavigation();
    initCatalogPage();

    // Show splash screen on first visit
    const hasVisited = localStorage.getItem('heritage_rice_visited');
    if (!hasVisited) {
        navigateTo('splash');
        localStorage.setItem('heritage_rice_visited', 'true');
    } else {
        navigateTo('home');
    }

    // Setup keyboard shortcuts
    setupKeyboardShortcuts();

    // Track scroll for navbar effects
    setupScrollListener();
}

/**
 * Setup navigation click handlers
 */
function setupNavigation() {
    // New navbar structure with data-page attribute
    const navLinks = document.querySelectorAll('a[data-page]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            navigateTo(page);
        });
    });

    // Old navbar structure fallback
    const oldNavLinks = document.querySelectorAll('.nav-link');
    oldNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            navigateTo(page);
        });
    });

    // Logo click to home
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => navigateTo('home'));
    }
}

/**
 * Setup keyboard shortcuts
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
        // Escape to go home
        if (event.key === 'Escape') {
            navigateTo('home');
        }
    });
}

/**
 * Setup scroll listener for navbar effects
 */
function setupScrollListener() {
    const navbar = document.querySelector('nav');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/**
 * Get current product ID
 * @returns {number} Current product ID
 */
function getCurrentProductId() {
    return appState.currentProductId;
}

/**
 * Initialize app when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    initializeApp();
});

/**
 * Log app state for debugging
 */
function logAppState() {
    console.log('Current App State:', appState);
}
