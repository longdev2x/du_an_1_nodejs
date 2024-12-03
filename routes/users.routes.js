const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('../middlewares/auth.middleware');

router.get('/get-user-current', verifyToken, async (req, res) => {
    try {
        // Lấy người dùng hiện tại từ accessToken
        const user = await User.findById(req.user.id).select('-password').populate('roles');  // Không lấy mật khẩu
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);  // Trả về người dùng
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Cập nhật thông tin người dùng hiện tại
router.post('/update-myself', verifyToken, async (req, res) => {
    const { username, email, gender, birthPlace, university, year } = req.body;

    if (!username || !email) {
        return res.status(400).json({ message: 'Username and email are required' });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,  // Sử dụng id người dùng hiện tại từ accessToken
            { username, email, gender, birthPlace, university, year },
            { new: true }  // Trả về bản ghi đã cập nhật
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const populateUser = await updatedUser.populate('roles');
        res.status(200).json(populateUser);  // Trả về người dùng đã cập nhật và populate
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Cập nhật thông tin người dùng theo ID (dành cho Admin)
router.post('/update/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { username, email, gender, birthPlace, university, year } = req.body;

    // Kiểm tra xem người dùng có quyền Admin không
    if (!req.user.roles.includes('ROLE_ADMIN')) {
        return res.status(403).json({ message: 'Access denied, Admin role required' });
    }

    if (!username || !email) {
        return res.status(400).json({ message: 'Username and email are required' });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,  // Cập nhật người dùng theo ID
            { username, email, gender, birthPlace, university, year },
            { new: true }  // Trả về bản ghi đã cập nhật
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const populateUser = await updatedUser.populate('roles');

        res.status(200).json(populateUser);  // Trả về người dùng đã cập nhật và populate
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Lưu deviceToken vào User (dùng cho mobile hoặc web app)
router.get('/token-device', verifyToken, async (req, res) => {
    const { tokenDevice } = req.query;

    if (!tokenDevice) {
        return res.status(400).json({ message: 'Token device is required' });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,  // Sử dụng id người dùng hiện tại từ accessToken
            { tokenDevice },  // Lưu tokenDevice vào User
            { new: true }  // Trả về bản ghi đã cập nhật
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);  // Trả về người dùng với tokenDevice đã được lưu
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Thêm API searchByPage
router.post('/searchByPage', verifyToken, async (req, res) => {
    const { keyWord, pageIndex, size, status } = req.body;

    // Xử lý phân trang
    const page = pageIndex || 0;  // Mặc định là trang 0
    const pageSize = size || 15;  // Mặc định là 15 người dùng mỗi trang

    // Xử lý điều kiện tìm kiếm
    const searchConditions = {};
    if (keyWord) {
        searchConditions.$or = [
            { username: { $regex: keyWord, $options: 'i' } },
            { email: { $regex: keyWord, $options: 'i' } }
        ];
    }

    if (status) {
        searchConditions.status = status;
    }

    try {
        const users = await User.find(searchConditions)
            .skip(page * pageSize)
            .limit(pageSize)
            .select('-password')
            .populate('roles');

        const totalElements = await User.countDocuments(searchConditions);
        const totalPages = Math.ceil(totalElements / pageSize);

        // Trả về dữ liệu phân trang cho Flutter
        const response = {
            content: users,
            empty: users.length === 0,
            first: page === 0,
            last: page === totalPages - 1,
            number: page,
            numberOfElements: users.length,
            size: pageSize,
            totalElements,
            totalPages,
            objPageable: { page, size: pageSize },
            objSort: { sorted: true, unsorted: false, empty: false } // Đây là dữ liệu giả, có thể tuỳ chỉnh thêm nếu cần
        };

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
