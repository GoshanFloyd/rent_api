var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/rentapi');

var UserSchema = new Schema({
    nickname: String,
    username: String,
    password: String,
    user_id: Number,
    note: String,
    created_date: Date,
    avatar_image: String
});

module.exports = mongoose.model('User', UserSchema);