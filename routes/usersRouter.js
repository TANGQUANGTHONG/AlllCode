
const express = require('express');
const router = express.Router();
const UserModel = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../other/authMiddleware');
const { SECRETKEY } = require('../config');

// Đăng ký
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
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        const isMatch = await bcrypt.compare(PassWord, user.PassWord);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        const token = jwt.sign({ userId: user.Email }, SECRETKEY, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi đăng nhập', error: error.message });
    }
});


router.get('/profile/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await UserModel.findById(id); 
        if (user) {
            res.status(200).json({
                UserName: user.UserName,
                Email: user.Email,
                Phone: user.Phone,
                Address: user.Address
            });
        } else {
            res.status(404).json({ message: 'Người dùng không tồn tại' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thông tin người dùng', error: error.message });
    }
});


// Cập nhật thông tin người dùng
router.put('/edit_profile/:id', async (req, res) => {
    const { id } = req.params; // Lấy id từ URL params
    const { UserName, Email, PassWord } = req.body;

    try {
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        // Cập nhật thông tin người dùng
        user.UserName = UserName || user.UserName;
        user.Email = Email || user.Email;

        // Nếu có mật khẩu mới, mã hóa và cập nhật
        if (PassWord) {
            user.PassWord = await bcrypt.hash(PassWord, 10);
        }

        await user.save();

        res.status(200).json({
            message: 'Thông tin người dùng đã được cập nhật',
            UserName: user.UserName,
            Email: user.Email,
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật thông tin người dùng', error: error.message });
    }
});



module.exports = router;
