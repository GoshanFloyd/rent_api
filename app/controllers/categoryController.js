var express = require('express');
var categoryController = express.Router();
var jwt = require('jsonwebtoken');
var Category = require('../models/category');
var tokenMiddleware = require('../middleware/tokenMiddleware');
var secret_key = require('../settings/consts').secret_key;

categoryController.use(function(req, res, next) {
    if(tokenMiddleware(req.headers.token)){
        next()
    }
    else{
        res.status(403).send('Failed token auth')
    }

});

categoryController
    .get('/',function (req, res) {
        var token = jwt.verify(req.headers.token, secret_key);

        Category.find({parent_category: null},function (err, categories) {
            if (err){
                res.status(500).send('Error in server')
            }

            res.send(categories);
        })
    })
    .get('/child', function (req, res) {
        Category.find({parent_category: req.body.parent_category}).exec(function (err, docs) {
            res.send(docs)
        })
    })
    .post('/', function (req, res) {
        var token = jwt.verify(req.headers.token, secret_key);

        var newCategory = new Category({
            title: req.body.title,
            parent_category: req.body.category
        });

        newCategory.save(function (err) {
            if (err) {
                res.status(500).send('Error in save category')
            }
        });

        res.send(newCategory)
    })

    .put('/', function (req, res) {
        Category.findById(req.body.id, function (err, doc) {
            if (req.body.title){
                doc.title = req.body.title
            }
            if (req.body.parent_category){
                doc.parent_category = req.body.parent_category
            }
            doc.save(function (err, updateDoc) {
                if (err) return handleError(err);
                res.send(updateDoc);
            });
        })
    });

module.exports = categoryController;