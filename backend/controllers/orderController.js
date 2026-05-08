const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// Create order
exports.createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod, items } = req.body;

  if (!shippingAddress || !paymentMethod) {
    throw new AppError('Shipping address and payment method are required', 400);
  }

  let orderItems = [];
  let total = 0;

  // If items not provided, use cart items
  if (!items || items.length === 0) {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      throw new AppError('Your cart is empty', 400);
    }

    for (let item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for ${item.product.name}`, 400);
      }

      orderItems.push({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
        vendor: item.product.vendor
      });

      total += item.product.price * item.quantity;
    }
  } else {
    // Validate provided items
    for (let item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        throw new AppError(`Product ${item.product} not found`, 404);
      }

      if (product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for ${product.name}`, 400);
      }

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        vendor: product.vendor
      });

      total += product.price * item.quantity;
    }
  }

  // Calculate tax (5%)
  const tax = Math.round(total * 0.05 * 100) / 100;
  const shippingCost = 0; // Free shipping for now

  // Generate unique order number
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  const order = await Order.create({
    user: req.user._id,
    orderNumber,
    items: orderItems,
    shippingAddress,
    billingAddress: shippingAddress, // Same as shipping for simplicity
    paymentMethod,
    subtotal: total,
    tax,
    shippingCost,
    total: total + tax + shippingCost,
    status: 'Placed',
    timeline: [
      {
        status: 'Placed',
        timestamp: new Date(),
        message: 'Order placed successfully'
      }
    ]
  });

  // Deduct stock
  for (let item of orderItems) {
    await Product.findByIdAndUpdate(
      item.product,
      { $inc: { stock: -item.quantity } }
    );
  }

  // Clear cart
  await Cart.deleteOne({ user: req.user._id });

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: order
  });
});

// Get user's orders
exports.getOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const skip = (page - 1) * limit;

  let query = { user: req.user._id };

  if (status) {
    query.status = status;
  }

  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('items.product', 'name price images')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    pages: Math.ceil(total / limit),
    data: orders
  });
});

// Get order by ID
exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('items.product', 'name price images specifications')
    .populate('items.vendor', 'businessName phone');

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Check authorization
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to view this order', 403);
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// Update order status (Admin/Vendor)
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, message } = req.body;

  if (!status) {
    throw new AppError('Status is required', 400);
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Authorization check
  if (req.user.role !== 'admin') {
    throw new AppError('Not authorized to update order status', 403);
  }

  order.status = status;
  order.timeline.push({
    status,
    timestamp: new Date(),
    message: message || `Order status updated to ${status}`
  });

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order status updated',
    data: order
  });
});

// Cancel order
exports.cancelOrder = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (order.user._id.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to cancel this order', 403);
  }

  if (!['Placed', 'Confirmed'].includes(order.status)) {
    throw new AppError('Can only cancel orders in Placed or Confirmed status', 400);
  }

  // Restore stock
  for (let item of order.items) {
    await Product.findByIdAndUpdate(
      item.product,
      { $inc: { stock: item.quantity } }
    );
  }

  order.status = 'Cancelled';
  order.cancellationReason = reason || 'User cancelled';
  order.timeline.push({
    status: 'Cancelled',
    timestamp: new Date(),
    message: reason || 'Order cancelled by user'
  });

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
    data: order
  });
});

// Request return
exports.requestReturn = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  if (!reason) {
    throw new AppError('Return reason is required', 400);
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (order.user._id.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to request return for this order', 403);
  }

  if (order.status !== 'Delivered') {
    throw new AppError('Can only return delivered orders', 400);
  }

  order.return = {
    requested: true,
    reason,
    requestedAt: new Date(),
    status: 'Pending'
  };

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Return request submitted',
    data: order
  });
});

// Track order
exports.trackOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    orderNumber: req.params.orderNumber,
    user: req.user._id
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  res.status(200).json({
    success: true,
    orderNumber: order.orderNumber,
    status: order.status,
    timeline: order.timeline,
    estimatedDelivery: order.deliveryDate || 'TBD',
    deliveryPartner: order.deliveryPartner || null
  });
});

// Add feedback to order
exports.addFeedback = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    throw new AppError('Rating must be between 1 and 5', 400);
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (order.user._id.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to add feedback to this order', 403);
  }

  order.feedback = {
    rating,
    comment: comment || '',
    date: new Date()
  };

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Feedback added successfully',
    data: order
  });
});

// Get return status
exports.getReturnStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (order.user._id.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized', 403);
  }

  res.status(200).json({
    success: true,
    returnStatus: order.return || null
  });
});
