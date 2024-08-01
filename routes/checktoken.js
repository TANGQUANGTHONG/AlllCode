// Import các module cần thiết
const express = require('express');
const router = express.Router();
const UserModel = require('../model/user');
const authMiddleware = require('../other/authMiddleware');

// Route kiểm tra token
router.get('/checktoken', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        res.status(200).json({
            UserName: user.UserName,
            Email: user.Email,
            Phone: user.Phone,
            Address: user.Address
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi kiểm tra token', error: error.message });
    }
});

module.exports = router;
