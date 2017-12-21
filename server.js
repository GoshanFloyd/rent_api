// BASE SETUP

var express = require('express');
var app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8000;

var router = express.Router();

var User = require('./app/models/user');


// EXAMPLE MIDDLEWARE
router.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

// EXAMPLE ROUTER ACTION
router.get('/', function (req, res) {
    res.json({ message: 'test message'})
});

// EXAMPLE GROUPING ROUTER
app.use('/api', router);

app.listen(port);

console.log('Magic happens on port ' + port);