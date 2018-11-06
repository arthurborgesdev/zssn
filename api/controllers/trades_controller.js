var mongoose = require('mongoose');
var Survivor = mongoose.model('Survivor');

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
		"inventory.water": senderWater,
		"inventory.food": senderFood,
		"inventory.medication": senderMedication,
		"inventory.ammunition": senderAmmunition
	}

	// Remove undefined fields from senderItems object
	var sentItems = {};
	for (var key in senderItems) {
		if (senderItems[key] != undefined) {
			sentItems[key] = senderItems[key];
		}		
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
		"inventory.water": receiverWater,
		"inventory.food": receiverFood,
		"inventory.medication": receiverMedication,
		"inventory.ammunition": receiverAmmunition
	}

	// Remove undefined fields from receiverItems object
	var receivedItems = {};
	for (var key in receiverItems) {
		if (receiverItems[key] != undefined) {
			receivedItems[key] = receiverItems[key];
		}		
	}

	// Validate fields (convert null and undefined to 0 )
	if (receiverWater === undefined || receiverWater === null) {
		receiverWater = 0;
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

		// implement in the future a check to see if the item request/sent exists in each survivor inventory
	
		// Trying to do database save of sent itens from survivor A to B (Itens are withdrawn of A's inventory)
		for (var key in sentItems) { // A's inventory
			//newKey = "inventory." + key;
			console.log(key);
			Survivor.findOneAndUpdate( 
				{ name: senderName }, // A
				{ $inc: { [key]: -sentItems[key]} }, // This part is failing without errors
				{ new: true },
				function(err, result) {
					if (err) res.send(err);
				}
			)
		}

		// Trying to do database save of received itens from survivor B to A (Itens are put in A's inventory)
		for (var key in receivedItems) { // B's inventory 
			//newKey = "inventory." + key;
			Survivor.findOneAndUpdate( 
				{ name: senderName }, // A
				{ $inc: { [key]: receivedItems[key]} }, // This part is failing without errors
				{ new: true },
				function(err, result) {
					if (err) res.send(err);
				}
			)
		}

		// Trying to do database save of sent itens from survivor B to A (Itens are withdrawn of B's inventory)
		for (var key in receivedItems) { // B's inventory
			//newKey = "inventory." + key;
			Survivor.findOneAndUpdate( 
				{ name: receiverName }, // B
				{ $inc: { [key]: -receivedItems[key]} }, // This part is failing without errors
				{ new: true },
				function(err, result) {
					if (err) res.send(err);
				}
			)
		}

		// Trying to do database save of received itens from survivor A to B (Itens are put in B's inventory)
		for (var key in sentItems) { // A's inventory
			//newKey = "inventory." + key;
			Survivor.findOneAndUpdate( 
				{ name: receiverName }, // B
				{ $inc: { [key]: sentItems[key]} }, // This part is failing without errors
				{ new: true },
				function(err, result) {
					if (err) res.send(err);
				}
			)
		}


		res.json("Success of Traded items"); // The items do not trade yet, although the logic seems clear
	}
		//console.log(sentItems);
		//res.json(sentItems);
};