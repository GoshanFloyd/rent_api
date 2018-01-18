var jwt = require('jsonwebtoken');
var secret_key = require('../settings/consts').secret_key;

var checkToken = function (token) {
    try {
        var decoded = jwt.verify(token, secret_key);
        return {
            data: decoded,
            status: true
        };
    } catch(err) {
        return false
    }
};

module.exports = checkToken;