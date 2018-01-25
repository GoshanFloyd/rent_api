// BASE SETUP

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var helmet = require('helmet');
var cors = require('cors');


var userController = require('./app/controllers/userController');
var productController = require('./app/controllers/productController');
var categoryController = require('./app/controllers/categoryController');
var commentController = require('./app/controllers/commentController');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(helmet());
app.use(cors());
var port = process.env.PORT || 8200;

app.use('/api/user', userController);
app.use('/api/product', productController);
app.use('/api/category', categoryController);
app.use('/api/comment', commentController);

app.use('/', express.static('./frontend'));
app.use('/uploads', express.static('./uploads'));

app.get('/', function (req, res) {
  res.sendFile('./frontend/index.html');
})

app.use(function(err, req, res, next) {
    console.error(err);
    res.status(500).send(err);
});

console.log(port);
app.listen(port);
