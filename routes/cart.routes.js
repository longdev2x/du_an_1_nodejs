const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart'); 

// Lấy giỏ hàng của người dùng
router.get('/', async (req, res) => {
    try {
        const { userId } = req.query;

        const cartItems = await Cart.find({ userId })
        if (!cartItems.length) {
            return res.status(404).json({
                status: 404,
                message: 'Không tìm thấy mục nào trong giỏ hàng',
                data: [],
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Lấy giỏ hàng thành công',
            data: cartItems,
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: 'Lỗi server',
            data: err.message,
        });
    }
});

// Thêm sản phẩm vào giỏ hàng
router.post('/add', async (req, res) => {
    try {
        const { userId, productId, productName, productImage, quantity, price } = req.body;

        let cartItem = await Cart.findOne({ userId, productId });
        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            cartItem = new Cart({ userId, productId, productName, productImage, quantity, price });
        }

        await cartItem.save();

        res.status(200).json({
            status: 200,
            message: 'Thêm sản phẩm vào giỏ hàng thành công',
            data: cartItem,
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: 'Lỗi server',
            data: err.message,
        });
    }
});


// Xóa sản phẩm khỏi giỏ hàng
router.post('/remove', async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const cartItem = await Cart.findOneAndDelete({ userId, productId });
        if (!cartItem) {
            return res.status(404).json({
                status: 404,
                message: 'Không tìm thấy sản phẩm trong giỏ hàng',
                data: null,
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
            data: cartItem,
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: 'Lỗi server',
            data: err.message,
        });
    }
});


// Cập nhật số lượng sản phẩm trong giỏ hàng
router.post('/update', async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        let cartItem = await Cart.findOne({ userId, productId });
        if (!cartItem) {
            return res.status(404).json({
                status: 404,
                message: 'Không tìm thấy sản phẩm trong giỏ hàng',
                data: null,
            });
        }

        if (quantity > 0) {
            cartItem.quantity = quantity;
            await cartItem.save();
        } else {
            await cartItem.remove();
        }

        res.status(200).json({
            status: 200,
            message: 'Cập nhật giỏ hàng thành công',
            data: cartItem,
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: 'Lỗi server',
            data: err.message,
        });
    }
});


module.exports = router;
