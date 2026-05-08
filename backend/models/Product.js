const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    enum: ['Basmati', 'Jasmine', 'Brown Rice', 'Specialty', 'Organic'],
    required: [true, 'Please select a category']
  },
  riceType: {
    type: String,
    enum: ['Long Grain', 'Medium Grain', 'Short Grain', 'Aromatic', 'Organic'],
    required: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: Number,
  discountPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative']
  },
  images: [
    {
      url: String,
      altText: String
    }
  ],
  ratings: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      title: String,
      comment: String,
      verified: Boolean,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  specifications: {
    weight: String,
    origin: String,
    certifications: [String],
    storageInstructions: String,
    nutritionInfo: mongoose.Schema.Types.Mixed
  },
  tags: [String],
  sku: {
    type: String,
    unique: true,
    required: true
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isOrganic: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  delivery: {
    states: [String],
    estimatedDays: Number,
    freeShipping: Boolean
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

// Index for better query performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, riceType: 1 });
productSchema.index({ vendor: 1 });
productSchema.index({ isFeatured: 1, isBestSeller: 1 });

module.exports = mongoose.model('Product', productSchema);
