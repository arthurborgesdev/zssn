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
exports.flagSurvivorAsInfected = function(req, res) {
	
	var nameId = req.body.name;

	Survivor.findOneAndUpdate(
		{ name: nameId }, 
		{ $inc: {
			infectionFlagPoints: 1
		}}, { new: true },
		function(err, survivor) {
			if (err) res.send(err);

			var infectionFlagPoints = survivor.infectionFlagPoints;
			console.log(infectionFlagPoints);

			if (infectionFlagPoints >= 3) {
				Survivor.findOneAndUpdate(
					{ name: nameId },
					{ $set: { inventoryLocked: true } },
					{ new: true },
					function(err, survivor) {
						if (err) res.send(err);
						res.json(survivor);
					}
				)
			} else {
				res.json(survivor)
			}
		}
	);	
};

// readPercentageOfNonSurvivors
exports.readPercentageOfNonSurvivors = function(req, res) {
	Survivor.count({}, function(err, totalCount) {
		if (err) res.send(err);
		var totalRegistered = totalCount;

		Survivor.count({inventoryLocked: true}, function (err, infectedCount) {
			if (err) res.send(err);
			var infectedRegistered = infectedCount;

			percentageOfInfected = ((infectedRegistered / totalRegistered) * 100 ).toFixed(2) + "%";

			res.json(percentageOfInfected);
		});
	});
};

// readPercentageOfSurvivors
exports.readPercentageOfSurvivors = function(req, res) {
	Survivor.count({}, function(err, totalCount) {
		if (err) res.send(err);
		var totalRegistered = totalCount;

		Survivor.count({inventoryLocked: false}, function (err, nonInfectedCount) {
			if (err) res.send(err);
			var nonInfectedRegistered = nonInfectedCount;

			percentageOfNonInfected = ((nonInfectedRegistered / totalRegistered) * 100 ).toFixed(2) + "%";

			res.json(percentageOfNonInfected);
		});
	});
};

// readAverageOfResources
exports.readAverageOfResources = function(req, res) {
	Survivor.aggregate([
		{ $match: { inventoryLocked: false } }, // only match non-infected survivors
		
		{ 
			$group: { 
				_id: "averageOfResources", 
				water: { $avg: "$inventory.water" }, 
				food: { $avg: "$inventory.food" },
				medication: { $avg: "$inventory.medication"},
				ammunition: { $avg: "$inventory.ammunition"} 
			} 
		}],

		function(err, result) {
			if (err) res.send(err);
			res.json(result);
		}
	);
};

// readPointsLost
exports.readPointsLost = function(req, res) {
	Survivor.aggregate([
		{ $match: { inventoryLocked: true } }, // only match infected survivors

		{
			$group: {
				_id: "pointsLost",
				water:  { $sum:"$inventory.water" },
				food:  { $sum:"$inventory.food" },
				medication:  { $sum:"$inventory.medication" },
				ammunition:  { $sum:"$inventory.ammunition" },
			} 	
		}
	], function(err, result) {
		if (err) res.send(err);

		var waterPoints = result[0].water * 4;
		var foodPoints = result[0].food * 3;
		var medicationPoints = result[0].medication * 2;
		var ammunitionPoints = result[0].ammunition * 1;

		var totalLostPoints = waterPoints + foodPoints + medicationPoints + ammunitionPoints;
		res.json(totalLostPoints);
	});
};


	
