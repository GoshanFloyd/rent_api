var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/rentapi', {useMongoClient: true});

var ProductSchema = new Schema({
    description: String,
    title: String,
    price: Number,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    created_date: { type: Date, "default": Date.now },
    category: String,
    status: { type: Boolean, "default": null },
    images: { type: Array, "default": [] },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment'}],
    price_buy: Number,
    state: { type: String, default: 'good'},
    rent_terms: String,
    city_rent: {type: String, default: 'Алматы'},
    area_rent: {type: String, default: 'Медеуский'},
    delivery_rent: {type: String, default: 'Самовывоз'},
    period_rent: {type: String, default: 'day'}
});

module.exports = mongoose.model('Product', ProductSchema);