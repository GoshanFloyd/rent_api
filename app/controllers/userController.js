var express = require('express');
var userController = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var tokenMiddleware = require('../middleware/tokenMiddleware');
var secret_key = require('../settings/consts').secret_key;

userController.use(function(req, res, next) {
    if(req.url === '/auth'){
        next()
    }
    else{
        if(tokenMiddleware(req.headers.token)){
            next()
        }
        else{
            res.status(403).send('Failed token auth')
        }
    }
});

userController // Main controller on user action's

    /**
        User auth
        @method: POST
        @param:
            @type username: <string>
            @type password: <string>
        @return
            @type token: <string>
    **/
    .post('/auth',function(req,res){

        User.findOne({username: req.body.username, password: req.body.password},function (err, user) {

            var response = {
                'username': user.username,
                'password': user.password,
                'role': user.role,
                'blocked': user.blocked,
                'id': user._id
            };

            var token = jwt.sign(response, 'rent_api_24_develop_secret_key');

            return res.json({
                token: token
            })
        })

    })

    /**
        Get current user information
        @method: GET
        @param:
            @type token: <string>
        @return:
            @type user: <User>
     **/

    .get('/', function (req, res) {

        try{
            var token = jwt.verify(req.headers.token, secret_key);
        }
        catch (err){
            res.status(500).send('Failed token');
        }


        User.findOne({username: token.username, password: token.password}, function (err, user) {
            res.send(user)
        })

    })

    /**
        Create user
        @method: POST
        @param:
            @type nickname: <string>
            @type username: <string>
            @type password: <string>
            @type avatar_image: <file>
        @return:
            @type user: <User>
     **/

    .post('/',function (req, res) {
        User.create({
            nickname: req.body.nickname,
            username: req.body.username,
            password: req.body.password,
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