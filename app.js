
//---------- Base Setup --------------------

var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

var mongoose = require('mongoose');
var Survivor = require('./api/models/zssnModel');
var bodyParser = require('body-parser');

//------------------------------------------


// Mongoose Connection and BodyParser Middleware


mongoose.connect('mongodb://localhost/zssn');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//------------------------------------------


// ----- Routes requiring and settings -----

var routes = require('./api/routes/zssnRoutes');
routes(app);

// -----------------------------------------


// ---- Server start and message logging ---

app.listen(port);
console.log(`Zombie Survival Social Network Server listening on port ${port}!`);

// -----------------------------------------