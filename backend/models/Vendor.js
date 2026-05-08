const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: [true, 'Please provide a business name'],
    unique: true
  },
  ownerName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  businessType: {
    type: String,
    enum: ['Farmer', 'Supplier', 'Distributor', 'Processor'],
    required: true
  },
  registrationNumber: String,
  gstNumber: String,
  panNumber: String,
  
  businessAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },
  
  bankDetails: {
    accountHolder: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String,
    branchName: String
  },
  
  documents: {
    businessRegistration: String,
    gstCertificate: String,
    panCertificate: String,
    bankStatement: String
  },
  
  logo: String,
  banner: String,
  description: String,
  
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Suspended'],
    default: 'Pending'
  },
  
  ratings: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  totalSales: {
    type: Number,
    default: 0
  },
  
  commissionRate: {
    type: Number,
    default: 10,
    min: 0,
    max: 100
  },
  
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ],
  
  supportContact: {
    email: String,
    phone: String,
    responseTime: String
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

module.exports = mongoose.model('Vendor', vendorSchema);
