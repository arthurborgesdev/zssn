var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var Survivor = require('./api/models/zssnModel');
var bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/zssn');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var routes = require('./api/routes/zssnRoutes');
routes(app);

app.listen(port);

console.log(`Zombie Survival Social Network Server listening on port ${port}!`);
