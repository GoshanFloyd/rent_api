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

app.get('/', function (req, res) {
    res.status(200).send('All work a very fine.')
})

app.use('/uploads', express.static('./uploads'));

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


app.listen(port);