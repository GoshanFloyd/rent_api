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
        res.status(403).send('Failed token auth')
    }

});

productController
    /**
     *  Get my products
     *  @method: GET
     *  @param:
     *      @var: token
     *      @type: string
     *
     *  @return:
     *      @var products:
     *      @type: Array<Product>
     */
    .get('/',function (req, res) {
        var token = jwt.verify(req.headers.token, secret_key);

        Product.find({author: token.id},function (err, products) {
            if (err){
                res.status(500).send('Error in server')
            }

            res.send(products);
        })
    })
    /**
     *  Add product
     *  @method: POST
     *      @var: token
     *      @type: string
     *
     *      @var: title,
     *      @type: string
     *
     *      @var: description
     *      @type: string
     *
     *      @var: price
     *      @type: integer
     *
     *      @var category:
     *      @type: Array<Category>
     *
     *
     */
    .post('/', function (req, res) {
        var token = jwt.verify(req.headers.token, secret_key);

        var newProduct = new Product({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            author: token.id
        });

        newProduct.save(function (err) {
            if (err) {
                res.status(500).send('Error in save product')
            }
        });

        res.send(newProduct)
    });

module.exports = productController;