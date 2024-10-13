const mongoose = require('mongoose');

// Định nghĩa schema cho sản phẩm
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, // Loại bỏ khoảng trắng ở đầu và cuối
    },
    price: {
        type: Number,
        required: true,
        min: 0, // Giá không được nhỏ hơn 0
    },
    imageUrl: {
        type: String,
        required: true,
    },
});

// Tạo model từ schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
