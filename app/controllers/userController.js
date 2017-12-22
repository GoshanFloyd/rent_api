var express = require('express');
var userController = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/user');

userController.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

userController
    .get('/', function (req, res) {
        var token = jwt.sign({data: 'foo', user: 'bar'},'secret');
        var token_data = jwt.verify(token,'secret');

        res.json({
            token: token,
            token_data: token_data
        })
    })
    .post('/',function (req, res) {
        User.create({nickname: 'Test user'}, function (err, doc) {
            console.log(doc)
        })
    });

module.exports = userController;