const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// Get all products with filtering and pagination
exports.getAllProducts = asyncHandler(async (req, res) => {
  const { category, rice_type, minPrice, maxPrice, page = 1, limit = 12, sort } = req.query;
  
  let query = {};
  
  // Apply filters
  if (category) query.category = category;
  if (rice_type) query.rice_type = rice_type;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Pagination
  const skip = (page - 1) * limit;
  
  // Sorting
  let sortObj = {};
  if (sort === 'price_low') sortObj.price = 1;
  else if (sort === 'price_high') sortObj.price = -1;
  else if (sort === 'newest') sortObj.createdAt = -1;
  else if (sort === 'popular') sortObj.rating = -1;
  else sortObj.createdAt = -1;

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .select('-__v')
    .populate('vendor', 'businessName')
    .sort(sortObj)
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: Number(page),
    data: products
  });
});

// Get featured products
exports.getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true })
    .limit(8)
    .select('-__v')
    .populate('vendor', 'businessName')
    .sort({ rating: -1 });

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// Get product by ID
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .select('-__v')
    .populate('vendor', 'businessName ownerName phone email')
    .populate('reviews.user', 'name avatar rating');

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// Search products (full-text search)
exports.searchProducts = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 12 } = req.query;

  if (!q) {
    throw new AppError('Search query is required', 400);
  }

  const skip = (page - 1) * limit;

  const total = await Product.countDocuments({
    $text: { $search: q }
  });

  const products = await Product.find(
    { $text: { $search: q } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .skip(skip)
    .limit(Number(limit))
    .populate('vendor', 'businessName');

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: Number(page),
    data: products
  });
});

// Create product (Vendor only)
exports.createProduct = asyncHandler(async (req, res) => {
  const { name, description, category, rice_type, price, stock, images, specifications } = req.body;

  // Validate required fields
  if (!name || !category || !price || !stock) {
    throw new AppError('Please provide all required fields', 400);
  }

  // Check if vendor exists and is approved
  const vendor = await Vendor.findOne({ user: req.user._id });
  if (!vendor || vendor.status !== 'Approved') {
    throw new AppError('Only approved vendors can create products', 403);
  }

  const product = await Product.create({
    name,
    description,
    category,
    rice_type: rice_type || 'Basmati',
    price,
    stock,
    images: images || [],
    vendor: vendor._id,
    specifications: specifications || {}
  });

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product
  });
});

// Update product (Vendor/Admin)
exports.updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Check authorization
  if (req.user.role === 'vendor' && product.vendor.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to update this product', 403);
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: product
  });
});

// Delete product (Vendor/Admin)
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Check authorization
  if (req.user.role === 'vendor' && product.vendor.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to delete this product', 403);
  }

  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// Get product reviews
exports.getReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const skip = (page - 1) * limit;
  const reviews = product.reviews.slice(skip, skip + Number(limit));

  res.status(200).json({
    success: true,
    count: reviews.length,
    total: product.reviews.length,
    data: reviews
  });
});

// Add product review
exports.addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating) {
    throw new AppError('Please provide a rating', 400);
  }

  if (rating < 1 || rating > 5) {
    throw new AppError('Rating must be between 1 and 5', 400);
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Check if user already reviewed
  const existingReview = product.reviews.find(r => r.user.toString() === req.user._id.toString());
  if (existingReview) {
    throw new AppError('You already reviewed this product', 400);
  }

  product.reviews.push({
    user: req.user._id,
    rating,
    comment: comment || '',
    createdAt: new Date()
  });

  // Update average rating
  const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
  product.rating = totalRating / product.reviews.length;

  await product.save();

  res.status(201).json({
    success: true,
    message: 'Review added successfully',
    data: product
  });
});

// Get related/recommended products
exports.getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const related = await Product.find({
    _id: { $ne: req.params.id },
    category: product.category,
    rice_type: product.rice_type
  })
    .limit(4)
    .populate('vendor', 'businessName');

  res.status(200).json({
    success: true,
    count: related.length,
    data: related
  });
});

// Get products by vendor
exports.getProductsByVendor = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;

  const vendor = await Vendor.findById(req.params.vendorId);
  if (!vendor) {
    throw new AppError('Vendor not found', 404);
  }

  const total = await Product.countDocuments({ vendor: req.params.vendorId });
  const products = await Product.find({ vendor: req.params.vendorId })
    .skip(skip)
    .limit(Number(limit))
    .populate('vendor', 'businessName');

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    pages: Math.ceil(total / limit),
    data: products
  });
});

// Check product availability by pincode
exports.checkAvailability = asyncHandler(async (req, res) => {
  const { pincode } = req.body;

  if (!pincode) {
    throw new AppError('Pincode is required', 400);
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Simple check - can be enhanced with delivery partner integration
  const isAvailable = product.stock > 0;
  const estimatedDelivery = isAvailable ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) : null;

  res.status(200).json({
    success: true,
    available: isAvailable,
    estimatedDelivery,
    stock: product.stock
  });
});
