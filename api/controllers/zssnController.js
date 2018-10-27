var mongoose = require('mongoose');
var Survivor = mongoose.model('Survivor');

// addSurvivor
exports.addSurvivor = function(req, res) {
	var newSurvivor = new Survivor(req.body);
	newSurvivor.save(function(err, survivor) {
		if (err) res.send(err);
		res.json(survivor);
	});
};


// updateSurvivorLocation
exports.updateSurvivorLocation = function(req, res) {
	
	var nameId = req.body.name;
	var longitude = req.body["lastLocation.longitude"];
	var latitude = req.body["lastLocation.latitude"];

	Survivor.findOneAndUpdate(
		{ name: nameId }, 
		{ $set: {
			"lastLocation.longitude": longitude,
			"lastLocation.latitude": latitude
		}}, { new: true },
		function(err, survivor) {
			if (err) res.send(err);
			res.json(survivor);
	});	
};

// flagSurvivorAsInfected


// readPercentageOfNonSurvivors


// readPercentageOfSurvivors


// readAverageOfResources


// readPointsLost
