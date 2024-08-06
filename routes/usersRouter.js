const express = require('express');
const router = express.Router();
const UserModel = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkToken = require('../other/authMiddleware');
const { SECRETKEY } = require('../config');
const { config } = require('dotenv');

router.post('/register', async (req, res) => {
    const { UserName, Email, PassWord, Phone, Address } = req.body;
    try {
        let user = await UserModel.findOne({ Email });
        if (user) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        user = new UserModel({ UserName, Email, PassWord, Phone, Address });
        await user.save();

        const token = jwt.sign({ userId: user._id }, SECRETKEY, { expiresIn: '1h' });

        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi đăng ký', error: error.message });
    }
});

// Đăng nhập
router.post('/login', async (req, res) => {
    const { Email, PassWord } = req.body;
    try {
        const user = await UserModel.findOne({ Email });
        if (!user) {
            return res.status(400).json({ message: 'Email không tồn tại' });
        }

        const isMatch = await bcrypt.compare(PassWord, user.PassWord);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu không đúng' });
        }

        const token = jwt.sign({ userId: user._id }, SECRETKEY, { expiresIn: '1h' });
        return res.status(200).json({ message: 'Thành công', token: token });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi đăng nhập', error: error.message });
    }
});



// routes/user.js (hoặc tên file router của bạn)
router.get('/profile', checkToken, async (req, res) => {
    try {
        const user = req.user; // Lấy thông tin người dùng từ req.user do middleware gắn vào
        res.status(200).json({
            UserName: user.UserName,
            Email: user.Email,
            Phone: user.Phone,
            Address: user.Address
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thông tin người dùng', error: error.message });
    }
});



// Cập nhật thông tin người dùng (có bảo mật)
router.put('/edit_profile', checkToken, async (req, res) => {
    const { UserName, Email, PassWord, Phone, Address } = req.body;

    try {
        const user = req.user; // Lấy thông tin người dùng từ req.user do middleware gắn vào

        user.UserName = UserName || user.UserName;
        user.Email = Email || user.Email;
        user.Phone = Phone || user.Phone;
        user.Address = Address || user.Address;

        if (PassWord) {
            user.PassWord = await bcrypt.hash(PassWord, 10);
        }

        await user.save();

        res.status(200).json({
            message: 'Thông tin người dùng đã được cập nhật',
            UserName: user.UserName,
            Email: user.Email,
            Phone: user.Phone,
            Address: user.Address
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật thông tin người dùng', error: error.message });
    }
});
module.exports = router;
