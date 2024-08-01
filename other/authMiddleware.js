const jwt = require('jsonwebtoken');
const { SECRETKEY } = require('../config');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ message: 'Không có quyền truy cập' });
    }

    try {
        const decoded = jwt.verify(token, SECRETKEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token không hợp lệ' });
    }
};

module.exports = authMiddleware;
