// Checkout page

let cart = null;
let userProfile = null;

document.addEventListener('DOMContentLoaded', async () => {
  initializeNavigation();

  if (!window.isAuthenticated()) {
    window.requireAuth();
    return;
  }

  await loadCart();
  await loadUserProfile();
  setupEventListeners();
});

async function loadCart() {
  try {
    showSpinner();
    const response = await window.apiClient.getCart();

    if (!response.success) {
      throw new Error('Failed to load cart');
    }

    cart = response.data;

    if (!cart.items || cart.items.length === 0) {
      document.getElementById('checkout-container').innerHTML = `
        <div class="text-center py-12">
          <p class="text-lg text-gray-600 mb-4">Your cart is empty</p>
          <a href="/pages/catalog.html" class="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            Continue Shopping
          </a>
        </div>
      `;
      return;
    }

    displayCartItems();
    displayOrderSummary();
  } catch (error) {
    console.error('Error loading cart:', error);
    window.showNotification('Error loading cart', 'error');
  } finally {
    hideSpinner();
  }
}

async function loadUserProfile() {
  try {
    const response = await window.apiClient.getCurrentUser();

    if (response.success) {
      userProfile = response.data;
      prefillAddressForm();
    }
  } catch (error) {
    console.error('Error loading profile:', error);
  }
}

function displayCartItems() {
  const itemsContainer = document.getElementById('cart-items');

  itemsContainer.innerHTML = cart.items.map(item => `
    <div class="flex items-center justify-between py-3 border-b">
      <div class="flex items-center gap-4 flex-1">
        <img src="${item.product?.images?.[0] || 'https://via.placeholder.com/80'}" 
             alt="${item.product?.name}"
             class="w-20 h-20 object-cover rounded">
        <div>
          <h3 class="font-semibold">${item.product?.name}</h3>
          <p class="text-gray-600 text-sm">₹${window.formatPrice(item.product?.price)}</p>
        </div>
      </div>
      <div class="text-right">
        <p class="font-semibold">${item.quantity}x</p>
        <p class="text-gray-600">₹${window.formatPrice(item.product?.price * item.quantity)}</p>
      </div>
    </div>
  `).join('');
}

function displayOrderSummary() {
  const subtotal = cart.items.reduce((sum, item) => sum + (item.product?.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = subtotal + tax;

  document.getElementById('subtotal').textContent = `₹${window.formatPrice(subtotal)}`;
  document.getElementById('tax').textContent = `₹${window.formatPrice(tax)}`;
  document.getElementById('total').textContent = `₹${window.formatPrice(total)}`;
}

function prefillAddressForm() {
  if (userProfile?.address) {
    const { address } = userProfile;
    document.getElementById('fullname').value = userProfile.name || '';
    document.getElementById('phone').value = userProfile.phone || '';
    document.getElementById('email').value = userProfile.email || '';
    if (address.street) document.getElementById('address').value = address.street;
    if (address.city) document.getElementById('city').value = address.city;
    if (address.state) document.getElementById('state').value = address.state;
    if (address.pincode) document.getElementById('pincode').value = address.pincode;
  }
}

function setupEventListeners() {
  // Validate pincode
  document.getElementById('pincode')?.addEventListener('change', validatePincode);

  // Place order
  document.getElementById('place-order-btn')?.addEventListener('click', placeOrder);
}

async function validatePincode() {
  const pincode = document.getElementById('pincode').value.trim();

  if (!pincode || pincode.length !== 6 || isNaN(pincode)) {
    window.showNotification('Please enter a valid 6-digit pincode', 'error');
    return;
  }

  // Check delivery availability
  try {
    const productId = cart.items[0]?.product?._id;
    if (productId) {
      const response = await window.apiClient.checkAvailability(productId, pincode);
      if (response.available) {
        window.showNotification(`Available! Estimated delivery: ${new Date(response.estimatedDelivery).toLocaleDateString()}`, 'success');
      } else {
        window.showNotification('Not available in this area', 'error');
      }
    }
  } catch (error) {
    console.error('Error checking availability:', error);
  }
}

async function placeOrder() {
  try {
    // Validate form
    const fullname = document.getElementById('fullname').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim();
    const pincode = document.getElementById('pincode').value.trim();
    const paymentMethod = document.getElementById('payment-method').value;

    if (!fullname || !phone || !email || !address || !city || !state || !pincode) {
      window.showNotification('Please fill all required fields', 'error');
      return;
    }

    showSpinner();

    // Create order
    const shippingAddress = {
      fullname,
      phone,
      email,
      street: address,
      city,
      state,
      pincode
    };

    const response = await window.apiClient.createOrder(shippingAddress, paymentMethod);

    if (!response.success) {
      throw new Error(response.message);
    }

    const order = response.data;
    window.showNotification('Order placed successfully!', 'success');

    // Proceed to payment or confirmation
    if (paymentMethod === 'cod') {
      setTimeout(() => {
        window.location.href = `/pages/order-tracking.html?id=${order._id}`;
      }, 2000);
    } else {
      // Initiate payment
      await initiatePayment(order._id, paymentMethod);
    }
  } catch (error) {
    window.handleApiError(error);
  } finally {
    hideSpinner();
  }
}

async function initiatePayment(orderId, paymentMethod) {
  try {
    showSpinner();

    const response = await window.apiClient.initiatePayment(orderId, paymentMethod);

    if (response.success) {
      if (paymentMethod === 'stripe') {
        // Redirect to Stripe checkout
        window.showNotification('Redirecting to payment...', 'info');
        // In production, integrate with Stripe SDK
      } else if (paymentMethod === 'upi') {
        // Show UPI options
        window.showNotification('UPI payment initiated', 'info');
      }

      setTimeout(() => {
        window.location.href = `/pages/order-tracking.html?id=${orderId}`;
      }, 3000);
    }
  } catch (error) {
    window.handleApiError(error);
  } finally {
    hideSpinner();
  }
}

function showSpinner() {
  const spinner = document.getElementById('loading-spinner');
  if (spinner) spinner.style.display = 'block';
}

function hideSpinner() {
  const spinner = document.getElementById('loading-spinner');
  if (spinner) spinner.style.display = 'none';
}
