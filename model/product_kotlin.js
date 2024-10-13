const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Thêm thư viện uuid

const productSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4, // Tạo ID ngẫu nhiên mỗi khi tạo sản phẩm mới
        unique: true // Đảm bảo rằng ID là duy nhất
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);
