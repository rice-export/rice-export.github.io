const Order = require('../models/Order');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// Initiate payment
exports.initiatePayment = asyncHandler(async (req, res) => {
  const { orderId, paymentMethod } = req.body;

  if (!orderId || !paymentMethod) {
    throw new AppError('Order ID and payment method are required', 400);
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (order.user._id.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized', 403);
  }

  // Create payment intent based on method
  let paymentResponse = {};

  if (paymentMethod === 'stripe') {
    // Stripe payment intent creation (mock)
    paymentResponse = {
      method: 'stripe',
      intentId: `pi_${Date.now()}`,
      clientSecret: `sk_test_${Math.random().toString(36).substr(2, 24)}`,
      amount: Math.round(order.total * 100) // Amount in cents
    };
  } else if (paymentMethod === 'upi') {
    // UPI payment initialization (mock)
    paymentResponse = {
      method: 'upi',
      transactionId: `UPI${Date.now()}`,
      upiString: `upi://pay?pa=oriza@bank&pn=Oriza&am=${order.total}`,
      amount: order.total
    };
  } else if (paymentMethod === 'cod') {
    // COD - Cash on Delivery
    paymentResponse = {
      method: 'cod',
      status: 'Pending',
      message: 'Payment will be collected at delivery'
    };
  } else {
    throw new AppError('Invalid payment method', 400);
  }

  // Update order with payment info
  order.payment = {
    method: paymentMethod,
    status: 'Initiated',
    initiatedAt: new Date(),
    transactionId: paymentResponse.intentId || paymentResponse.transactionId || null
  };

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Payment initiated',
    orderId,
    payment: paymentResponse
  });
});

// Verify payment
exports.verifyPayment = asyncHandler(async (req, res) => {
  const { orderId, transactionId, status } = req.body;

  if (!orderId || !status) {
    throw new AppError('Order ID and status are required', 400);
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (order.user._id.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized', 403);
  }

  if (status === 'success' || status === 'completed') {
    order.payment.status = 'Completed';
    order.payment.verifiedAt = new Date();
    order.payment.transactionId = transactionId;
    order.status = 'Confirmed';

    order.timeline.push({
      status: 'Confirmed',
      timestamp: new Date(),
      message: 'Payment verified and order confirmed'
    });
  } else if (status === 'failed') {
    order.payment.status = 'Failed';
    order.payment.failedAt = new Date();

    throw new AppError('Payment verification failed', 400);
  } else if (status === 'cancelled') {
    order.payment.status = 'Cancelled';
    order.status = 'Cancelled';
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Payment verified successfully',
    orderStatus: order.status
  });
});

// Process refund
exports.processRefund = asyncHandler(async (req, res) => {
  const { orderId, reason } = req.body;

  if (!orderId) {
    throw new AppError('Order ID is required', 400);
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized', 403);
  }

  // Check if order is eligible for refund
  if (!['Delivered', 'Returned'].includes(order.status)) {
    throw new AppError('Order is not eligible for refund', 400);
  }

  order.payment.refund = {
    status: 'Initiated',
    amount: order.total,
    reason: reason || 'Return/Cancellation',
    initiatedAt: new Date()
  };

  order.timeline.push({
    status: 'Refund Initiated',
    timestamp: new Date(),
    message: `Refund of ₹${order.total} initiated`
  });

  await order.save();

  // Mock refund processing - in production, call actual payment processor
  setTimeout(async () => {
    order.payment.refund.status = 'Completed';
    order.payment.refund.completedAt = new Date();
    await order.save();
  }, 5000);

  res.status(200).json({
    success: true,
    message: 'Refund initiated',
    refundAmount: order.total,
    estimatedTime: '5-7 business days'
  });
});

// Get payment status
exports.getPaymentStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (order.user._id.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized', 403);
  }

  res.status(200).json({
    success: true,
    data: {
      orderId: order._id,
      orderStatus: order.status,
      payment: order.payment,
      total: order.total
    }
  });
});

// Webhook handler for payment gateway
exports.handlePaymentWebhook = asyncHandler(async (req, res) => {
  const { event, data } = req.body;

  if (event === 'payment.success') {
    const order = await Order.findOne({ 'payment.transactionId': data.transactionId });

    if (order) {
      order.payment.status = 'Completed';
      order.status = 'Confirmed';
      order.timeline.push({
        status: 'Confirmed',
        timestamp: new Date(),
        message: 'Payment confirmed via webhook'
      });
      await order.save();
    }
  } else if (event === 'payment.failed') {
    const order = await Order.findOne({ 'payment.transactionId': data.transactionId });

    if (order) {
      order.payment.status = 'Failed';
      await order.save();
    }
  }

  res.status(200).json({
    success: true,
    message: 'Webhook processed'
  });
});
