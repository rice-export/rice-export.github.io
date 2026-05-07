/**
 * HERITAGE RICE EXPORTS - WISHLIST MODULE
 * Manages user's saved selections
 */

let wishlistState = {
    items: []
};

// Initialize wishlist from localStorage
function initializeWishlist() {
    const saved = localStorage.getItem('heritage_rice_wishlist');
    if (saved) {
        wishlistState = JSON.parse(saved);
    }
}

// Add item to wishlist
function addToWishlist(productId) {
    const product = getProductById(productId);
    if (!product) return false;

    if (!wishlistState.items.find(item => item.id === productId)) {
        wishlistState.items.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            addedDate: new Date().toISOString()
        });
        saveWishlist();
        showNotification(`${product.name} added to wishlist!`, 'success');
        return true;
    }
    return false;
}

// Remove item from wishlist
function removeFromWishlist(productId) {
    wishlistState.items = wishlistState.items.filter(item => item.id !== productId);
    saveWishlist();
    renderWishlistPage();
    showNotification('Item removed from wishlist', 'info');
}

// Check if item is in wishlist
function isInWishlist(productId) {
    return wishlistState.items.some(item => item.id === productId);
}

// Save wishlist to localStorage
function saveWishlist() {
    localStorage.setItem('heritage_rice_wishlist', JSON.stringify(wishlistState));
    
    // Update navbar badge
    const wishlistCount = document.querySelector('[data-wishlist-count]');
    if (wishlistCount) {
        wishlistCount.textContent = getWishlistCount();
    }
    
    // Re-render navbar
    if (typeof renderNavbar === 'function') {
        renderNavbar();
    }
}

// Get wishlist count
function getWishlistCount() {
    return wishlistState.items.length;
}

// Render wishlist page
function renderWishlistPage() {
    const wishlistPage = document.getElementById('wishlist-page');
    if (!wishlistPage) return;

    if (wishlistState.items.length === 0) {
        wishlistPage.innerHTML = `
            <div style="padding: 40px 2rem; max-width: 1280px; margin: 0 auto;">
                <h1 style="font-family: 'Noto Serif', serif; font-size: 36px; font-weight: 700; color: #3d2817; margin-bottom: 3rem;">Saved Selections</h1>
                <div style="text-align: center; py-24;">
                    <span class="material-symbols-outlined" style="font-size: 64px; color: #d9d5d1; display: block; margin-bottom: 1rem;">favorite</span>
                    <p style="font-size: 18px; color: #6b5147; margin-bottom: 2rem;">No items in your wishlist yet</p>
                    <button style="background-color: #944600; color: white; padding: 1rem 2rem; font-size: 14px; font-weight: 600; text-transform: uppercase; border: none; cursor: pointer; border-radius: 0.125rem; transition: all 0.3s;" onclick="navigateTo('catalog')" onmouseover="this.style.backgroundColor='#6b3300'" onmouseout="this.style.backgroundColor='#944600'">
                        Browse Products
                    </button>
                </div>
            </div>
        `;
    }
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWishlist);
} else {
    initializeWishlist();
}
