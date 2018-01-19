var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/rentapi', {useMongoClient: true});

var CommentSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    description: String,
    created_date: { type: Date, "default": Date.now}
});

module.exports = mongoose.model('Comment', CommentSchema);