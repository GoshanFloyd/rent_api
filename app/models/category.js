var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/rentapi', { useMongoClient: true});

var CategorySchema = new Schema({
    title: String,
    parent_category: { type: Schema.Types.ObjectId, ref: 'Category' },
    created_date: { type: Date, "default": Date.now }
});

var Category = mongoose.model('Category', CategorySchema);

module.exports = Category;