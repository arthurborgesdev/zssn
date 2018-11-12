var survivorService = require("../services/survivor_service");

exports.addSurvivorController = function(req, res) {

	var addSurvivorObj = {
		name: req.body.name,
		age: req.body.age,
		gender: req.body.gender,
		"lastLocation.latitude": req.body["lastLocation.latitude"],
		"lastLocation.longitude": req.body["lastLocation.longitude"],
		"inventory.water": req.body["inventory.water"],
		"inventory.food": req.body["inventory.food"],
		"inventory.medication": req.body["inventory.medication"],
		"inventory.ammunition": req.body["inventory.ammunition"]
	}
	req.addSurvivorObj = addSurvivorObj;
	survivorService.addSurvivor(req, res);
}

exports.updateSurvivorLocationController = function(req, res) {

	var updateSurvivorLoc = {
		nameId: req.body.name,
		longitude: req.body["lastLocation.longitude"],
		latitude: req.body["lastLocation.latitude"]
	}
	req.updateSurvivorLoc = updateSurvivorLoc;
	survivorService.updateSurvivorLocation(req, res);
}

exports.flagSurvivorAsInfectedController = function(req, res) {

	req.survivorName = req.body.name;

	survivorService.flagSurvivorAsInfected(req, res);
}

exports.readPercentageOfNonSurvivorsController = function(req, res) {
	survivorService.readPercentageOfNonSurvivors(req, res);
}

exports.readPercentageOfSurvivorsController = function(req, res) {
	survivorService.readPercentageOfSurvivors(req, res);
}

exports.readAverageOfResourcesController = function(req, res) {
	survivorService.readAverageOfResources(req, res);
}

exports.readPointsLostController = function(req, res) {
	survivorService.readPointsLost(req, res);
}