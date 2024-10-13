const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { schema } = require('./product');
const Schema = mongoose.Schema;

const user_asm_kotlin = new Schema({
    Username: { type: String, require: true},
    Password: { type: String, require: true},
    Email: {type : String, require: false}
})