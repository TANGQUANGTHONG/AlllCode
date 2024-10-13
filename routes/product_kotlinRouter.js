const express = require('express');
const Product = require('../model/product_kotlin'); // Đường dẫn phải đúng

const router = express.Router();

// Route để lấy tất cả sản phẩm
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find(); // Lấy tất cả sản phẩm từ MongoDB
        res.status(200).json(products); // Trả về danh sách sản phẩm với mã trạng thái 200
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm', error: error.message }); // Trả về lỗi nếu có
    }
});

module.exports = router;
