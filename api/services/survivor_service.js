var mongoose = require('mongoose');
var Survivor = mongoose.model('Survivor');
var survivorValidator = require('../validators/survivor_validator');

// addSurvivor
exports.addSurvivor = function(req, res) {

	survivorValidator.addSurvivorValidator(req, res, function() {

		if(req.addSurvivorObj == null) {
			res.json({ErrorMessage: req.errorMessage});
		} else {
			var newSurvivor = new Survivor(req.addSurvivorObj);
			newSurvivor.save(function(err, survivor) {
				if (err) res.send(err);
				res.json(survivor);
			});

		}
	})

};


// updateSurvivorLocation
exports.updateSurvivorLocation = function(req, res) {

	// call validator here with req params

	survivorValidator.updateSurvivorLocationValidator(req, res, function() {

		if (req.updateSurvivorLoc == null) {
			console.log(req.updateSurvivorLoc);
			res.json({ errorMessage: "The survivor can't change location because it's infected"});

		} else {
			Survivor.findOneAndUpdate(
				{ name: req.updateSurvivorLoc.nameId }, 
				{ $set: {
					"lastLocation.longitude": req.updateSurvivorLoc.longitude,
					"lastLocation.latitude": req.updateSurvivorLoc.latitude
				}}, { new: true },
				function(err, survivor) {
					if (err) res.send(err);
					res.json(survivor);
			})
		}
	})	
};


// flagSurvivorAsInfected
exports.flagSurvivorAsInfected = function(req, res) {
	

	survivorValidator.flagSurvivorValidator(req, res, function() {


		if (req.errorMessage) {
			//res.json({message: "The survivor is already a zombie!"})
			res.json({ErrorMessage: req.errorMessage})
		} else {
			console.log("auha");
			Survivor.findOneAndUpdate(
				{ name: req.survivorName }, 
				{ $inc: {
					infectionFlagPoints: 1
				}}, { new: true },
				function(err, survivor) {
					if (err) res.send(err);

					var infectionFlagPoints = survivor.infectionFlagPoints;
					//console.log(infectionFlagPoints);

					if (infectionFlagPoints >= 3) {
						Survivor.findOneAndUpdate(
							{ name: req.survivorName },
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
		}
	})
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


	