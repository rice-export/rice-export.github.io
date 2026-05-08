const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getReviews,
  addReview,
  getRelatedProducts,
  getProductsByVendor,
  checkAvailability
} = require('../controllers/productController');

const router = express.Router();

// Get all products
router.get('/', getAllProducts);

// Get featured products
router.get('/featured', getFeaturedProducts);

// Search products
router.get('/search/query', searchProducts);

// Get product by ID
router.get('/:id', getProductById);

// Get related products
router.get('/:id/related', getRelatedProducts);

// Get products by vendor
router.get('/vendor/:vendorId', getProductsByVendor);

// Create product (Vendor only)
router.post('/', protect, authorize('vendor', 'admin'), createProduct);

// Update product (Vendor only)
router.put('/:id', protect, authorize('vendor', 'admin'), updateProduct);

// Delete product (Vendor only)
router.delete('/:id', protect, authorize('vendor', 'admin'), deleteProduct);

// Get product reviews
router.get('/:id/reviews', getReviews);

// Add product review
router.post('/:id/reviews', protect, addReview);

// Check availability by pincode
router.post('/:id/check-availability', checkAvailability);

module.exports = router;
