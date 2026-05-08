const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      price: Number,
      discount: Number
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  subtotal: Number,
  taxAmount: Number,
  shippingCost: {
    type: Number,
    default: 0
  },
  discountApplied: {
    type: Number,
    default: 0
  },
  couponCode: String,
  
  shippingAddress: {
    fullName: String,
    email: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },
  
  billingAddress: {
    fullName: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },
  
  paymentMethod: {
    type: String,
    enum: ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet', 'COD'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  transactionId: String,
  
  orderStatus: {
    type: String,
    enum: ['Placed', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'],
    default: 'Placed'
  },
  
  tracking: {
    carrier: String,
    trackingNumber: String,
    estimatedDelivery: Date,
    lastLocation: String
  },
  
  timeline: [
    {
      status: String,
      timestamp: {
        type: Date,
        default: Date.now
      },
      location: String,
      notes: String
    }
  ],
  
  deliveryPartner: {
    name: String,
    phone: String,
    image: String
  },
  
  notes: String,
  specialInstructions: String,
  
  isReturnable: {
    type: Boolean,
    default: true
  },
  returnReason: String,
  returnStatus: {
    type: String,
    enum: ['No Return', 'Initiated', 'Approved', 'Returned', 'Refunded'],
    default: 'No Return'
  },
  
  feedback: {
    rating: Number,
    comment: String,
    images: [String]
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for queries
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Order', orderSchema);
