var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/rentapi', {useMongoClient: true});

var ProductSchema = new Schema({
    description: String,
    title: String,
    price: Number,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    created_date: { type: Date, "default": Date.now },
    category: { type : Array , "default" : [] },
    status: { type: Boolean, "default": null },
    images: { type: Array, "default": [] }
});

module.exports = mongoose.model('Product', ProductSchema);