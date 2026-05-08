const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  registerVendor,
  getVendorProfile,
  getVendorDashboard,
  getVendorSales,
  getVendorProducts,
  getVendorOrders,
  getVendorAnalytics,
  updateVendorProfile
} = require('../controllers/vendorController');

const router = express.Router();

// Register vendor
router.post('/register', protect, registerVendor);

// Get vendor profile
router.get('/:id', getVendorProfile);

// Get vendor products
router.get('/:id/products', getVendorProducts);

// Protected vendor routes (requires vendor role)
router.get('/me/dashboard', protect, authorize('vendor'), getVendorDashboard);
router.get('/me/sales', protect, authorize('vendor'), getVendorSales);
router.get('/me/orders', protect, authorize('vendor'), getVendorOrders);
router.get('/me/analytics', protect, authorize('vendor'), getVendorAnalytics);
router.patch('/me', protect, authorize('vendor'), updateVendorProfile);

module.exports = router;
