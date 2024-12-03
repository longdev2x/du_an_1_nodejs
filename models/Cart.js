const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shoe', required: true },
    productName: { type: String, required: true },
    productImage: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('CartItem', CartItemSchema);
