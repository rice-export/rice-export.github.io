// Vendor Dashboard

let vendorData = null;

document.addEventListener('DOMContentLoaded', async () => {
  initializeNavigation();

  // Check if user is vendor
  if (!window.isAuthenticated() || localStorage.getItem('userRole') !== 'vendor') {
    window.location.href = '/pages/auth.html';
    return;
  }

  await loadVendorDashboard();
  setupEventListeners();
});

async function loadVendorDashboard() {
  try {
    showSpinner();

    const response = await window.apiClient.request('/api/vendors/me/dashboard', 'GET');

    if (!response.success) {
      throw new Error('Failed to load vendor dashboard');
    }

    vendorData = response.data;
    displayDashboard();
  } catch (error) {
    console.error('Error loading dashboard:', error);
    window.showNotification('Error loading dashboard', 'error');
  } finally {
    hideSpinner();
  }
}

function displayDashboard() {
  const { vendor, statistics, alerts } = vendorData;

  // Vendor info
  document.getElementById('business-name').textContent = vendor.businessName;
  document.getElementById('vendor-status').textContent = vendor.status;
  document.getElementById('vendor-status').className = `px-3 py-1 rounded text-sm ${
    vendor.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
  }`;

  // Statistics cards
  document.getElementById('total-sales').textContent = `₹${statistics.totalRevenue.toFixed(2)}`;
  document.getElementById('total-orders').textContent = statistics.totalOrders;
  document.getElementById('total-products').textContent = statistics.totalProducts;
  document.getElementById('low-stock-count').textContent = statistics.lowStockCount;

  // Low stock alerts
  const alertsContainer = document.getElementById('low-stock-alerts');
  if (alerts.lowStockProducts && alerts.lowStockProducts.length > 0) {
    alertsContainer.innerHTML = alerts.lowStockProducts.map(product => `
      <div class="p-3 bg-yellow-50 border border-yellow-200 rounded flex justify-between items-center">
        <div>
          <p class="font-semibold text-sm">${product.name}</p>
          <p class="text-xs text-gray-600">Stock: ${product.stock}</p>
        </div>
        <a href="/pages/vendor-products.html?id=${product._id}" class="text-blue-600 hover:underline text-sm">
          Restock
        </a>
      </div>
    `).join('');
  } else {
    alertsContainer.innerHTML = '<p class="text-gray-500 text-center py-4">All products in good stock!</p>';
  }

  // Load and display charts/data
  loadVendorAnalytics();
  loadVendorOrders();
}

function setupEventListeners() {
  // Navigation tabs
  document.querySelectorAll('[data-vendor-tab]').forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const tabName = tab.dataset.vendorTab;
      showVendorTab(tabName);
    });
  });

  // Add product button
  document.getElementById('add-product-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/pages/vendor-add-product.html';
  });
}

async function showVendorTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('[data-vendor-tab-content]').forEach(el => {
    el.style.display = 'none';
  });

  // Show selected tab
  document.getElementById(`vendor-tab-${tabName}`)?.style.display = 'block';

  // Load data if needed
  if (tabName === 'products') {
    await loadVendorProducts();
  } else if (tabName === 'orders') {
    await loadVendorOrders();
  } else if (tabName === 'analytics') {
    await loadVendorAnalytics();
  }
}

async function loadVendorProducts() {
  try {
    showSpinner();
    const response = await window.apiClient.request('/api/vendors/me/products', 'GET');

    if (response.success) {
      const productsContainer = document.getElementById('vendor-products-list');
      productsContainer.innerHTML = response.data.map(product => `
        <tr class="border-b hover:bg-gray-50">
          <td class="py-3 px-4">${product.name}</td>
          <td class="py-3 px-4">₹${window.formatPrice(product.price)}</td>
          <td class="py-3 px-4">
            <span class="px-3 py-1 rounded text-sm ${product.stock > 5 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
              ${product.stock}
            </span>
          </td>
          <td class="py-3 px-4">
            <span class="text-yellow-400">
              ${'★'.repeat(Math.floor(product.rating || 0))}
            </span>
          </td>
          <td class="py-3 px-4">
            <a href="/pages/vendor-edit-product.html?id=${product._id}" class="text-blue-600 hover:underline mr-2">Edit</a>
            <button onclick="deleteProduct('${product._id}')" class="text-red-600 hover:underline">Delete</button>
          </td>
        </tr>
      `).join('');
    }
  } catch (error) {
    window.handleApiError(error);
  } finally {
    hideSpinner();
  }
}

async function loadVendorOrders() {
  try {
    showSpinner();
    const response = await window.apiClient.request('/api/vendors/me/orders', 'GET');

    if (response.success) {
      const ordersContainer = document.getElementById('vendor-orders-list');
      ordersContainer.innerHTML = response.data.map(order => `
        <tr class="border-b hover:bg-gray-50">
          <td class="py-3 px-4">${order.orderNumber}</td>
          <td class="py-3 px-4">${order.user?.name || 'N/A'}</td>
          <td class="py-3 px-4">₹${window.formatPrice(order.total)}</td>
          <td class="py-3 px-4">
            <span class="px-3 py-1 rounded text-sm ${getStatusColor(order.status)}">
              ${order.status}
            </span>
          </td>
          <td class="py-3 px-4">${new Date(order.createdAt).toLocaleDateString()}</td>
          <td class="py-3 px-4">
            <a href="/pages/order-detail.html?id=${order._id}" class="text-blue-600 hover:underline">View</a>
          </td>
        </tr>
      `).join('');
    }
  } catch (error) {
    window.handleApiError(error);
  } finally {
    hideSpinner();
  }
}

async function loadVendorAnalytics() {
  try {
    showSpinner();
    const response = await window.apiClient.request('/api/vendors/me/analytics', 'GET');

    if (response.success) {
      const { totalRevenue, totalOrders, totalProducts, averageRating, orderStatuses } = response.data;

      document.getElementById('analytics-revenue').textContent = `₹${totalRevenue.toFixed(2)}`;
      document.getElementById('analytics-orders').textContent = totalOrders;
      document.getElementById('analytics-products').textContent = totalProducts;
      document.getElementById('analytics-rating').textContent = `${averageRating}/5`;

      // Order statuses breakdown
      const statusBreakdown = document.getElementById('order-status-breakdown');
      if (statusBreakdown) {
        statusBreakdown.innerHTML = Object.entries(orderStatuses).map(([status, count]) => `
          <div class="flex justify-between py-2">
            <span>${status}</span>
            <span class="font-semibold">${count}</span>
          </div>
        `).join('');
      }
    }
  } catch (error) {
    window.handleApiError(error);
  } finally {
    hideSpinner();
  }
}

async function deleteProduct(productId) {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      showSpinner();
      const response = await window.apiClient.request(`/api/products/${productId}`, 'DELETE');

      if (response.success) {
        window.showNotification('Product deleted!', 'success');
        loadVendorProducts();
      }
    } catch (error) {
      window.handleApiError(error);
    } finally {
      hideSpinner();
    }
  }
}

function getStatusColor(status) {
  const colors = {
    'Placed': 'bg-blue-100 text-blue-800',
    'Confirmed': 'bg-yellow-100 text-yellow-800',
    'Processing': 'bg-purple-100 text-purple-800',
    'Shipped': 'bg-indigo-100 text-indigo-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

function showSpinner() {
  const spinner = document.getElementById('loading-spinner');
  if (spinner) spinner.style.display = 'block';
}

function hideSpinner() {
  const spinner = document.getElementById('loading-spinner');
  if (spinner) spinner.style.display = 'none';
}
