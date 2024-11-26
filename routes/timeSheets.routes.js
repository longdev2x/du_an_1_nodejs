const express = require('express');
const router = express.Router();
const axios = require('axios');

const TimeSheet = require('../models/TimeSheet');
const authenticateToken = require('../middlewares/auth.middleware');


// Route GET /time-sheets - Lấy danh sách điểm danh
router.get('/', authenticateToken, async (req, res) => {
    try {
        const timeSheets = await TimeSheet.find();
        res.status(200).json(timeSheets);
    } catch (error) {
        console.error('Error fetching time sheets:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Hàm lấy IP Public của server - Không phải ip local, phía client cũng phải getIP Public và gửi lên
const getServerIP = async () => {
    try {
        const response = await axios.get('https://ifconfig.me');
        return response.data;
    } catch (error) {
        console.error('Error fetching server IP:', error.message);
        throw new Error('Unable to fetch server IP');
    }
};

//time-sheets/check-in - Điểm danh và kiểm tra IP
router.get('/check-in', authenticateToken, async (req, res) => {
    const { ip } = req.query;

    if (!ip) {
        return res.status(400).json({ message: 'IP is required' });
    }

    try {
        // Lấy IP của server
        const serverIP = await getServerIP();

        // Kiểm tra thông tin user từ middleware
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated'});
        }

        // Tạo TimeSheet mới
        const timeSheet = await TimeSheet.create({
            dateAttendance: new Date(),
            note: `Checked in from IP: ${ip}`,
            ip,
            user: req.user.id,
            isOffline: ip !== serverIP,
        });
        // Populate user thủ công để get toàn bộ User không chỉ lấy id
        await timeSheet.populate('user');

        console.log("Ip nhân viên check :", ip);
        console.log("Ip công ty là :", serverIP);

        // Phản hồi kết quả
        res.status(201).json({
            message: ip === serverIP ? 'Đã CheckIn tại công ty' : 'Đã CheckIn ngoài công ty',
            ...timeSheet.toJSON(),
        });
    } catch (error) {
        console.error('Error during check-in:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
