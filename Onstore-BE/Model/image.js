const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  path: { 
    type: String,
    required: true,
  },
  productId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
});

module.exports = mongoose.model('Image', imageSchema);