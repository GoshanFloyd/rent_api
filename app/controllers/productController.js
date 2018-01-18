var express = require('express');
var productController = express.Router();
var jwt = require('jsonwebtoken');
var Product = require('../models/product');
var tokenMiddleware = require('../middleware/tokenMiddleware');
var secret_key = require('../settings/consts').secret_key;

productController.use(function(req, res, next) {
    if(tokenMiddleware(req.headers.token)){
        next()
    }
    else{
        res.status(403);
        res.send('Failed token auth')
    }

});

productController.get('/',function (req, res) {
    res.send('Hello')
});

module.exports = productController;