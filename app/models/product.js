var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/rentapi');

var ProductSchema = new Schema({
    product_id: Number,
    description: String,
    title: String,
    price: Number,
    category: { type : Array , "default" : [] },
    status: { type: Boolean, "default": false}
});

module.exports = mongoose.model('Product', ProductSchema);