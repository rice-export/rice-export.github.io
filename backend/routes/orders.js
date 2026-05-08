const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  requestReturn,
  trackOrder,
  addFeedback,
  getReturnStatus
} = require('../controllers/orderController');

const router = express.Router();

// Create order
router.post('/', protect, createOrder);

// Get user orders
router.get('/', protect, getOrders);

// Track order
router.get('/track/:orderNumber', protect, trackOrder);

// Get order by ID
router.get('/:id', protect, getOrderById);

// Update order status (Admin only)
router.patch('/:id/status', protect, authorize('admin'), updateOrderStatus);

// Cancel order
router.post('/:id/cancel', protect, cancelOrder);

// Request return
router.post('/:id/return', protect, requestReturn);

// Get return status
router.get('/:id/return-status', protect, getReturnStatus);

// Add feedback
router.post('/:id/feedback', protect, addFeedback);

module.exports = router;
