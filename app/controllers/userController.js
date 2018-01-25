var express = require('express');
var userController = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var tokenMiddleware = require('../middleware/tokenMiddleware');
var secret_key = require('../settings/consts').secret_key;

userController.use(function(req, res, next) {

    console.log(req.url);

    if((req.url === '/auth' || req.url ==='/create') || req.method == 'GET'){
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

            if(err){
                res.status(404).send('User not found')
            }

            var response = {
                'username': user.username,
                'password': user.password,
                'role': user.role,
                'blocked': user.blocked,
                'phone': user.phone,
                'id': user._id
            };

            var token = jwt.sign(response, secret_key);

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

            if(err){
                res.status(404).send('User not found');
            }

            res.send(user)
        })

    })

    .get('/:id', function (req, res) {
        User.findById(req.params.id, function (err, user) {
            if(err){
                res.status(500).send('User not found')
            }

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

    .post('/create',function (req, res) {
        User.create({
            nickname: req.body.nickname,
            username: req.body.username,
            password: req.body.password,
            role: 'user',
            avatar_image: null,
            blocked: false,
            phone: req.body.phone
        }, function (err, user) {

            if (err) {
                res.status(500).send('Error on create user')
            }

            console.log(user);

            res.status(200).send({
                status: 'done',
                user: user
            })

        });
    })
    .put('/', function (req, res) {

        var request = JSON.parse(req.body.jsondata);


        User.findById(request.id, function (err, user) {

            if(request.pact_name){
                user.pact_name = request.pact_name
            }
            if(request.pact_surname){
                user.pact_surname = request.pact_surname
            }
            if(request.pact_lastname){
                user.pact_lastname = request.pact_lastname
            }
            if(request.pact_iin){
                user.pact_iin = request.pact_iin
            }
            if(request.pasword){
                user.password = request.password
            }

            user.save(function (err) {
                if(err) res.status(500).send('User dont updated')

                res.status(200).send(user)
            })
        })
    })
;

module.exports = userController;