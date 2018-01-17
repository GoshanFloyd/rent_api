var jwt = require('jsonwebtoken');

var secret_key = 'rent_api_24_develop_secret_key';

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