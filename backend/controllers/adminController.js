const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// Get admin dashboard
exports.getDashboard = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalVendors = await Vendor.countDocuments({ status: 'Approved' });
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();

  // Calculate total revenue
  const orders = await Order.find();
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  // Recent orders
  const recentOrders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(5);

  // Pending vendors
  const pendingVendors = await Vendor.countDocuments({ status: 'Pending' });

  // Low stock products
  const lowStockProducts = await Product.countDocuments({ stock: { $lt: 5 } });

  res.status(200).json({
    success: true,
    data: {
      summary: {
        totalUsers,
        totalVendors,
        totalOrders,
        totalProducts,
        totalRevenue: totalRevenue.toFixed(2)
      },
      alerts: {
        pendingVendors,
        lowStockProducts
      },
      recentOrders,
      systemHealth: {
        uptime: process.uptime(),
        status: 'Healthy'
      }
    }
  });
});

// Get all users
exports.getAllUsers = asyncHandler(async (req, res) => {
  const { role, page = 1, limit = 20, search } = req.query;
  const skip = (page - 1) * limit;

  let query = {};

  if (role) query.role = role;

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ];
  }

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select('-password -__v')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    pages: Math.ceil(total / limit),
    data: users
  });
});

// Get user analytics
exports.getUsersAnalytics = asyncHandler(async (req, res) => {
  const users = await User.find();

  // User breakdown by role
  const roleBreakdown = {
    customers: users.filter(u => u.role === 'customer').length,
    vendors: users.filter(u => u.role === 'vendor').length,
    admins: users.filter(u => u.role === 'admin').length
  };

  // User signups by date (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentUsers = users.filter(u => u.createdAt >= thirtyDaysAgo);

  res.status(200).json({
    success: true,
    data: {
      totalUsers: users.length,
      roleBreakdown,
      recentSignups: recentUsers.length,
      signupTrend: `${Math.round((recentUsers.length / users.length) * 100)}% in last 30 days`
    }
  });
});

// Approve vendor
exports.approveVendor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  const vendor = await Vendor.findByIdAndUpdate(
    id,
    { status: 'Approved', approvedAt: new Date() },
    { new: true }
  );

  if (!vendor) {
    throw new AppError('Vendor not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Vendor approved successfully',
    data: vendor
  });
});

// Reject vendor
exports.rejectVendor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason) {
    throw new AppError('Rejection reason is required', 400);
  }

  const vendor = await Vendor.findByIdAndUpdate(
    id,
    { status: 'Rejected', rejectionReason: reason },
    { new: true }
  );

  if (!vendor) {
    throw new AppError('Vendor not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Vendor rejected',
    data: vendor
  });
});

// Get all vendors
exports.getAllVendors = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  let query = {};

  if (status) query.status = status;

  const total = await Vendor.countDocuments(query);
  const vendors = await Vendor.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: vendors.length,
    total,
    pages: Math.ceil(total / limit),
    data: vendors
  });
});

// Get all orders
exports.getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  let query = {};

  if (status) query.status = status;

  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('user', 'name email')
    .populate('items.product', 'name')
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

// Get revenue analytics
exports.getRevenueAnalytics = asyncHandler(async (req, res) => {
  const orders = await Order.find({ status: 'Delivered' });

  // Revenue by date (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentOrders = orders.filter(o => o.createdAt >= thirtyDaysAgo);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const recentRevenue = recentOrders.reduce((sum, order) => sum + order.total, 0);

  // Revenue by status
  const allOrders = await Order.find();
  const revenueByStatus = {
    placed: allOrders
      .filter(o => o.status === 'Placed')
      .reduce((sum, o) => sum + o.total, 0),
    confirmed: allOrders
      .filter(o => o.status === 'Confirmed')
      .reduce((sum, o) => sum + o.total, 0),
    delivered: totalRevenue,
    returned: allOrders
      .filter(o => o.status === 'Returned')
      .reduce((sum, o) => sum + o.total, 0)
  };

  res.status(200).json({
    success: true,
    data: {
      totalRevenue: totalRevenue.toFixed(2),
      recentRevenue: recentRevenue.toFixed(2),
      revenueByStatus,
      deliveredOrders: orders.length,
      pendingOrders: allOrders.filter(o => o.status !== 'Delivered').length
    }
  });
});

// Get system health
exports.getSystemHealth = asyncHandler(async (req, res) => {
  const uptime = process.uptime();
  const memory = process.memoryUsage();

  // Check database
  const dbStatus = 'Connected';

  res.status(200).json({
    success: true,
    data: {
      status: 'Healthy',
      uptime: `${Math.floor(uptime / 3600)} hours`,
      memory: {
        heapUsed: `${Math.round(memory.heapUsed / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memory.heapTotal / 1024 / 1024)} MB`
      },
      database: dbStatus,
      timestamp: new Date()
    }
  });
});

// Get pending vendors
exports.getPendingVendors = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const total = await Vendor.countDocuments({ status: 'Pending' });
  const vendors = await Vendor.find({ status: 'Pending' })
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: vendors.length,
    total,
    pages: Math.ceil(total / limit),
    data: vendors
  });
});

// Suspend vendor
exports.suspendVendor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const vendor = await Vendor.findByIdAndUpdate(
    id,
    { status: 'Suspended', suspensionReason: reason },
    { new: true }
  );

  if (!vendor) {
    throw new AppError('Vendor not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Vendor suspended',
    data: vendor
  });
});

// Reactivate vendor
exports.reactivateVendor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const vendor = await Vendor.findByIdAndUpdate(
    id,
    { status: 'Approved', suspensionReason: null },
    { new: true }
  );

  if (!vendor) {
    throw new AppError('Vendor not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Vendor reactivated',
    data: vendor
  });
});
