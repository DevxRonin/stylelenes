const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: ['Sunglasses', 'Men', 'Women', 'Unisex', 'Premium Collection'],
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: 0,
    },
    oldPrice: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 24,
    },
    image: {
      type: String,
      required: [true, 'Main product image is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      default: 25,
      min: 0,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    badge: {
      type: String,
      default: '',
    },
    features: {
      type: [String],
      default: ['100% UV400 Protection', 'Polarized Lens', 'Premium Acetate Frame'],
    },
    frameShape: {
      type: String,
      default: 'Aviator',
    },
    frameMaterial: {
      type: String,
      default: 'Italian Acetate',
    },
    lensColor: {
      type: String,
      default: 'Smoky Grey',
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for fast search queries
productSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
