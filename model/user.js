const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//192.168.1.22
//172.16.104.197(fpt)
const user = new Schema({
    UserName: { type: String, required: true, unique: true },
    PassWord: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Phone: { type: String },
    Address: { type: String },
});

// Hash mật khẩu trước khi lưu vào cơ sở dữ liệu
user.pre('save', async function(next) {
    if (!this.isModified('PassWord')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.PassWord = await bcrypt.hash(this.PassWord, salt);
        next();
    } catch (error) {
        next(error);
    }
});



module.exports = mongoose.models.user || mongoose.model('user', user);