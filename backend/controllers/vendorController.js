const Vendor = require('../models/Vendor');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// Register vendor
exports.registerVendor = asyncHandler(async (req, res) => {
  const { businessName, ownerName, businessType, gstNumber, panNumber, bankDetails } = req.body;

  if (!businessName || !ownerName || !businessType) {
    throw new AppError('Please provide all required fields', 400);
  }

  // Check if vendor already exists for this user
  const existingVendor = await Vendor.findOne({ user: req.user._id });
  if (existingVendor) {
    throw new AppError('You are already registered as a vendor', 400);
  }

  const vendor = await Vendor.create({
    user: req.user._id,
    businessName,
    ownerName,
    email: req.user.email,
    phone: req.user.phone,
    businessType,
    gstNumber,
    panNumber,
    bankDetails,
    status: 'Pending'
  });

  res.status(201).json({
    success: true,
    message: 'Vendor registration submitted for approval',
    data: vendor
  });
});

// Get vendor profile
exports.getVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id)
    .select('-__v');

  if (!vendor) {
    throw new AppError('Vendor not found', 404);
  }

  res.status(200).json({
    success: true,
    data: vendor
  });
});

// Get vendor dashboard
exports.getVendorDashboard = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ user: req.user._id });

  if (!vendor) {
    throw new AppError('Vendor profile not found', 404);
  }

  // Get statistics
  const totalProducts = await Product.countDocuments({ vendor: vendor._id });
  
  const orders = await Order.find({
    'items.vendor': vendor._id
  });

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => {
    const vendorItems = order.items.filter(item => item.vendor.toString() === vendor._id.toString());
    return sum + vendorItems.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
  }, 0);

  const lowStockProducts = await Product.find({
    vendor: vendor._id,
    stock: { $lt: 5 }
  });

  res.status(200).json({
    success: true,
    data: {
      vendor,
      statistics: {
        totalProducts,
        totalOrders,
        totalRevenue,
        lowStockCount: lowStockProducts.length
      },
      alerts: {
        lowStockProducts: lowStockProducts.map(p => ({
          _id: p._id,
          name: p.name,
          stock: p.stock
        }))
      }
    }
  });
});

// Get vendor sales
exports.getVendorSales = asyncHandler(async (req, res) => {
  const { startDate, endDate, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const vendor = await Vendor.findOne({ user: req.user._id });

  if (!vendor) {
    throw new AppError('Vendor profile not found', 404);
  }

  let query = { 'items.vendor': vendor._id };

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('user', 'name email phone')
    .populate('items.product', 'name price')
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

// Get vendor's products
exports.getVendorProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;

  const vendor = await Vendor.findOne({ user: req.user._id });

  if (!vendor) {
    throw new AppError('Vendor profile not found', 404);
  }

  const total = await Product.countDocuments({ vendor: vendor._id });
  const products = await Product.find({ vendor: vendor._id })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    pages: Math.ceil(total / limit),
    data: products
  });
});

// Get vendor orders
exports.getVendorOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const vendor = await Vendor.findOne({ user: req.user._id });

  if (!vendor) {
    throw new AppError('Vendor profile not found', 404);
  }

  let query = { 'items.vendor': vendor._id };

  if (status) {
    query.status = status;
  }

  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('user', 'name email')
    .populate('items.product', 'name price')
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

// Get vendor analytics
exports.getVendorAnalytics = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ user: req.user._id });

  if (!vendor) {
    throw new AppError('Vendor profile not found', 404);
  }

  const orders = await Order.find({ 'items.vendor': vendor._id });

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, order) => {
    const vendorItems = order.items.filter(item => item.vendor.toString() === vendor._id.toString());
    return sum + vendorItems.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
  }, 0);

  const orderStatuses = {};
  orders.forEach(order => {
    orderStatuses[order.status] = (orderStatuses[order.status] || 0) + 1;
  });

  const products = await Product.find({ vendor: vendor._id });
  const avgRating = products.length > 0
    ? (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(2)
    : 0;

  res.status(200).json({
    success: true,
    data: {
      totalRevenue,
      totalOrders: orders.length,
      totalProducts: products.length,
      averageRating: avgRating,
      orderStatuses,
      recentOrders: orders.slice(-5)
    }
  });
});

// Update vendor profile
exports.updateVendorProfile = asyncHandler(async (req, res) => {
  const { businessName, ownerName, bankDetails } = req.body;

  const vendor = await Vendor.findOneAndUpdate(
    { user: req.user._id },
    { businessName, ownerName, bankDetails },
    { new: true, runValidators: true }
  );

  if (!vendor) {
    throw new AppError('Vendor profile not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Vendor profile updated',
    data: vendor
  });
});
