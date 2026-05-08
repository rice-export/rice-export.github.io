// API Configuration and Utility Functions
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

class APIClient {
  constructor() {
    this.token = localStorage.getItem('authToken') || null;
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // Get authentication token
  getToken() {
    return this.token;
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Make API request
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error: ${error.message}`);
      throw error;
    }
  }

  // Authentication endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Product endpoints
  async getProducts(filters = '') {
    return this.request(`/products${filters}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async getFeaturedProducts() {
    return this.request('/products/featured');
  }

  async searchProducts(query) {
    return this.request(`/products/search/query?q=${encodeURIComponent(query)}`);
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, { method: 'DELETE' });
  }

  async getRelatedProducts(productId) {
    return this.request(`/products/${productId}/related`);
  }

  async addReview(productId, rating, comment) {
    return this.request(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment })
    });
  }

  async checkAvailability(productId, pincode) {
    return this.request(`/products/${productId}/check-availability`, {
      method: 'POST',
      body: JSON.stringify({ pincode })
    });
  }

  // Cart endpoints
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId, quantity) {
    return this.request('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity })
    });
  }

  async updateCartItem(productId, quantity) {
    return this.request(`/cart/items/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity })
    });
  }

  async removeFromCart(productId) {
    return this.request(`/cart/items/${productId}`, { method: 'DELETE' });
  }

  async clearCart() {
    return this.request('/cart', { method: 'DELETE' });
  }

  // Order endpoints
  async getOrders() {
    return this.request('/orders');
  }

  async getOrderById(orderId) {
    return this.request(`/orders/${orderId}`);
  }

  async createOrder(shippingAddress, paymentMethod) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({ shippingAddress, paymentMethod })
    });
  }

  async cancelOrder(orderId, reason) {
    return this.request(`/orders/${orderId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  }

  async requestReturn(orderId, reason) {
    return this.request(`/orders/${orderId}/return`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  }

  async trackOrder(orderNumber) {
    return this.request(`/orders/track/${orderNumber}`);
  }

  async addOrderFeedback(orderId, rating, comment) {
    return this.request(`/orders/${orderId}/feedback`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment })
    });
  }

  // Payment endpoints
  async initiatePayment(orderId, paymentMethod) {
    return this.request('/payments/initiate', {
      method: 'POST',
      body: JSON.stringify({ orderId, paymentMethod })
    });
  }

  async verifyPayment(orderId, transactionId, status) {
    return this.request('/payments/verify', {
      method: 'POST',
      body: JSON.stringify({ orderId, transactionId, status })
    });
  }

  async processRefund(orderId, reason) {
    return this.request('/payments/refund', {
      method: 'POST',
      body: JSON.stringify({ orderId, reason })
    });
  }

  // User endpoints
  async getUserWishlist() {
    return this.request('/users/wishlist');
  }

  async addToWishlist(productId) {
    return this.request('/users/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId })
    });
  }

  async removeFromWishlist(productId) {
    return this.request(`/users/wishlist/${productId}`, {
      method: 'DELETE'
    });
  }

  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(profileData)
    });
  }

  async changePassword(currentPassword, newPassword) {
    return this.request('/users/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  }

  async deleteAccount(password) {
    return this.request('/users/account', {
      method: 'DELETE',
      body: JSON.stringify({ password })
    });
  }

  // Vendor endpoints
  async registerVendor(vendorData) {
    return this.request('/vendors/register', {
      method: 'POST',
      body: JSON.stringify(vendorData)
    });
  }

  async getVendorProfile(vendorId) {
    return this.request(`/vendors/${vendorId}`);
  }

  // Auth endpoints - override for better naming
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async register(name, email, phone, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, password })
    });
  }
}

// Export singleton instance
window.apiClient = new APIClient();
