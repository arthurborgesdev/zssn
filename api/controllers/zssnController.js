var mongoose = require('mongoose');
var Survivor = mongoose.model('Survivor');

exports.addSurvivor = function(req, res) {
	var newSurvivor = new Survivor(req.body);
	newSurvivor.save(function(err, survivor) {
		if (err) res.send(err);
		res.json(survivor);
	});
};


// updateSurvivorLocation


// flagSurvivorAsInfected


// readPercentageOfNonSurvivors


// readPercentageOfSurvivors


// readAverageOfResources


// readPointsLost
