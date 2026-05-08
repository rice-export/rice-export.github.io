const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// Get cart
exports.getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0
    });
  }

  res.status(200).json({
    success: true,
    data: cart
  });
});

// Add item to cart
exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    throw new AppError('Product ID and quantity are required', 400);
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  if (product.stock < quantity) {
    throw new AppError('Insufficient stock', 400);
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: []
    });
  }

  // Check if product already in cart
  const existingItem = cart.items.find(item => item.product.toString() === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.price = product.price * existingItem.quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      price: product.price * quantity
    });
  }

  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Item added to cart',
    data: cart
  });
});

// Update cart item quantity
exports.updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    throw new AppError('Invalid quantity', 400);
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  const cartItem = cart.items.find(item => item.product.toString() === req.params.productId);

  if (!cartItem) {
    throw new AppError('Item not found in cart', 404);
  }

  const product = await Product.findById(req.params.productId);

  if (product.stock < quantity) {
    throw new AppError('Insufficient stock', 400);
  }

  cartItem.quantity = quantity;
  cartItem.price = product.price * quantity;

  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Cart item updated',
    data: cart
  });
});

// Remove item from cart
exports.removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);

  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Item removed from cart',
    data: cart
  });
});

// Clear cart
exports.clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  cart.items = [];
  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Cart cleared',
    data: cart
  });
});

// Apply discount/coupon
exports.applyDiscount = asyncHandler(async (req, res) => {
  const { couponCode, discount } = req.body;

  if (!discount) {
    throw new AppError('Discount value is required', 400);
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  cart.discount = discount;
  cart.couponCode = couponCode;
  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Discount applied',
    data: cart
  });
});
