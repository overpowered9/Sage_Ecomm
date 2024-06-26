const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  articleNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, enum: ['formal', 'casual', 'slippers'], required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  sizes: [{
    size: { type: Number, required: true },
    quantity: { type: Number, required: true }
  }],
  imageUrls: [{ type: String }] ,// Changed from single imageUrl to multiple imageUrls
  isFeatured: { type: Boolean, default: false }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
