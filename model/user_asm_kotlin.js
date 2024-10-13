const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user_asm_kotlin = new Schema({
    Username: { type: String, require: true},
    Password: { type: String, require: true},
    Email: {type : String, require: false}
});


module.exports = mongoose.models.user_asm_kotlin || mongoose.model('user', user_asm_kotlin);