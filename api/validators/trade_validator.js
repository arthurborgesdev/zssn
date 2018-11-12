var mongoose = require('mongoose');
var Survivor = mongoose.model('Survivor');
var Joi = require('joi');

exports.validateItemsOrInfection = function(req, res, next) {

	// forced conversion to Number because of variable errors
	var senderWater = Number(req.senderVars.senderWater);
	var senderFood = Number(req.senderVars.senderFood);
	var senderMedication = Number(req.senderVars.senderMedication);
	var senderAmmunition = Number(req.senderVars.senderAmmunition);
	console.log(senderMedication);

	const tradeSenderSchema = Joi.object().keys({
		"inventory.water": Joi.number().integer().min(senderWater),
		"inventory.food": Joi.number().integer().min(senderFood),
		"inventory.medication": Joi.number().integer().min(senderMedication),
		"inventory.ammunition": Joi.number().integer().min(senderAmmunition),
		inventoryLocked: Joi.boolean().not(true)
	});

	// forced conversion to Number because of variable errors
	var receiverWater = Number(req.receiverVars.receiverWater);
	var receiverFood = Number(req.receiverVars.receiverFood);
	var receiverMedication = Number(req.receiverVars.receiverMedication);
	var receiverAmmunition = Number(req.receiverVars.receiverAmmunition);
	console.log(receiverMedication);

	const tradeReceiverSchema = Joi.object().keys({
		"inventory.water": Joi.number().integer().min(receiverWater),
		"inventory.food": Joi.number().integer().min(receiverFood),
		"inventory.medication": Joi.number().integer().min(receiverMedication),
		"inventory.ammunition": Joi.number().integer().min(receiverAmmunition),
		inventoryLocked: Joi.boolean().not(true)
	});

	Survivor.findOne(
		{ name: req.senderVars.senderName },
		function(err, survivor) {
			if (err) res.send(err);
		
			Joi.validate({
				"inventory.water": survivor.inventory.water,
				"inventory.food": survivor.inventory.food,
				"inventory.medication": survivor.inventory.medication,
				"inventory.ammunition": survivor.inventory.ammunition,
				inventoryLocked: survivor.inventoryLocked
				}, tradeSenderSchema, 
				function(err, value) {
					if (err) {
						req.errorMessage = err;
					}
					
					Survivor.findOne(
						{ name: req.receiverVars.receiverName },
						function(err, survivor) {
							if (err) res.send(err);
		
							Joi.validate({
								"inventory.water": survivor.inventory.water,
								"inventory.food": survivor.inventory.food,
								"inventory.medication": survivor.inventory.medication,
								"inventory.ammunition": survivor.inventory.ammunition,
								inventoryLocked: survivor.inventoryLocked
								}, tradeReceiverSchema, 
								function(err, value) {
									if (err) {
										req.errorMessage = err;
									}
									next(req, res);	
								}
							)
						}
					)	
				}
			)
		}
	)


	
}

exports.validateSenderVars = function(req, res) {

	if (req.senderVars.senderWater === undefined || req.senderVars.senderWater === null) {
		req.senderVars.senderWater = 0;
	}

	if (req.senderVars.senderFood === undefined || req.senderVars.senderFood === null) {
		req.senderVars.senderFood = 0;
	}

	if (req.senderVars.senderMedication === undefined || req.senderVars.senderMedication === null) {
		req.senderVars.senderMedication = 0;
	}

	if (req.senderVars.senderAmmunition === undefined || req.senderVars.senderAmmunition === null) {
		req.senderVars.senderAmmunition = 0;
	}
}

exports.sumSenderItemPoints = function(req, res) {

	var senderItemPoints = req.senderVars.senderWater      * 4 +
						   req.senderVars.senderFood       * 3 +
						   req.senderVars.senderMedication * 2 +
						   req.senderVars.senderAmmunition * 1;

	req.senderItemPoints = senderItemPoints;
}

exports.validateReceiverVars = function(req, res) {

	if (req.receiverVars.receiverWater === undefined || req.receiverVars.receiverWater === null) {
		req.receiverVars.receiverWater = 0;
	}

	if (req.receiverVars.receiverFood === undefined || req.receiverVars.receiverFood === null) {
		req.receiverVars.receiverFood = 0;
	}

	if (req.receiverVars.receiverMedication === undefined || req.receiverVars.receiverMedication === null) {
		req.receiverVars.receiverMedication = 0;
	}

	if (req.receiverVars.receiverAmmunition === undefined || req.receiverVars.receiverAmmunition === null) {
		req.receiverVars.receiverAmmunition = 0;
	}
}

exports.sumReceiverItemPoints = function(req, res) {

	var receiverItemPoints = req.receiverVars.receiverWater      * 4 +
						     req.receiverVars.receiverFood       * 3 +
						     req.receiverVars.receiverMedication * 2 +
						     req.receiverVars.receiverAmmunition * 1;

	req.receiverItemPoints = receiverItemPoints;
}