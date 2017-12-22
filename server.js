// BASE SETUP

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var helmet = require('helmet');

var userController = require('./app/controllers/userController');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(helmet());

var port = process.env.PORT || 7400;

// EXAMPLE GROUPING ROUTER
app.use('/api/user', userController);

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port);

console.log('Magic happens on port ' + port);