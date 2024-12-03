require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    // Lấy accessToken từ header hoặc cookie
    const accessToken = req.header('Authorization')?.replace('Bearer ', '') || req.cookies.accessToken;

    // Kiểm tra accessToken
    if (!accessToken) {
        return res.status(401).json({ message: 'AccessToken không được cung cấp!' });
    }

    try {
        // Xác minh accessToken
        const decoded = jwt.verify(accessToken, jwtSecret);
        console.log("Xác minh accessToken thành công");
        req.user = decoded; // Lưu thông tin user vào request để dùng sau
        next(); // Tiếp tục xử lý
    } catch (error) {
        return res.status(401).json({ message: 'AccessToken không hợp lệ!' });
    }
}

module.exports = authenticateToken;
