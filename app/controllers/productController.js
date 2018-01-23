var express = require('express');
var productController = express.Router();
var jwt = require('jsonwebtoken');
var Product = require('../models/product');
var tokenMiddleware = require('../middleware/tokenMiddleware');
var secret_key = require('../settings/consts').secret_key;
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+'-'+file.originalname);
    }
});

var upload = multer({ storage: storage });


productController.use(function(req, res, next) {
    if((req.url === '/all')){
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

        var request = JSON.parse(req.body.jsondata);

        var images = [];

        if(req.files.length > 0){
            for(var i = 0; i < req.files.length; i++){
                images.push({
                    path: req.files[i].path
                })
            }
        }

        var newProduct = new Product({
            title: request.title,
            description: request.description,
            price: request.price,
            category: request.category,
            author: token.id,
            price_buy: request.price_buy,
            state: request.state,
            rent_terms: request.rent_terms,
            city_rent: request.city_rent,
            area_rent: request.area_rent,
            delivery_rent: request.delivery_rent,
            period_rent: request.period_rent,
            images: images
        });

        newProduct.save(function (err) {
            if (err) {
                res.status(500).send('Error in save product')
            }
        });

        res.send(newProduct)
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