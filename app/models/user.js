var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/rentapi', { useMongoClient: true});

var UserSchema = new Schema({
    nickname: String,
    username: { type: String, index: { unique: true }},
    password: String,
    role: String,
    created_date: { type: Date, default: Date.now },
    avatar_image: String,
    blocked: Boolean,
    phone: String,
    money: { type: Number, default: 0}
});

var User = mongoose.model('User', UserSchema);

module.exports = User;