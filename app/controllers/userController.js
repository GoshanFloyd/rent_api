var express = require('express');
var userController = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var tokenMiddleware = require('../middleware/tokenMiddleware');

userController.use(function(req, res, next) {
    if(req.url === '/auth'){
        next()
    }
    else{
        if(tokenMiddleware(req.headers.token)){
            next()
        }
        else{
            res.status(403);
            res.send('Failed token auth')
        }
    }
});

userController
    .post('/auth',function(req,res){

        User.findOne({username: req.body.username, password: req.body.password},function (err, user) {

            var response = {
                'username': user.username,
                'password': user.password,
                'role': user.role,
                'blocked': user.blocked
            };

            var token = jwt.sign(response, 'rent_api_24_develop_secret_key');

            return res.json({
                token: token
            })
        })

    })
    .get('/', function (req, res) {
        User.find({}, function (err, docs) {
            res.send(docs)
        })

    })
    .post('/',function (req, res) {
        User.create({
            nickname: 'Test user',
            username: 'egorkulik9696@gmail.com',
            password: 'Qwe123',
            role: 'user',
            avatar_image: null,
            blocked: false
        }, function (err, user) {

            if (err) throw err;

            res.send({
                status: 'done',
                user: user
            })

        });
    });

module.exports = userController;