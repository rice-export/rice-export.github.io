/**
 * HERITAGE RICE EXPORTS - SHOPPING CART MODULE
 * Manages cart state, item operations, and calculations
 */

let cartState = {
    items: [],
    subtotal: 0,
    total: 0,
    shippingCost: 0,
    taxRate: 0.08,
    promoCode: null,
    discount: 0
};

// Initialize cart from localStorage
function initializeCart() {
    const saved = localStorage.getItem('heritage_rice_cart');
    if (saved) {
        cartState = JSON.parse(saved);
    }
    updateCartDisplay();
}

// Add item to cart
function addToCart(productId, quantity = 1) {
    const product = getProductById(productId);
    if (!product) return false;

    const existingItem = cartState.items.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cartState.items.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image
        });
    }
    
    saveCart();
    updateCartDisplay();
    showNotification(`${product.name} added to cart!`, 'success');
    return true;
}

// Remove item from cart
function removeFromCart(productId) {
    cartState.items = cartState.items.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
}

// Update item quantity
function updateCartItemQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cartState.items.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        updateCartDisplay();
    }
}

// Calculate cart totals
function calculateCartTotals() {
    cartState.subtotal = cartState.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);

    // Calculate discount
    cartState.discount = 0;
    if (cartState.promoCode) {
        const promoDiscount = getPromoCodeDiscount(cartState.promoCode);
        if (promoDiscount) {
            cartState.discount = cartState.subtotal * (promoDiscount / 100);
        }
    }

    // Estimate shipping (simplified)
    cartState.shippingCost = calculateShipping();

    // Calculate total (simplified - no tax for B2B)
    cartState.total = cartState.subtotal - cartState.discount + cartState.shippingCost;
}

// Calculate shipping based on location and weight
function calculateShipping() {
    if (cartState.items.length === 0) return 0;
    
    // Simplified shipping calculation
    // In production, would use real shipping calculator
    const totalWeight = cartState.items.reduce((sum, item) => {
        return sum + (item.quantity * 50); // Assume 50kg bags
    }, 0);

    // Base rate: $2 per tonne + handling fee
    const baseRate = (totalWeight / 1000) * 150 + 100;
    return Math.max(baseRate, 200); // Minimum $200
}

// Apply promo code
function applyPromoCode(code) {
    const discount = getPromoCodeDiscount(code);
    if (discount) {
        cartState.promoCode = code;
        calculateCartTotals();
        saveCart();
        updateCartDisplay();
        showNotification(`Promo code applied! ${discount}% discount`, 'success');
        return true;
    } else {
        showNotification('Invalid promo code', 'error');
        return false;
    }
}

// Get promo code discount percentage
function getPromoCodeDiscount(code) {
    const promoCodes = {
        'HERITAGE2024': 10,
        'BULK50': 15,
        'CORPORATE': 20,
        'HERITAGE10': 10,
        'HERITAGE-24': 12
    };
    return promoCodes[code.toUpperCase()] || null;
}

// Get cart item count
function getCartItemCount() {
    return cartState.items.reduce((count, item) => count + item.quantity, 0);
}

// Get cart total value
function getCartTotalValue() {
    calculateCartTotals();
    return cartState.total;
}

// Clear cart
function clearCart() {
    cartState.items = [];
    cartState.promoCode = null;
    cartState.discount = 0;
    saveCart();
    updateCartDisplay();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('heritage_rice_cart', JSON.stringify(cartState));
}

// Update cart display (UI)
function updateCartDisplay() {
    calculateCartTotals();
    
    // Update cart count in header
    const cartCount = document.querySelector('[data-cart-count]');
    if (cartCount) {
        cartCount.textContent = getCartItemCount();
    }

    // Update cart page if visible
    if (document.getElementById('cart-page')?.style.display !== 'none') {
        renderCartPage();
    }

    // Render navbar to update
    if (typeof renderNavbar === 'function') {
        renderNavbar();
    }
}

// Render cart page UI
function renderCartPage() {
    calculateCartTotals();

    const cartHTML = `
        <h1 class="font-display-lg text-display-lg text-primary mb-8">Your Cart</h1>
        ${cartState.items.length === 0 ? `
            <div class="text-center py-24">
                <span class="material-symbols-outlined text-6xl text-neutral-400 mb-4 block">shopping_cart</span>
                <p class="font-body-lg text-on-surface-variant mb-6">Your cart is empty</p>
                <button class="bg-primary text-on-primary px-8 py-4 font-button text-button uppercase" onclick="navigateTo('catalog')">
                    Continue Shopping
                </button>
            </div>
        ` : `
            <div class="grid grid-cols-3 gap-12">
                <!-- Items Column -->
                <div class="col-span-2 space-y-6">
                    ${cartState.items.map(item => `
                        <div class="border border-neutral-200 p-6 flex gap-6">
                            <img src="${item.image}" alt="${item.name}" class="w-24 h-24 object-cover rounded"/>
                            <div class="flex-1">
                                <h3 class="font-headline-md text-headline-md text-primary mb-2">${item.name}</h3>
                                <p class="font-body-md text-on-surface-variant mb-4">$${item.price.toLocaleString()} / MT</p>
                                <div class="flex items-center gap-4">
                                    <button class="border border-neutral-300 px-3 py-1 hover:bg-neutral-100" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">−</button>
                                    <span class="font-body-md">${item.quantity} MT</span>
                                    <button class="border border-neutral-300 px-3 py-1 hover:bg-neutral-100" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="font-headline-md text-primary mb-2">$${(item.price * item.quantity).toLocaleString()}</p>
                                <button class="text-error hover:text-red-700 font-button text-button" onclick="removeFromCart(${item.id})">Remove</button>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Summary Column -->
                <div class="bg-surface-container p-8 rounded-lg h-fit sticky top-32">
                    <h2 class="font-headline-md text-headline-md text-primary mb-6">Order Summary</h2>
                    
                    <div class="space-y-4 border-b pb-4 mb-4">
                        <div class="flex justify-between font-body-md">
                            <span>Subtotal</span>
                            <span>$${cartState.subtotal.toLocaleString()}</span>
                        </div>
                        ${cartState.discount > 0 ? `
                            <div class="flex justify-between font-body-md text-secondary">
                                <span>Discount (${cartState.promoCode})</span>
                                <span>-$${cartState.discount.toLocaleString()}</span>
                            </div>
                        ` : ''}
                        <div class="flex justify-between font-body-md">
                            <span>Shipping</span>
                            <span>$${cartState.shippingCost.toLocaleString()}</span>
                        </div>
                    </div>

                    <div class="flex justify-between font-display-lg text-secondary mb-6">
                        <span>Total</span>
                        <span>$${cartState.total.toLocaleString()}</span>
                    </div>

                    <!-- Promo Code -->
                    <div class="mb-6">
                        <div class="flex gap-2">
                            <input type="text" id="promoCodeInput" placeholder="Promo code" class="flex-1 border border-neutral-300 px-3 py-2 font-body-md" />
                            <button class="bg-neutral-800 text-white px-4 py-2 font-button" onclick="applyPromoCode(document.getElementById('promoCodeInput').value)">Apply</button>
                        </div>
                    </div>

                    <button class="w-full bg-primary text-on-primary py-4 font-button text-button uppercase mb-3" onclick="navigateTo('checkout')">
                        Proceed to Checkout
                    </button>
                    <button class="w-full border border-primary text-primary py-4 font-button text-button uppercase" onclick="navigateTo('catalog')">
                        Continue Shopping
                    </button>
                </div>
            </div>
        `}
    `;

    const cartPage = document.getElementById('cart-page');
    if (cartPage) {
        cartPage.innerHTML = cartHTML;
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create and show toast notification
    const toast = document.createElement('div');
    toast.className = `fixed top-20 right-8 p-4 rounded-lg ${
        type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    } text-white font-body-md z-50 animate-fade-in-out`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCart);
} else {
    initializeCart();
}
