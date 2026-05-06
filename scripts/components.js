// ==========================================
// SHARED COMPONENTS MODULE
// ==========================================

/**
 * Render navbar component
 */
function renderNavbar() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    nav.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; max-width: 1280px; margin: 0 auto; padding: 0 2rem; height: 80px;">
            <div style="cursor: pointer; font-family: 'Noto Serif', serif; font-size: 24px; font-weight: 700; color: #944600;" onclick="navigateTo('home')">
                Guru Teja
            </div>
            <div style="display: flex; gap: 2rem; align-items: center;">
                <a data-page="home" onclick="navigateTo('home')" style="cursor: pointer; font-size: 16px; font-weight: 600; color: #3d2817; text-decoration: none; transition: color 0.3s; border-bottom: 3px solid transparent; padding: 0.5rem 0;">Home</a>
                <a data-page="catalog" onclick="navigateTo('catalog')" style="cursor: pointer; font-size: 16px; font-weight: 600; color: #3d2817; text-decoration: none; transition: color 0.3s; border-bottom: 3px solid transparent; padding: 0.5rem 0;">Catalog</a>
                <a data-page="inquiry" onclick="navigateTo('inquiry')" style="cursor: pointer; font-size: 16px; font-weight: 600; color: #3d2817; text-decoration: none; transition: color 0.3s; border-bottom: 3px solid transparent; padding: 0.5rem 0;">Contact</a>
            </div>
            <button style="background-color: #944600; color: white; padding: 0.75rem 1.5rem; font-size: 12px; font-weight: 600; text-transform: uppercase; border: none; cursor: pointer; transition: all 0.3s; border-radius: 0.125rem;" onclick="navigateTo('inquiry')" onmouseover="this.style.backgroundColor='#6b3300'" onmouseout="this.style.backgroundColor='#944600'">
                Request Quote
            </button>
        </div>
    `;
}

/**
 * Render footer component
 */
function renderFooter() {
    const footer = document.querySelector('footer');
    if (!footer) return;

    footer.innerHTML = `
        <div style="background-color: #3d2817; color: white; padding: 3rem 2rem; margin-top: 4rem;">
            <div style="max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
                <!-- Company Info -->
                <div>
                    <h3 style="font-family: 'Noto Serif', serif; font-size: 18px; font-weight: 600; margin-bottom: 1rem;">Guru Teja Heritage Exports</h3>
                    <p style="font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.8); margin-bottom: 1rem;">Premium rice exporter with 25 years of expertise. ISO 9001 certified and dedicated to sustainable farming practices.</p>
                    <div style="display: flex; gap: 1rem;">
                        <a href="#" style="width: 40px; height: 40px; background-color: #944600; display: flex; align-items: center; justify-content: center; border-radius: 50%; text-decoration: none; transition: background-color 0.3s;" title="Facebook" onmouseover="this.style.backgroundColor='#fed7c0'; this.style.color='#3d2817'" onmouseout="this.style.backgroundColor='#944600'; this.style.color='white'"><span class="material-symbols-outlined">facebook</span></a>
                        <a href="#" style="width: 40px; height: 40px; background-color: #944600; display: flex; align-items: center; justify-content: center; border-radius: 50%; text-decoration: none; transition: background-color 0.3s;" title="LinkedIn" onmouseover="this.style.backgroundColor='#fed7c0'; this.style.color='#3d2817'" onmouseout="this.style.backgroundColor='#944600'; this.style.color='white'"><span class="material-symbols-outlined">link</span></a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div>
                    <h3 style="font-family: 'Noto Serif', serif; font-size: 18px; font-weight: 600; margin-bottom: 1rem;">Quick Links</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin-bottom: 0.5rem;"><a onclick="navigateTo('home')" style="color: rgba(255,255,255,0.8); text-decoration: none; cursor: pointer; transition: color 0.3s;" onmouseover="this.style.color='#fed7c0'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">Home</a></li>
                        <li style="margin-bottom: 0.5rem;"><a onclick="navigateTo('catalog')" style="color: rgba(255,255,255,0.8); text-decoration: none; cursor: pointer; transition: color 0.3s;" onmouseover="this.style.color='#fed7c0'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">Catalog</a></li>
                        <li style="margin-bottom: 0.5rem;"><a onclick="navigateTo('inquiry')" style="color: rgba(255,255,255,0.8); text-decoration: none; cursor: pointer; transition: color 0.3s;" onmouseover="this.style.color='#fed7c0'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">Contact</a></li>
                        <li><a href="#" style="color: rgba(255,255,255,0.8); text-decoration: none; cursor: pointer; transition: color 0.3s;" onmouseover="this.style.color='#fed7c0'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">FAQ</a></li>
                    </ul>
                </div>

                <!-- Certifications -->
                <div>
                    <h3 style="font-family: 'Noto Serif', serif; font-size: 18px; font-weight: 600; margin-bottom: 1rem;">Certifications</h3>
                    <ul style="list-style: none; padding: 0; font-size: 14px;">
                        <li style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;"><span class="material-symbols-outlined" style="font-size: 18px; color: #fed7c0;">verified</span>ISO 9001:2015</li>
                        <li style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;"><span class="material-symbols-outlined" style="font-size: 18px; color: #fed7c0;">verified</span>HACCP Certified</li>
                        <li style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;"><span class="material-symbols-outlined" style="font-size: 18px; color: #fed7c0;">verified</span>Zero-Waste</li>
                        <li style="display: flex; align-items: center; gap: 0.5rem;"><span class="material-symbols-outlined" style="font-size: 18px; color: #fed7c0;">verified</span>Global Export</li>
                    </ul>
                </div>

                <!-- Newsletter -->
                <div>
                    <h3 style="font-family: 'Noto Serif', serif; font-size: 18px; font-weight: 600; margin-bottom: 1rem;">Subscribe</h3>
                    <p style="font-size: 14px; color: rgba(255,255,255,0.8); margin-bottom: 1rem;">Get exclusive offers and updates.</p>
                    <div style="display: flex; gap: 0.5rem;">
                        <input type="email" placeholder="Your email" style="flex: 1; padding: 0.75rem; border: none; border-radius: 0.125rem; font-size: 14px;"/>
                        <button style="background-color: #944600; color: white; padding: 0.75rem 1rem; border: none; cursor: pointer; transition: background-color 0.3s; border-radius: 0.125rem;" onmouseover="this.style.backgroundColor='#fed7c0'; this.style.color='#3d2817'" onmouseout="this.style.backgroundColor='#944600'; this.style.color='white'">Subscribe</button>
                    </div>
                </div>
            </div>

            <!-- Bottom Bar -->
            <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem; text-align: center;">
                <p style="font-size: 14px; color: rgba(255,255,255,0.6);">
                    © 2024 Guru Teja Heritage Exports. All rights reserved.
                </p>
            </div>
        </div>
    `;
}

/**
 * Initialize all components
 */
function initializeComponents() {
    renderNavbar();
    renderFooter();
}

/**
 * Update navbar active state based on current page
 * @param {string} activePage - Current page name
 */
function updateNavbarActive(activePage) {
    const navLinks = document.querySelectorAll('a[data-page]');
    navLinks.forEach(link => {
        if (link.dataset.page === activePage) {
            link.style.borderBottomColor = '#944600';
            link.style.color = '#944600';
        } else {
            link.style.borderBottomColor = 'transparent';
            link.style.color = '#3d2817';
        }
    });
}

/**
 * Show loading state for async operations
 */
function showLoader() {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
    `;
    loader.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 0.5rem;">
            <p style="font-size: 14px; color: #3d2817; text-align: center;">Loading...</p>
        </div>
    `;
    document.body.appendChild(loader);
}

/**
 * Hide loading state
 */
function hideLoader() {
    const loader = document.getElementById('page-loader');
    if (loader) loader.remove();
}

/**
 * Scroll to element with smooth behavior
 * @param {string} elementId - Element ID to scroll to
 */
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
}

/**
 * Format currency value
 * @param {number} value - Currency value
 * @returns {string} Formatted currency string
 */
function formatCurrency(value) {
    return '$' + value.toLocaleString();
}

// Initialize components on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    initializeComponents();
});
