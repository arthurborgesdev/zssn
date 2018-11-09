
//---------- Base Setup --------------------

var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

var mongoose = require('mongoose');
var Survivor = require('./api/models/survivor');
var bodyParser = require('body-parser');

var routes = require('./api/routes/route');
var config = require('./config');
//------------------------------------------


// Mongoose Connection and BodyParser Middleware

var envVar = config.mongoURI[app.settings.env];
mongoose.connect(envVar, function(err, res) {
	if (err) { 
		console.log('Error connecting to the database. ' + err); 
	} else {
		console.log('Connected to Database: ' + envVar);
	}
});

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

module.exports = app;