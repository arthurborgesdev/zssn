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

//tradeItems
exports.tradeItems = function(req, res) {

	// Receive sender items from PUT and add them to vars
	var senderName = req.body["sender.name"];
	var senderWater = req.body["sender.water"];
	var senderFood = req.body["sender.food"];
	var senderMedication = req.body["sender.medication"];
	var senderAmmunition = req.body["sender.ammunition"];

	// Object created for later use in trade items part
	var senderItems = {
		water: senderWater,
		food: senderFood,
		medication: senderMedication,
		ammunition: senderAmmunition
	}

	// Validate fields (convert null and undefined to 0 )
	if (senderWater === undefined || senderWater === null) {
		senderWater = 0;
	}

	if (senderFood === undefined || senderFood === null) {
		senderFood = 0;
	}

	if (senderMedication === undefined || senderMedication === null) {
		senderMedication = 0;
	}

	if (senderAmmunition === undefined || senderAmmunition === null) {
		senderAmmunition = 0;
	}

	// calculate sender total of points
	var senderItemPoints = senderWater      * 4 +
						   senderFood       * 3 +
						   senderMedication * 2 +
						   senderAmmunition * 1;

	// Receive receiver items from PUT and add them to vars
	var receiverName = req.body["receiver.name"];
	var receiverWater = req.body["receiver.water"];
	var receiverFood = req.body["receiver.food"];
	var receiverMedication = req.body["receiver.medication"];
	var receiverAmmunition = req.body["receiver.ammunition"];

	// Object created for later use in trade items part
	var receiverItems = {
		water: receiverWater,
		food: receiverFood,
		medication: receiverMedication,
		ammunition: receiverAmmunition
	}

	// Validate fields (convert null and undefined to 0 )
	if (receiverWater === undefined || receiverWater === null) {
		senderWater = 0;
	}

	if (receiverFood === undefined || receiverFood === null) {
		receiverFood = 0;
	}

	if (receiverMedication === undefined || receiverMedication === null) {
		receiverMedication = 0;
	}

	if (receiverAmmunition === undefined || receiverAmmunition === null) {
		receiverAmmunition = 0;
	}

	// calculate sender total of points
	var receiverItemPoints = receiverWater      * 4 +
						     receiverFood       * 3 +
						     receiverMedication * 2 +
						     receiverAmmunition * 1;
	
	if (senderItemPoints != receiverItemPoints) {
		res.json("Can't trade because the items points sum do not match!");
	} else {
		// here begins the items trade part

		Survivor.findOne( // change later to findOneAndUpdate
			{ name: senderName }, // e.g. Andressa
			//{ $inc: { "inventory.medication": -senderMedication } },
			//{ $inc: { "inventory.ammunition": -senderAmmunition } },
			//{ $inc: { "inventory.water": receiverWater } },
			
			function(err, result) {
				if (err) res.send(err);
				Survivor.findOne(  // change later to findOneAndUpdate
					{ name: receiverName }, // e.g. Lyanna 
					//{ $inc: { "inventory.water": -receiverWater } },
					//{ $inc: { "inventory.medication": senderMedication } },
					//{ $inc: { "inventory.ammunition": senderAmmunition } },
					
					function(err, result) {
						if (err) res.send(err);

						res.json(result);
					}
			    )
			}
		)
	}
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


	
