var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
  name: { type: String, required: false },
  price: { type: Number, required: false },
  quantity: { type: Number, required: false },
  image: { type: String, required: false },

});

module.exports = mongoose.model('Product', productSchema);


