const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getDashboard,
  getAllUsers,
  getUsersAnalytics,
  approveVendor,
  rejectVendor,
  getAllVendors,
  getAllOrders,
  getRevenueAnalytics,
  getSystemHealth,
  getPendingVendors,
  suspendVendor,
  reactivateVendor
} = require('../controllers/adminController');

const router = express.Router();

// Apply protect and authorize admin middleware to all routes
router.use(protect, authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboard);

// Users management
router.get('/users', getAllUsers);
router.get('/users/analytics', getUsersAnalytics);

// Vendors management
router.get('/vendors', getAllVendors);
router.get('/vendors/pending', getPendingVendors);
router.patch('/vendors/:id/approve', approveVendor);
router.patch('/vendors/:id/reject', rejectVendor);
router.patch('/vendors/:id/suspend', suspendVendor);
router.patch('/vendors/:id/reactivate', reactivateVendor);

// Orders management
router.get('/orders', getAllOrders);

// Analytics
router.get('/analytics/revenue', getRevenueAnalytics);
router.get('/system-health', getSystemHealth);

module.exports = router;

// Analytics
router.get('/analytics/revenue', (req, res) => {
  res.json({ success: true, message: 'Get revenue analytics' });
});

router.get('/analytics/sales', (req, res) => {
  res.json({ success: true, message: 'Get sales analytics' });
});

// Settings
router.get('/settings', (req, res) => {
  res.json({ success: true, message: 'Get admin settings' });
});

router.put('/settings', (req, res) => {
  res.json({ success: true, message: 'Update settings' });
});

module.exports = router;
