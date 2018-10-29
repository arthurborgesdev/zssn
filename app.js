
//---------- Base Setup --------------------

var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

var mongoose = require('mongoose');
var Survivor = require('./api/models/zssnModel');
var bodyParser = require('body-parser');

var routes = require('./api/routes/zssnRoutes');
//------------------------------------------


// Mongoose Connection and BodyParser Middleware

mongoose.connect('mongodb://localhost/zssn');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//------------------------------------------


// ----------- Routes loading --------------

routes(app);

// -----------------------------------------


// ---- Server start and message logging ---

app.listen(port);
console.log(`Zombie Survival Social Network Server listening on port ${port}!`);

// -----------------------------------------