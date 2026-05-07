/**
 * HERITAGE RICE EXPORTS - CHECKOUT MODULE
 * Handles multi-step checkout process
 */

let checkoutState = {
    step: 1, // 1: Shipping, 2: Payment, 3: Review, 4: Complete
    shippingInfo: {
        fullName: '',
        email: '',
        company: '',
        address: '',
        city: '',
        country: '',
        postalCode: '',
        phone: ''
    },
    paymentInfo: {
        method: 'bank-transfer', // bank-transfer, letter-of-credit, card
        accountName: '',
        bankName: '',
        accountNumber: '',
        lcIssuer: ''
    },
    orderId: null
};

// Initialize checkout
function initializeCheckout() {
    const saved = localStorage.getItem('heritage_rice_checkout');
    if (saved) {
        checkoutState = JSON.parse(saved);
    }
}

// Move to next checkout step
function nextCheckoutStep() {
    if (validateCurrentStep()) {
        checkoutState.step += 1;
        saveCheckoutState();
        renderCheckoutPage();
    }
}

// Move to previous checkout step
function previousCheckoutStep() {
    if (checkoutState.step > 1) {
        checkoutState.step -= 1;
        saveCheckoutState();
        renderCheckoutPage();
    }
}

// Validate current step
function validateCurrentStep() {
    const form = document.querySelector('form');
    if (!form) return true;
    
    const inputs = form.querySelectorAll('[required]');
    for (let input of inputs) {
        if (!input.value.trim()) {
            showNotification(`Please fill in all required fields`, 'error');
            return false;
        }
        if (input.type === 'email' && !isValidEmail(input.value)) {
            showNotification('Please enter a valid email address', 'error');
            return false;
        }
    }
    return true;
}

// Validate email
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Save checkout state
function saveCheckoutState() {
    localStorage.setItem('heritage_rice_checkout', JSON.stringify(checkoutState));
}

// Complete checkout and create order
function completeCheckout() {
    if (!validateCurrentStep()) return;

    // Create order object
    const order = {
        id: generateOrderId(),
        date: new Date().toISOString(),
        status: 'pending',
        shipping: checkoutState.shippingInfo,
        payment: checkoutState.paymentInfo,
        items: cartState.items,
        subtotal: cartState.subtotal,
        discount: cartState.discount,
        shipping: cartState.shippingCost,
        total: cartState.total,
        promoCode: cartState.promoCode
    };

    // Save order
    saveOrder(order);
    checkoutState.orderId = order.id;
    saveCheckoutState();

    // Clear cart
    clearCart();

    // Navigate to success page
    setTimeout(() => {
        navigateTo('order-success', order.id);
    }, 500);
}

// Generate unique order ID
function generateOrderId() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `GTJ-${timestamp}-${random}`;
}

// Save order to localStorage
function saveOrder(order) {
    let orders = JSON.parse(localStorage.getItem('heritage_rice_orders') || '[]');
    orders.push(order);
    localStorage.setItem('heritage_rice_orders', JSON.stringify(orders));
}

// Get order by ID
function getOrderById(orderId) {
    const orders = JSON.parse(localStorage.getItem('heritage_rice_orders') || '[]');
    return orders.find(order => order.id === orderId);
}

// Render checkout page with current step
function renderCheckoutPage() {
    calculateCartTotals();

    let stepContent = '';

    if (checkoutState.step === 1) {
        stepContent = renderShippingStep();
    } else if (checkoutState.step === 2) {
        stepContent = renderPaymentStep();
    } else if (checkoutState.step === 3) {
        stepContent = renderReviewStep();
    } else if (checkoutState.step === 4) {
        stepContent = renderConfirmationStep();
    }

    const checkoutHTML = `
        <h1 class="font-display-lg text-display-lg text-primary mb-8">Checkout</h1>
        
        <!-- Progress Indicator -->
        <div class="flex justify-between mb-12">
            ${[1, 2, 3, 4].map(step => `
                <div class="flex-1 text-center">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                        checkoutState.step >= step ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-500'
                    }">
                        ${step}
                    </div>
                    <p class="font-label-caps text-[12px] ${checkoutState.step >= step ? 'text-primary' : 'text-neutral-400'}">
                        ${['Shipping', 'Payment', 'Review', 'Confirm'][step - 1]}
                    </p>
                </div>
            `).join('')}
        </div>

        ${stepContent}
    `;

    const checkoutPage = document.getElementById('checkout-page');
    if (checkoutPage) {
        checkoutPage.innerHTML = checkoutHTML;
    }
}

// Render shipping information step
function renderShippingStep() {
    return `
        <div class="grid grid-cols-3 gap-12">
            <div class="col-span-2">
                <h2 class="font-headline-md text-headline-md text-primary mb-6">Shipping Information</h2>
                <form class="space-y-6" onsubmit="event.preventDefault(); nextCheckoutStep();">
                    <div>
                        <label class="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2 block">Full Name *</label>
                        <input type="text" required value="${checkoutState.shippingInfo.fullName}" 
                            onchange="checkoutState.shippingInfo.fullName = this.value"
                            class="w-full border border-neutral-300 px-4 py-3 font-body-md focus:ring-primary"/>
                    </div>

                    <div class="grid grid-cols-2 gap-6">
                        <div>
                            <label class="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2 block">Email *</label>
                            <input type="email" required value="${checkoutState.shippingInfo.email}"
                                onchange="checkoutState.shippingInfo.email = this.value"
                                class="w-full border border-neutral-300 px-4 py-3 font-body-md focus:ring-primary"/>
                        </div>
                        <div>
                            <label class="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2 block">Phone *</label>
                            <input type="tel" required value="${checkoutState.shippingInfo.phone}"
                                onchange="checkoutState.shippingInfo.phone = this.value"
                                class="w-full border border-neutral-300 px-4 py-3 font-body-md focus:ring-primary"/>
                        </div>
                    </div>

                    <div>
                        <label class="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2 block">Company Name *</label>
                        <input type="text" required value="${checkoutState.shippingInfo.company}"
                            onchange="checkoutState.shippingInfo.company = this.value"
                            class="w-full border border-neutral-300 px-4 py-3 font-body-md focus:ring-primary"/>
                    </div>

                    <div>
                        <label class="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2 block">Address *</label>
                        <input type="text" required value="${checkoutState.shippingInfo.address}"
                            onchange="checkoutState.shippingInfo.address = this.value"
                            class="w-full border border-neutral-300 px-4 py-3 font-body-md focus:ring-primary"/>
                    </div>

                    <div class="grid grid-cols-3 gap-6">
                        <div>
                            <label class="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2 block">City *</label>
                            <input type="text" required value="${checkoutState.shippingInfo.city}"
                                onchange="checkoutState.shippingInfo.city = this.value"
                                class="w-full border border-neutral-300 px-4 py-3 font-body-md focus:ring-primary"/>
                        </div>
                        <div>
                            <label class="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2 block">Country *</label>
                            <input type="text" required value="${checkoutState.shippingInfo.country}"
                                onchange="checkoutState.shippingInfo.country = this.value"
                                class="w-full border border-neutral-300 px-4 py-3 font-body-md focus:ring-primary"/>
                        </div>
                        <div>
                            <label class="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2 block">Postal Code</label>
                            <input type="text" value="${checkoutState.shippingInfo.postalCode}"
                                onchange="checkoutState.shippingInfo.postalCode = this.value"
                                class="w-full border border-neutral-300 px-4 py-3 font-body-md focus:ring-primary"/>
                        </div>
                    </div>

                    <div class="flex gap-4 pt-6">
                        <button type="button" class="flex-1 border border-primary text-primary py-3 font-button" onclick="navigateTo('cart')">
                            Back to Cart
                        </button>
                        <button type="submit" class="flex-1 bg-primary text-on-primary py-3 font-button uppercase">
                            Continue to Payment
                        </button>
                    </div>
                </form>
            </div>

            <!-- Order Summary -->
            <div class="bg-surface-container p-8 rounded-lg h-fit sticky top-32">
                <h3 class="font-headline-md text-headline-md text-primary mb-6">Order Summary</h3>
                <div class="space-y-4 mb-6 border-b pb-4">
                    ${cartState.items.map(item => `
                        <div class="flex justify-between font-body-md">
                            <span>${item.name} × ${item.quantity}</span>
                            <span>$${(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="space-y-2 mb-4 pb-4 border-b">
                    <div class="flex justify-between"><span>Subtotal</span><span>$${cartState.subtotal.toLocaleString()}</span></div>
                    ${cartState.discount > 0 ? `<div class="flex justify-between text-secondary"><span>Discount</span><span>-$${cartState.discount.toLocaleString()}</span></div>` : ''}
                    <div class="flex justify-between"><span>Shipping</span><span>$${cartState.shippingCost.toLocaleString()}</span></div>
                </div>
                <div class="flex justify-between font-display-lg text-secondary">
                    <span>Total</span>
                    <span>$${cartState.total.toLocaleString()}</span>
                </div>
            </div>
        </div>
    `;
}

// Render payment information step
function renderPaymentStep() {
    return `
        <div class="grid grid-cols-3 gap-12">
            <div class="col-span-2">
                <h2 class="font-headline-md text-headline-md text-primary mb-6">Payment Method</h2>
                <form class="space-y-6" onsubmit="event.preventDefault(); nextCheckoutStep();">
                    
                    <!-- Payment Method Selection -->
                    <div class="space-y-4">
                        <label class="border border-neutral-300 p-4 rounded cursor-pointer hover:bg-neutral-50 flex items-center">
                            <input type="radio" name="paymentMethod" value="bank-transfer" 
                                ${checkoutState.paymentInfo.method === 'bank-transfer' ? 'checked' : ''}
                                onchange="checkoutState.paymentInfo.method = 'bank-transfer'; renderCheckoutPage();"
                                class="mr-4"/>
                            <span class="font-body-md">Bank Transfer (T/T)</span>
                        </label>
                        <label class="border border-neutral-300 p-4 rounded cursor-pointer hover:bg-neutral-50 flex items-center">
                            <input type="radio" name="paymentMethod" value="letter-of-credit"
                                ${checkoutState.paymentInfo.method === 'letter-of-credit' ? 'checked' : ''}
                                onchange="checkoutState.paymentInfo.method = 'letter-of-credit'; renderCheckoutPage();"
                                class="mr-4"/>
                            <span class="font-body-md">Letter of Credit (L/C)</span>
                        </label>
                    </div>

                    ${checkoutState.paymentInfo.method === 'bank-transfer' ? `
                        <div class="bg-neutral-50 p-6 rounded space-y-4">
                            <p class="font-body-md text-on-surface-variant">50% advance payment required. Bank details will be sent after order confirmation.</p>
                            <div>
                                <label class="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2 block">Payor Name *</label>
                                <input type="text" required value="${checkoutState.paymentInfo.accountName}"
                                    onchange="checkoutState.paymentInfo.accountName = this.value"
                                    class="w-full border border-neutral-300 px-4 py-3 font-body-md focus:ring-primary"/>
                            </div>
                        </div>
                    ` : ''}

                    ${checkoutState.paymentInfo.method === 'letter-of-credit' ? `
                        <div class="bg-neutral-50 p-6 rounded space-y-4">
                            <div>
                                <label class="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2 block">L/C Issuing Bank *</label>
                                <input type="text" required value="${checkoutState.paymentInfo.lcIssuer}"
                                    onchange="checkoutState.paymentInfo.lcIssuer = this.value"
                                    class="w-full border border-neutral-300 px-4 py-3 font-body-md focus:ring-primary"
                                    placeholder="Bank name and country"/>
                            </div>
                            <p class="font-body-md text-on-surface-variant">L/C documents will be processed upon order confirmation.</p>
                        </div>
                    ` : ''}

                    <div class="flex gap-4 pt-6">
                        <button type="button" class="flex-1 border border-primary text-primary py-3 font-button" onclick="previousCheckoutStep()">
                            Back
                        </button>
                        <button type="submit" class="flex-1 bg-primary text-on-primary py-3 font-button uppercase">
                            Review Order
                        </button>
                    </div>
                </form>
            </div>

            <!-- Order Summary -->
            <div class="bg-surface-container p-8 rounded-lg h-fit sticky top-32">
                <h3 class="font-headline-md text-headline-md text-primary mb-6">Order Summary</h3>
                <div class="space-y-2 mb-4 pb-4 border-b">
                    <div class="flex justify-between"><span>Subtotal</span><span>$${cartState.subtotal.toLocaleString()}</span></div>
                    ${cartState.discount > 0 ? `<div class="flex justify-between text-secondary"><span>Discount</span><span>-$${cartState.discount.toLocaleString()}</span></div>` : ''}
                    <div class="flex justify-between"><span>Shipping</span><span>$${cartState.shippingCost.toLocaleString()}</span></div>
                </div>
                <div class="flex justify-between font-display-lg text-secondary">
                    <span>Total</span>
                    <span>$${cartState.total.toLocaleString()}</span>
                </div>
            </div>
        </div>
    `;
}

// Render review step
function renderReviewStep() {
    return `
        <div class="grid grid-cols-3 gap-12">
            <div class="col-span-2 space-y-6">
                <!-- Shipping Review -->
                <div class="border border-neutral-200 p-6 rounded">
                    <h3 class="font-headline-md text-headline-md text-primary mb-4">Shipping Address</h3>
                    <div class="font-body-md text-on-surface">
                        <p>${checkoutState.shippingInfo.fullName}</p>
                        <p>${checkoutState.shippingInfo.company}</p>
                        <p>${checkoutState.shippingInfo.address}</p>
                        <p>${checkoutState.shippingInfo.city}, ${checkoutState.shippingInfo.country} ${checkoutState.shippingInfo.postalCode}</p>
                        <p>${checkoutState.shippingInfo.email}</p>
                        <p>${checkoutState.shippingInfo.phone}</p>
                    </div>
                    <button class="text-primary font-button mt-4 hover:underline" onclick="checkoutState.step = 1; renderCheckoutPage();">Edit</button>
                </div>

                <!-- Payment Review -->
                <div class="border border-neutral-200 p-6 rounded">
                    <h3 class="font-headline-md text-headline-md text-primary mb-4">Payment Method</h3>
                    <div class="font-body-md text-on-surface">
                        <p>${checkoutState.paymentInfo.method === 'bank-transfer' ? 'Bank Transfer (T/T)' : 'Letter of Credit (L/C)'}</p>
                    </div>
                    <button class="text-primary font-button mt-4 hover:underline" onclick="checkoutState.step = 2; renderCheckoutPage();">Edit</button>
                </div>

                <!-- Order Items -->
                <div class="border border-neutral-200 p-6 rounded">
                    <h3 class="font-headline-md text-headline-md text-primary mb-4">Order Items</h3>
                    <div class="space-y-3">
                        ${cartState.items.map(item => `
                            <div class="flex justify-between font-body-md pb-3 border-b">
                                <span>${item.name} × ${item.quantity} MT</span>
                                <span>$${(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="flex gap-4">
                    <button class="flex-1 border border-primary text-primary py-3 font-button" onclick="previousCheckoutStep()">
                        Back
                    </button>
                    <button class="flex-1 bg-primary text-on-primary py-3 font-button uppercase" onclick="completeCheckout()">
                        Place Order
                    </button>
                </div>
            </div>

            <!-- Summary -->
            <div class="bg-surface-container p-8 rounded-lg h-fit sticky top-32">
                <h3 class="font-headline-md text-headline-md text-primary mb-6">Order Summary</h3>
                <div class="space-y-2 mb-4 pb-4 border-b">
                    <div class="flex justify-between"><span>Subtotal</span><span>$${cartState.subtotal.toLocaleString()}</span></div>
                    ${cartState.discount > 0 ? `<div class="flex justify-between text-secondary"><span>Discount</span><span>-$${cartState.discount.toLocaleString()}</span></div>` : ''}
                    <div class="flex justify-between"><span>Shipping</span><span>$${cartState.shippingCost.toLocaleString()}</span></div>
                </div>
                <div class="flex justify-between font-display-lg text-secondary">
                    <span>Total</span>
                    <span>$${cartState.total.toLocaleString()}</span>
                </div>
            </div>
        </div>
    `;
}

// Render confirmation (step 4)
function renderConfirmationStep() {
    return `<div class="text-center py-12">Loading...</div>`;
}

// Render order success page
function renderOrderSuccessPage(orderId) {
    const order = getOrderById(orderId);
    if (!order) {
        return `
            <div class="text-center py-24">
                <h1 class="font-display-lg text-display-lg text-primary mb-4">Order Not Found</h1>
                <button class="bg-primary text-on-primary px-8 py-4 font-button" onclick="navigateTo('catalog')">
                    Back to Catalog
                </button>
            </div>
        `;
    }

    return `
        <div class="max-w-2xl mx-auto text-center space-y-12">
            <!-- Success Icon -->
            <div>
                <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span class="material-symbols-outlined text-4xl text-green-600">check_circle</span>
                </div>
            </div>

            <!-- Success Message -->
            <div>
                <h1 class="font-display-lg text-display-lg text-primary mb-4">Order Confirmed!</h1>
                <p class="font-body-lg text-on-surface-variant mb-2">Your order has been successfully placed.</p>
                <p class="font-body-md text-on-surface-variant">Order ID: <span class="font-bold">${order.id}</span></p>
            </div>

            <!-- Order Summary -->
            <div class="bg-surface-container p-8 rounded-xl text-left">
                <h2 class="font-headline-md text-headline-md text-primary mb-6">Order Summary</h2>
                
                <div class="space-y-4 mb-6 pb-6 border-b">
                    <div class="flex justify-between">
                        <span class="font-body-md text-on-surface-variant">Shipping To:</span>
                        <span class="font-body-md text-primary">${order.shipping.company}, ${order.shipping.country}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-body-md text-on-surface-variant">Ordered On:</span>
                        <span class="font-body-md text-primary">${new Date(order.date).toLocaleDateString()}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-body-md text-on-surface-variant">Status:</span>
                        <span class="font-body-md text-primary uppercase bg-yellow-100 px-3 py-1 rounded">Pending</span>
                    </div>
                </div>

                <div class="space-y-3">
                    ${order.items.map(item => `
                        <div class="flex justify-between">
                            <span class="font-body-md">${item.name}</span>
                            <span class="font-body-md">${item.quantity} MT @ $${item.price.toLocaleString()}</span>
                        </div>
                    `).join('')}
                </div>

                <div class="mt-6 pt-6 border-t space-y-2">
                    <div class="flex justify-between font-body-md">
                        <span>Subtotal:</span>
                        <span>$${order.subtotal.toLocaleString()}</span>
                    </div>
                    ${order.discount > 0 ? `
                        <div class="flex justify-between font-body-md text-secondary">
                            <span>Discount:</span>
                            <span>-$${order.discount.toLocaleString()}</span>
                        </div>
                    ` : ''}
                    <div class="flex justify-between font-body-md">
                        <span>Shipping:</span>
                        <span>$${order.shipping_cost ? order.shipping_cost.toLocaleString() : (order.shippingCost || 0).toLocaleString()}</span>
                    </div>
                    <div class="flex justify-between font-display-lg text-secondary">
                        <span>Total:</span>
                        <span>$${order.total.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <!-- Next Steps -->
            <div class="bg-neutral-50 p-8 rounded-xl">
                <h3 class="font-headline-md text-headline-md text-primary mb-4">What's Next?</h3>
                <div class="space-y-3 text-left">
                    <div class="flex gap-4">
                        <span class="text-2xl">📧</span>
                        <div>
                            <p class="font-body-md text-primary font-semibold">Confirmation Email</p>
                            <p class="font-body-md text-on-surface-variant">We've sent order details to ${order.shipping.email}</p>
                        </div>
                    </div>
                    <div class="flex gap-4">
                        <span class="text-2xl">💰</span>
                        <div>
                            <p class="font-body-md text-primary font-semibold">Payment Details</p>
                            <p class="font-body-md text-on-surface-variant">Bank details will be shared for ${order.payment.method === 'bank-transfer' ? 'T/T payment' : 'L/C processing'}</p>
                        </div>
                    </div>
                    <div class="flex gap-4">
                        <span class="text-2xl">📦</span>
                        <div>
                            <p class="font-body-md text-primary font-semibold">Shipment Tracking</p>
                            <p class="font-body-md text-on-surface-variant">Track your order in the dashboard once it ships</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3">
                <button class="w-full bg-primary text-on-primary py-4 font-button uppercase hover:bg-neutral-800 transition" onclick="navigateTo('export-tracking')">
                    View Order Status
                </button>
                <button class="w-full border-2 border-primary text-primary py-4 font-button uppercase hover:bg-primary hover:text-white transition" onclick="navigateTo('catalog')">
                    Continue Shopping
                </button>
            </div>
        </div>
    `;
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCheckout);
} else {
    initializeCheckout();
}
