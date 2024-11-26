require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    // Lấy token từ header hoặc cookie
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies.token;

    // Kiểm tra token
    if (!token) {
        return res.status(401).json({ message: 'Token không được cung cấp!' });
    }

    try {
        // Xác minh token
        const decoded = jwt.verify(token, jwtSecret);
        console.log("Xác minh token thành công");
        req.user = decoded; // Lưu thông tin user vào request để dùng sau
        next(); // Tiếp tục xử lý
    } catch (error) {
        return res.status(403).json({ message: 'Token không hợp lệ!' });
    }
}

module.exports = authenticateToken;
