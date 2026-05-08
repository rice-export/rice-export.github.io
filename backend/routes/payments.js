const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  initiatePayment,
  verifyPayment,
  processRefund,
  getPaymentStatus,
  handlePaymentWebhook
} = require('../controllers/paymentController');

const router = express.Router();

// Initiate payment
router.post('/initiate', protect, initiatePayment);

// Verify payment
router.post('/verify', protect, verifyPayment);

// Get payment status
router.get('/:orderId/status', protect, getPaymentStatus);

// Process refund
router.post('/refund', protect, processRefund);

// Webhook handler (no auth needed)
router.post('/webhook', handlePaymentWebhook);

module.exports = router;

module.exports = router;
