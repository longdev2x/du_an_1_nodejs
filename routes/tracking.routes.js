const express = require('express');
const router = express.Router();
const Tracking = require('../models/Tracking');
const verifyToken = require('../middlewares/auth.middleware');

// Lấy danh sách tất cả các tracking
router.get('/', verifyToken, async (req, res) => {
    try {
        const trackings = await Tracking.find();
        res.status(200).json(trackings);  // Trả về danh sách tracking
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Thêm một tracking mới
router.post('/', verifyToken, async (req, res) => {
    const { content, date, user } = req.body;

    if (!content) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const newTracking = new Tracking({
            content,
            date,
            user
        });

        await newTracking.save();
        res.status(201).json(newTracking);  // Trả về tracking đã tạo
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Cập nhật một tracking (theo ID)
router.post('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { content, date} = req.body;

    if (!content) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    date = new Date();

    try {
        const updatedTracking = await Tracking.findByIdAndUpdate(
            id,
            { content, date},
            { new: true }  // Trả về bản ghi đã được cập nhật
        );

        if (!updatedTracking) {
            return res.status(404).json({ message: 'Tracking not found' });
        }

        res.status(200).json(updatedTracking);  // Trả về tracking đã cập nhật
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Xóa một tracking (theo ID)
router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTracking = await Tracking.findByIdAndDelete(id);

        if (!deletedTracking) {
            return res.status(404).json({ message: 'Tracking not found' });
        }

        res.status(200).json({ message: 'Tracking deleted successfully' });  // Trả về thông báo thành công
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
