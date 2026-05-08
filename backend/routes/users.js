const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getUserProfile,
  updateUserProfile,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  changePassword,
  deleteAccount
} = require('../controllers/userController');

const router = express.Router();

// Get user profile
router.get('/profile', protect, getUserProfile);

// Update user profile
router.patch('/profile', protect, updateUserProfile);

// Get wishlist
router.get('/wishlist', protect, getWishlist);

// Add to wishlist
router.post('/wishlist', protect, addToWishlist);

// Remove from wishlist
router.delete('/wishlist/:productId', protect, removeFromWishlist);

// Change password
router.post('/change-password', protect, changePassword);

// Delete account
router.delete('/account', protect, deleteAccount);

module.exports = router;

// Add address
router.post('/:id/addresses', protect, (req, res) => {
  res.json({ success: true, message: 'Add address' });
});

module.exports = router;
