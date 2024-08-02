// authMiddleware.js
const jwt = require('jsonwebtoken');
const config = require('../config');
const UserModel = require('../model/user'); // Thêm model người dùng

const checkToken = async (req, res, next) => {
    const authHeader = req.header("Authorization");
    
    if (!authHeader) {
        return res.status(401).json({ "status": 401, "message": "Token không được cung cấp" });
    }

    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, config.SECRETKEY);
        const user = await UserModel.findById(decoded.userId);
        
        if (!user) {
            return res.status(404).json({ "message": "Người dùng không tồn tại" });
        }

        req.user = user; // Gắn thông tin người dùng vào req
        next();
    } catch (err) {
        res.status(403).json({ "err": err });
    }
};

module.exports = checkToken;
