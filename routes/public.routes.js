const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Role = require('../models/Role');  
const bcrypt = require('bcrypt'); // Dùng bcrypt để hash password

// Route đăng ký người dùng mới
router.post('/sign', async (req, res) => {
    const { username, password, displayName, email, gender, university, year } = req.body;

    // Kiểm tra xem các trường cần thiết có được cung cấp không
    if (!username || !password || !displayName || !email) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Kiểm tra nếu người dùng đã tồn tại
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Lấy role user
        const userRole = await Role.findOne({ name: 'ROLE_USER' });
        // Tạo người dùng mới
        const newUser = new User({
            username,
            password: hashedPassword,
            displayName,
            email,
            gender,
            university,
            year,
            active: true,
            countDayCheckin: 0,  // Mặc định 0
            countDayTracking: 0,  // Mặc định 0
            tokenDevice: null,
            image: null,
            hasPhoto: false,
            roles: userRole._id,  // role user
        });

        // Lưu người dùng vào cơ sở dữ liệu
        await newUser.save();

        // Sử dụng populate để lấy thông tin chi tiết từ bảng Role
        const populatedUser = await User.findById(newUser._id).populate('roles');

        // Trả về thông tin người dùng
        res.status(200).json({
            message: 'Đăng ký thành công',
            user: populatedUser.toJSON() // Gọi phương thức toJSON để trả về thông tin người dùng
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
