// product.js
const mongoose = require('mongoose');

// Define the Review schema to include username and rating
const reviewSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true, // Require a username for each review
  },
  rating: {
    type: Number,
    required: true,
    min: 1, // Minimum rating
    max: 5,  // Maximum rating
  },
  text: {
    type: String,
    required: true, // Include the review text
  },
}, { timestamps: true });

// Define the Product schema for clothing items
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Men',
      'Women',
      'Children',
    ],
  },
  type: {
    type: String,
    required: true,
    enum: [
      'Outdoor',
      'Sport',
      'Luxury',
      'Casual',
      'Formal',
      'Activewear',
      'Sleepwear',
      'Loungewear',
    ],
  },
  size: {
    type: String,
    required: true,
    enum: [
      'XS', 'S', 'M', 'L', 'XL', 'XXL',
    ],
  },
  color: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  material: {
    type: String,
    required: false,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  images: {
    type: [String],
    required: false,
  },
  discountPrice: {
    type: Number,
    required: false,
  },
  averageRating: {
    type: Number,
    required: false,
    min: 0,
    max: 5,
  },
  reviews: [reviewSchema], // Store an array of reviews
  careInstructions: {
    type: String,
    required: false,
  },
  releaseDate: {
    type: Date,
    required: false,
  },
});

// Create and export the Product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;