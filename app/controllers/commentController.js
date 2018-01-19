var express = require('express');
var commentController = express.Router();
var jwt = require('jsonwebtoken');
var Comment  = require('../models/comment');
var tokenMiddleware = require('../middleware/tokenMiddleware');
var secret_key = require('../settings/consts').secret_key;

commentController.use(function(req, res, next) {
    if(tokenMiddleware(req.headers.token)){
        next()
    }
    else{
        res.status(403).send('Failed token auth')
    }

});

commentController
    .get('/',function (req, res) {

        Comment.find({product: req.body.product},function (err, comments) {
            if (err){
                res.status(500).send('Error in server')
            }

            res.send(comments);
        })
    })
    .post('/', function (req, res) {
        var token = jwt.verify(req.headers.token, secret_key);

        var newComment = new Comment({
            author: token.id,
            description: req.body.description,
            product: req.body.product
        });

        newComment.save(function (err) {
            if (err) {
                res.status(500).send('Error in save category')
            }
        });

        res.send(newComment)
    })

    .put('/', function (req, res) {
        Comment.findById(req.body.id, function (err, doc) {
            if (req.body.description){
                doc.description = req.body.description
            }
            doc.save(function (err, updateDoc) {
                if (err) return handleError(err);
                res.send(updateDoc);
            });
        })
    });

module.exports = commentController;