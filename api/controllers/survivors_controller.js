var survivorService = require("../services/survivor_service");

exports.addSurvivorController = function(req, res) {
	survivorService.addSurvivor(req, res);
}

exports.updateSurvivorLocationController = function(req, res) {
	survivorService.updateSurvivorLocation(req, res);
}

exports.flagSurvivorAsInfectedController = function(req, res) {
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