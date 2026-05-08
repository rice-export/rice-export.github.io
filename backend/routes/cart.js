const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyDiscount
} = require('../controllers/cartController');

const router = express.Router();

// Get user cart
router.get('/', protect, getCart);

// Add item to cart
router.post('/items', protect, addToCart);

// Update cart item quantity
router.patch('/items/:productId', protect, updateCartItem);

// Remove item from cart
router.delete('/items/:productId', protect, removeFromCart);

// Clear cart
router.delete('/', protect, clearCart);

// Apply discount/coupon
router.post('/discount', protect, applyDiscount);

module.exports = router;
