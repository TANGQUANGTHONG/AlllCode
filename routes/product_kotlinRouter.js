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

// Route để lấy sản phẩm theo ID
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id); // Lấy sản phẩm theo ID từ MongoDB
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' }); // Trả về lỗi 404 nếu không tìm thấy sản phẩm
        }
        res.status(200).json(product); // Trả về sản phẩm với mã trạng thái 200
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy sản phẩm', error: error.message }); // Trả về lỗi nếu có
    }
});

// Route để lọc sản phẩm theo loại
router.get('/products/type/:type', async (req, res) => {
    try {
        const products = await Product.find({ type: req.params.type }); // Lọc sản phẩm theo loại
        if (products.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm theo loại này' }); // Trả về lỗi 404 nếu không tìm thấy sản phẩm
        }
        res.status(200).json(products); // Trả về danh sách sản phẩm với mã trạng thái 200
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lọc sản phẩm theo loại', error: error.message }); // Trả về lỗi nếu có
    }
});

module.exports = router;
