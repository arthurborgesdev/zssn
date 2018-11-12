var tradeService = require("../services/trade_service");

exports.tradeItemsController = function(req, res) {
	
	// Receive sender items from PUT and add them to vars
	var senderVars = {
		senderName: req.body["sender.name"],
		senderWater: req.body["sender.water"],
		senderFood: req.body["sender.food"],
		senderMedication: req.body["sender.medication"],
		senderAmmunition: req.body["sender.ammunition"]
	}

	// Object created for later use in trade items part
	var senderItems = {
		"inventory.water": senderVars.senderWater,
		"inventory.food": senderVars.senderFood,
		"inventory.medication": senderVars.senderMedication,
		"inventory.ammunition": senderVars.senderAmmunition
	}

	// Remove undefined fields from senderItems object
	var sentItems = {};
	for (var key in senderItems) {
		if (senderItems[key] != undefined) {
			sentItems[key] = senderItems[key];
		}		
	}

	// Atribute handled sender parameters to req object
	req.senderVars = senderVars;
	req.senderItems = senderItems;
	req.sentItems = sentItems;

	// Receive receiver items from PUT and add them to vars
	var receiverVars = {
		receiverName: req.body["receiver.name"],
	    receiverWater: req.body["receiver.water"],
	    receiverFood: req.body["receiver.food"],
	    receiverMedication: req.body["receiver.medication"],
	    receiverAmmunition: req.body["receiver.ammunition"]
	}

	// Object created for later use in trade items part
	var receiverItems = {
		"inventory.water": receiverVars.receiverWater,
		"inventory.food": receiverVars.receiverFood,
		"inventory.medication": receiverVars.receiverMedication,
		"inventory.ammunition": receiverVars.receiverAmmunition
	}

	// Remove undefined fields from receiverItems object
	var receivedItems = {};
	for (var key in receiverItems) {
		if (receiverItems[key] != undefined) {
			receivedItems[key] = receiverItems[key];
		}		
	}

	// Atribute handled receiver parameters to req object
	req.receiverVars = receiverVars;
	req.receiverItems = receiverItems;
	req.receivedItems = receivedItems;

	tradeService.tradeItems(req, res);
}