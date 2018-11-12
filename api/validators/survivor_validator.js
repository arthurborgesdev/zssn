var mongoose = require('mongoose');
var Survivor = mongoose.model('Survivor');
var Joi = require('joi');

exports.addSurvivorValidator = function(req, res, next) {

	const addSurvivorSchema = Joi.object().keys({
		name: Joi.string().regex(/^[A-Z][a-z]+$/).required(),
		age: Joi.number().integer().required(),
		gender: Joi.string().regex(/^[A-Z][a-z]+$/).required(),
		"lastLocation.latitude": Joi.number().required(),
		"lastLocation.longitude": Joi.number().required(),
		"inventory.water": Joi.number().integer().required(),
		"inventory.food": Joi.number().integer().required(),
		"inventory.medication": Joi.number().integer().required(),
		"inventory.ammunition": Joi.number().integer().required()
	});

	Joi.validate({
		name: req.addSurvivorObj.name,
		age: req.addSurvivorObj.age,
		gender: req.addSurvivorObj.gender,
		"lastLocation.latitude": req.addSurvivorObj["lastLocation.latitude"],
		"lastLocation.longitude": req.addSurvivorObj["lastLocation.longitude"],
		"inventory.water": req.addSurvivorObj["inventory.water"],
		"inventory.food": req.addSurvivorObj["inventory.food"],
		"inventory.medication": req.addSurvivorObj["inventory.medication"],
		"inventory.ammunition": req.addSurvivorObj["inventory.ammunition"]
		}, addSurvivorSchema, 
		function(err, value) {
			if (err) {
				req.errorMessage = err;
				req.addSurvivorObj = null;
			}	
		}
	)
	next(req, res);
}

exports.updateSurvivorLocationValidator = function(req, res, next) {

	const survivorNotInfection = Joi.boolean().not(true);

	Survivor.findOne(
		{ name: req.updateSurvivorLoc.nameId }, 
		function(err, survivor) {
			if (err) res.send(err);
			Joi.validate(
				survivor.inventoryLocked, 
				survivorNotInfection, 
				function (err, value) {
					if (err)  {
						req.updateSurvivorLoc = null;
					}
			});
			next(req, res);
	});
}

exports.flagSurvivorValidator = function(req, res, next) {


	const flagSurvivorSchema = Joi.object().keys({
		name: Joi.string().regex(/^[A-Z][a-z]+$/).required(),
		survivorNotInfection: Joi.boolean().not(true)
	});


	Survivor.findOne(
		{ name: req.survivorName }, 
		function(err, survivor) {
			if (err) res.send(err);
			Joi.validate({
				name: req.survivorName,
				survivorNotInfection: survivor.inventoryLocked 
				}, flagSurvivorSchema, 
				function (err, value) {
					if (err)  {
						req.errorMessage = err;
					}	
				}
			);
			next(req, res);
		}
	)
}