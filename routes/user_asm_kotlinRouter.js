const express = require('express');
const router = express.Router();
const User_kotlinModel = require('../model/user_asm_kotlin');
const bcrypt = require('bcrypt');


// Sửa trong file user_asm_kotlinRouter.js
router.post('/register', async (req, res) => {
    const { Username, Password, Email } = req.body;
    try {
        let userKotlin = await User_kotlinModel.findOne({ Email });
        if (userKotlin) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }
        userKotlin = new User_kotlinModel({ Username, Password, Email });
        await userKotlin.save();
        res.status(200).json({ message: 'Đăng ký thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi đăng ký', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { Username, Password } = req.body;
    try {
        const userKotlin = await User_kotlinModel.findOne({ Username });
        if (!userKotlin) {
            return res.status(400).json({ message: 'Tài khoản không tồn tại' });
        }
        const isMatch = await bcrypt.compare(Password, userKotlin.Password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu không đúng' });
        }
        return res.status(200).json({ message: 'Đăng nhập thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi đăng nhập', error: error.message });
    }
});


module.exports = router;