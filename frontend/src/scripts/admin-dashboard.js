// Admin Dashboard

let dashboardData = null;

document.addEventListener('DOMContentLoaded', async () => {
  initializeNavigation();

  // Check if user is admin
  if (!window.isAuthenticated() || localStorage.getItem('userRole') !== 'admin') {
    window.location.href = '/pages/auth.html';
    return;
  }

  await loadDashboard();
  setupEventListeners();
});

async function loadDashboard() {
  try {
    showSpinner();

    const response = await window.apiClient.request('/api/admin/dashboard', 'GET');

    if (!response.success) {
      throw new Error('Failed to load dashboard');
    }

    dashboardData = response.data;
    displayDashboard();
  } catch (error) {
    console.error('Error loading dashboard:', error);
    window.showNotification('Error loading dashboard', 'error');
  } finally {
    hideSpinner();
  }
}

function displayDashboard() {
  const { summary, alerts, recentOrders, systemHealth } = dashboardData;

  // Summary cards
  document.getElementById('total-revenue').textContent = `₹${summary.totalRevenue}`;
  document.getElementById('total-vendors').textContent = summary.totalVendors;
  document.getElementById('total-orders').textContent = summary.totalOrders;
  document.getElementById('total-products').textContent = summary.totalProducts;
  document.getElementById('total-users').textContent = summary.totalUsers;

  // Alerts
  document.getElementById('pending-vendors-alert').textContent = alerts.pendingVendors;
  document.getElementById('low-stock-alert').textContent = alerts.lowStockProducts;

  // System health
  document.getElementById('system-status').textContent = systemHealth.status;
  document.getElementById('system-uptime').textContent = `${Math.floor(systemHealth.uptime / 3600)} hours`;

  // Recent orders table
  const ordersTable = document.getElementById('recent-orders-table');
  if (ordersTable && recentOrders) {
    ordersTable.innerHTML = recentOrders.map(order => `
      <tr class="border-b hover:bg-gray-50">
        <td class="py-3 px-4">${order.orderNumber}</td>
        <td class="py-3 px-4">${order.user?.name || 'N/A'}</td>
        <td class="py-3 px-4">₹${window.formatPrice(order.total)}</td>
        <td class="py-3 px-4">
          <span class="px-3 py-1 rounded text-sm ${getStatusColor(order.status)}">
            ${order.status}
          </span>
        </td>
        <td class="py-3 px-4">
          <a href="#" class="text-blue-600 hover:underline" onclick="viewOrder('${order._id}', event)">View</a>
        </td>
      </tr>
    `).join('');
  }
}

function getStatusColor(status) {
  const colors = {
    'Placed': 'bg-blue-100 text-blue-800',
    'Confirmed': 'bg-yellow-100 text-yellow-800',
    'Processing': 'bg-purple-100 text-purple-800',
    'Shipped': 'bg-indigo-100 text-indigo-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
    'Returned': 'bg-gray-100 text-gray-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

function setupEventListeners() {
  // Pending vendors button
  document.getElementById('view-pending-vendors')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '#pending-vendors';
  });

  // Navigation tabs
  document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const tabName = tab.dataset.tab;
      showTab(tabName);
    });
  });
}

async function showTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('[data-tab-content]').forEach(el => {
    el.style.display = 'none';
  });

  // Show selected tab
  document.getElementById(`tab-${tabName}`)?.style.display = 'block';

  // Load data if needed
  if (tabName === 'users') {
    await loadAllUsers();
  } else if (tabName === 'vendors') {
    await loadAllVendors();
  } else if (tabName === 'orders') {
    await loadAllOrders();
  } else if (tabName === 'analytics') {
    await loadAnalytics();
  }
}

async function loadAllUsers() {
  try {
    showSpinner();
    const response = await window.apiClient.request('/api/admin/users', 'GET');

    if (response.success) {
      const usersTable = document.getElementById('all-users-table');
      usersTable.innerHTML = response.data.map(user => `
        <tr class="border-b hover:bg-gray-50">
          <td class="py-3 px-4">${user.name}</td>
          <td class="py-3 px-4">${user.email}</td>
          <td class="py-3 px-4">${user.phone}</td>
          <td class="py-3 px-4">
            <span class="px-3 py-1 rounded text-sm bg-blue-100 text-blue-800 capitalize">
              ${user.role}
            </span>
          </td>
          <td class="py-3 px-4">${new Date(user.createdAt).toLocaleDateString()}</td>
        </tr>
      `).join('');
    }
  } catch (error) {
    window.handleApiError(error);
  } finally {
    hideSpinner();
  }
}

async function loadAllVendors() {
  try {
    showSpinner();
    const response = await window.apiClient.request('/api/admin/vendors', 'GET');

    if (response.success) {
      const vendorsTable = document.getElementById('all-vendors-table');
      vendorsTable.innerHTML = response.data.map(vendor => `
        <tr class="border-b hover:bg-gray-50">
          <td class="py-3 px-4">${vendor.businessName}</td>
          <td class="py-3 px-4">${vendor.ownerName}</td>
          <td class="py-3 px-4">${vendor.email}</td>
          <td class="py-3 px-4">
            <span class="px-3 py-1 rounded text-sm ${vendor.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
              ${vendor.status}
            </span>
          </td>
          <td class="py-3 px-4">
            ${vendor.status === 'Pending' ? `
              <button onclick="approveVendor('${vendor._id}')" class="text-green-600 hover:underline mr-2">Approve</button>
              <button onclick="rejectVendor('${vendor._id}')" class="text-red-600 hover:underline">Reject</button>
            ` : '-'}
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

async function loadAllOrders() {
  try {
    showSpinner();
    const response = await window.apiClient.request('/api/admin/orders', 'GET');

    if (response.success) {
      const ordersTable = document.getElementById('all-orders-table');
      ordersTable.innerHTML = response.data.map(order => `
        <tr class="border-b hover:bg-gray-50">
          <td class="py-3 px-4">${order.orderNumber}</td>
          <td class="py-3 px-4">${order.user?.name || 'N/A'}</td>
          <td class="py-3 px-4">₹${window.formatPrice(order.total)}</td>
          <td class="py-3 px-4">
            <span class="px-3 py-1 rounded text-sm ${getStatusColor(order.status)}">
              ${order.status}
            </span>
          </td>
          <td class="py-3 px-4">
            <select onchange="updateOrderStatus('${order._id}', this.value)" class="border rounded px-2 py-1">
              <option value="${order.status}">${order.status}</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
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

async function loadAnalytics() {
  try {
    showSpinner();
    const response = await window.apiClient.request('/api/admin/analytics/revenue', 'GET');

    if (response.success) {
      const { totalRevenue, recentRevenue, deliveredOrders, pendingOrders } = response.data;

      document.getElementById('analytics-total-revenue').textContent = `₹${totalRevenue}`;
      document.getElementById('analytics-recent-revenue').textContent = `₹${recentRevenue}`;
      document.getElementById('analytics-delivered-orders').textContent = deliveredOrders;
      document.getElementById('analytics-pending-orders').textContent = pendingOrders;
    }
  } catch (error) {
    window.handleApiError(error);
  } finally {
    hideSpinner();
  }
}

async function approveVendor(vendorId) {
  if (confirm('Approve this vendor?')) {
    try {
      showSpinner();
      const response = await window.apiClient.request(`/api/admin/vendors/${vendorId}/approve`, 'PATCH', {});

      if (response.success) {
        window.showNotification('Vendor approved!', 'success');
        loadAllVendors();
      }
    } catch (error) {
      window.handleApiError(error);
    } finally {
      hideSpinner();
    }
  }
}

async function rejectVendor(vendorId) {
  const reason = prompt('Enter rejection reason:');
  if (reason) {
    try {
      showSpinner();
      const response = await window.apiClient.request(`/api/admin/vendors/${vendorId}/reject`, 'PATCH', { reason });

      if (response.success) {
        window.showNotification('Vendor rejected!', 'success');
        loadAllVendors();
      }
    } catch (error) {
      window.handleApiError(error);
    } finally {
      hideSpinner();
    }
  }
}

async function updateOrderStatus(orderId, status) {
  try {
    showSpinner();
    const response = await window.apiClient.request(`/api/orders/${orderId}/status`, 'PATCH', {
      status,
      message: `Order status updated to ${status}`
    });

    if (response.success) {
      window.showNotification('Order status updated!', 'success');
    }
  } catch (error) {
    window.handleApiError(error);
  } finally {
    hideSpinner();
  }
}

function viewOrder(orderId, e) {
  e.preventDefault();
  // Could open a modal or navigate to order detail page
  window.location.href = `/pages/order-detail.html?id=${orderId}`;
}

function showSpinner() {
  const spinner = document.getElementById('loading-spinner');
  if (spinner) spinner.style.display = 'block';
}

function hideSpinner() {
  const spinner = document.getElementById('loading-spinner');
  if (spinner) spinner.style.display = 'none';
}
