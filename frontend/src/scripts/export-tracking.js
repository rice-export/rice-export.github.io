// Order Tracking page

document.addEventListener('DOMContentLoaded', async () => {
  initializeNavigation();

  const orderId = new URLSearchParams(window.location.search).get('id');

  if (!orderId) {
    window.location.href = '/pages/catalog.html';
    return;
  }

  await loadOrderDetails(orderId);
});

async function loadOrderDetails(orderId) {
  try {
    showSpinner();

    const response = await window.apiClient.request(`/api/orders/${orderId}`, 'GET');

    if (!response.success) {
      throw new Error('Order not found');
    }

    displayOrderDetails(response.data);
  } catch (error) {
    console.error('Error loading order:', error);
    window.showNotification('Order not found', 'error');
    setTimeout(() => window.location.href = '/', 2000);
  } finally {
    hideSpinner();
  }
}

function displayOrderDetails(order) {
  // Order header
  document.getElementById('order-number').textContent = order.orderNumber;
  document.getElementById('order-status').textContent = order.status;
  document.getElementById('order-status').className = `text-2xl font-bold ${getStatusColor(order.status)}`;
  document.getElementById('order-date').textContent = new Date(order.createdAt).toLocaleDateString();

  // Order items
  const itemsContainer = document.getElementById('order-items');
  itemsContainer.innerHTML = order.items.map(item => `
    <div class="flex justify-between py-3 border-b">
      <div>
        <p class="font-semibold">${item.product?.name || 'Product'}</p>
        <p class="text-gray-600 text-sm">₹${window.formatPrice(item.price)} × ${item.quantity}</p>
      </div>
      <p class="font-semibold">₹${window.formatPrice(item.price * item.quantity)}</p>
    </div>
  `).join('');

  // Order summary
  document.getElementById('subtotal').textContent = `₹${window.formatPrice(order.subtotal)}`;
  document.getElementById('tax').textContent = `₹${window.formatPrice(order.tax)}`;
  document.getElementById('shipping').textContent = `₹${window.formatPrice(order.shippingCost)}`;
  document.getElementById('total').textContent = `₹${window.formatPrice(order.total)}`;

  // Shipping address
  const addr = order.shippingAddress;
  document.getElementById('shipping-address').innerHTML = `
    <p>${addr.fullname}</p>
    <p>${addr.street}</p>
    <p>${addr.city}, ${addr.state} ${addr.pincode}</p>
    <p>${addr.phone}</p>
  `;

  // Timeline
  displayTimeline(order.timeline);

  // Return/Feedback options
  if (order.status === 'Delivered') {
    document.getElementById('return-section').style.display = 'block';
    if (!order.feedback) {
      document.getElementById('feedback-section').style.display = 'block';
    }
  }

  // Map or delivery partner info
  if (order.deliveryPartner) {
    displayDeliveryPartner(order.deliveryPartner);
  }
}

function displayTimeline(timeline) {
  const timelineContainer = document.getElementById('order-timeline');

  timelineContainer.innerHTML = timeline.map((event, index) => `
    <div class="flex gap-4 pb-8 ${index === timeline.length - 1 ? '' : 'border-l-2 border-gray-300 ml-5'}">
      <div class="flex flex-col items-center">
        <div class="w-4 h-4 bg-green-600 rounded-full"></div>
      </div>
      <div>
        <h3 class="font-semibold">${event.status}</h3>
        <p class="text-gray-600 text-sm">${new Date(event.timestamp).toLocaleString()}</p>
        <p class="text-gray-700 mt-1">${event.message}</p>
      </div>
    </div>
  `).join('');
}

function displayDeliveryPartner(partner) {
  const section = document.getElementById('delivery-partner-section');
  section.innerHTML = `
    <h3 class="font-semibold mb-3">Delivery Partner</h3>
    <div class="p-4 bg-gray-50 rounded">
      <p><strong>Name:</strong> ${partner.name}</p>
      <p><strong>Phone:</strong> ${partner.phone}</p>
      <p><strong>Vehicle:</strong> ${partner.vehicle}</p>
    </div>
  `;
  section.style.display = 'block';
}

async function requestReturn() {
  const reason = prompt('Please enter your reason for return:');

  if (!reason) return;

  try {
    showSpinner();
    const orderId = new URLSearchParams(window.location.search).get('id');

    const response = await window.apiClient.request(`/api/orders/${orderId}/return`, 'POST', { reason });

    if (response.success) {
      window.showNotification('Return request submitted!', 'success');
      document.getElementById('return-section').style.display = 'none';
      displayOrderDetails(response.data);
    }
  } catch (error) {
    window.handleApiError(error);
  } finally {
    hideSpinner();
  }
}

async function addFeedback() {
  const rating = document.getElementById('feedback-rating').value;
  const comment = document.getElementById('feedback-comment').value;

  if (!rating) {
    window.showNotification('Please select a rating', 'error');
    return;
  }

  try {
    showSpinner();
    const orderId = new URLSearchParams(window.location.search).get('id');

    const response = await window.apiClient.request(`/api/orders/${orderId}/feedback`, 'POST', { rating, comment });

    if (response.success) {
      window.showNotification('Thank you for your feedback!', 'success');
      document.getElementById('feedback-section').style.display = 'none';
      displayOrderDetails(response.data);
    }
  } catch (error) {
    window.handleApiError(error);
  } finally {
    hideSpinner();
  }
}

function getStatusColor(status) {
  const colors = {
    'Placed': 'text-blue-600',
    'Confirmed': 'text-yellow-600',
    'Processing': 'text-purple-600',
    'Shipped': 'text-indigo-600',
    'Delivered': 'text-green-600',
    'Cancelled': 'text-red-600',
    'Returned': 'text-gray-600'
  };
  return colors[status] || 'text-gray-600';
}

function showSpinner() {
  const spinner = document.getElementById('loading-spinner');
  if (spinner) spinner.style.display = 'block';
}

function hideSpinner() {
  const spinner = document.getElementById('loading-spinner');
  if (spinner) spinner.style.display = 'none';
}
