const User = require('../models/User');
const Product = require('../models/Product');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// Get user profile
exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password -__v')
    .populate('wishlist', 'name price images rating');

  res.status(200).json({
    success: true,
    data: user
  });
});

// Update user profile
exports.updateUserProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar, address } = req.body;

  // Don't allow email update here
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, avatar, address },
    { new: true, runValidators: true }
  ).select('-password -__v');

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user
  });
});

// Get user's wishlist
exports.getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('wishlist', 'name price images rating category vendor');

  res.status(200).json({
    success: true,
    count: user.wishlist.length,
    data: user.wishlist
  });
});

// Add to wishlist
exports.addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    throw new AppError('Product ID is required', 400);
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const user = await User.findById(req.user._id);

  // Check if already in wishlist
  if (user.wishlist.includes(productId)) {
    throw new AppError('Product already in wishlist', 400);
  }

  user.wishlist.push(productId);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Product added to wishlist',
    data: user.wishlist
  });
});

// Remove from wishlist
exports.removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const user = await User.findById(req.user._id);

  user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Product removed from wishlist',
    data: user.wishlist
  });
});

// Change password
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new AppError('All password fields are required', 400);
  }

  if (newPassword !== confirmPassword) {
    throw new AppError('New passwords do not match', 400);
  }

  const user = await User.findById(req.user._id).select('+password');

  const isMatch = await user.matchPassword(currentPassword);

  if (!isMatch) {
    throw new AppError('Current password is incorrect', 400);
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
});

// Delete account
exports.deleteAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    throw new AppError('Password is required to delete account', 400);
  }

  const user = await User.findById(req.user._id).select('+password');

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw new AppError('Password is incorrect', 400);
  }

  await User.findByIdAndDelete(req.user._id);

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully'
  });
});
