
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middlewares/auth.middleware');

// Login route
router.post('/token', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Missing username or password' });
    };

    try {
        // Tìm người dùng trong DB
        const user = await User.findOne({ username }).populate('roles');
        if (!user) {
            return res.status(400).json({ message: 'Không tìm thấy người dùng' });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu không khớp' });
        }

        // Tạo JWT accessToken
        const accessToken = jwt.sign({ id: user._id, username: user.username, roles: user.roles}, jwtSecret, { expiresIn: jwtExpiresIn });

        // Trả về accessToken cùng thông tin người dùng
        res.status(200).json({
            status : 200,
            message: 'Đăng nhập thành công',
            accessToken: accessToken,
            user: {
                username: user.username,
                displayName: user.displayName,
                email: user.email
            },
            data: {
                id: user._id,
                username: user.username,
                displayName: user.displayName,
                email: user.email,
                role: user.roles[0]
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Logout route
router.delete('/logout', authenticateToken, (req, res) => {
    try {
        res.status(200).json({
            message: 'Đăng xuất thành công'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
