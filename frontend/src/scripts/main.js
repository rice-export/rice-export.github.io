// Main application entry point and utilities

// Check if user is authenticated
function isAuthenticated() {
  return !!localStorage.getItem('authToken');
}

// Redirect to login if not authenticated
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = '/pages/auth.html';
    return false;
  }
  return true;
}

// Redirect to home if already authenticated
function redirectIfAuthenticated() {
  if (isAuthenticated()) {
    window.location.href = '/';
  }
}

// Format price to INR
function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(price);
}

// Show notification toast
function showNotification(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-6 right-6 p-4 rounded-lg text-white z-50 ${
    type === 'success' ? 'bg-primary' :
    type === 'error' ? 'bg-error' :
    'bg-secondary'
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, duration);
}

// Handle API errors
function handleApiError(error) {
  console.error('API Error:', error);
  const message = error.message || 'An error occurred. Please try again.';
  showNotification(message, 'error');
}

// Debounce function for search
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Initialize navigation for authenticated users
function initializeNavigation() {
  if (isAuthenticated()) {
    // Hide login button, show logout
    const loginBtn = document.querySelector('[data-login-btn]');
    const logoutBtn = document.querySelector('[data-logout-btn]');
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'block';
  }
}

// Document ready equivalent
document.addEventListener('DOMContentLoaded', () => {
  initializeNavigation();
});

// Export functions globally
window.appUtils = {
  isAuthenticated,
  requireAuth,
  redirectIfAuthenticated,
  formatPrice,
  showNotification,
  handleApiError,
  debounce
};
