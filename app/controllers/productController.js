var express = require('express');
var productController = express.Router();
var jwt = require('jsonwebtoken');
var Product = require('../models/product');
var tokenMiddleware = require('../middleware/tokenMiddleware');
var secret_key = require('../settings/consts').secret_key;
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

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

        Product.find({author: token._id},function (err, products) {

            console.log(products);
            if (err){
                res.status(500).send('Error in server')
            }

            res.send(products);
        })
    })
    .get('/all', function (req, res) {
        Product.find({}).limit(100).exec(function (err, docs) {
            res.send(docs)
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
    .post('/', upload.array('photos'), function (req, res) {
        var token = jwt.verify(req.headers.token, secret_key);

        console.log(req.body);
        console.log(req.files);
        //
        // var newProduct = new Product({
        //     title: req.body.title,
        //     description: req.body.description,
        //     price: req.body.price,
        //     category: req.body.category,
        //     author: token.id
        // });
        //
        // newProduct.save(function (err) {
        //     if (err) {
        //         res.status(500).send('Error in save product')
        //     }
        // });
        //
        // res.send(newProduct)
    })

    .put('/', function (req, res) {
        Product.findById(req.body.id, function (err, doc) {
            if (req.body.title){
                doc.title = req.body.title
            }
            if (req.body.description){
                doc.description = req.body.description
            }
            if(req.body.price){
                doc.price = req.body.price
            }
            if (req.body.category){
                doc.category = req.body.category
            }
            doc.save(function (err, updateDoc) {
                if (err) return handleError(err);
                res.send(updateDoc);
            });
        })
    });

module.exports = productController;