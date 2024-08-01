const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const API = new Schema({
        id: { type: ObjectId }, //khóa chính
        name: { type: String},
        price: {type: Number},
        quality: {type: Number},
        type: {type: String}
    });;
module.exports = mongoose.models.API || mongoose.model('API', API);

