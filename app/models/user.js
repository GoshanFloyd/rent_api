var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
   nickname: String
});

module.exports = mongoose.model('User', UserSchema);