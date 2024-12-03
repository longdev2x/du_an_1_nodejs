const mongoose = require('mongoose');

const shoeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  url: { type: String, required: true }, // URL hình ảnh sản phẩm
  isFavorite: { type: Boolean, default: false },
  category: { type: String, enum: ['Nike', 'Adidas', 'Puma', 'Van'], required: true },
  quantity: { type: Number, required: true },
});

const Shoe = mongoose.model('Shoe', shoeSchema);

module.exports = Shoe;
