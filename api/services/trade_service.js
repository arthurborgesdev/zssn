var mongoose = require('mongoose');
var Survivor = mongoose.model('Survivor');
var tradeValidator = require('../validators/trade_validator');

//tradeItems
exports.tradeItems = function(req, res) {

	// Validate fields (convert null and undefined to 0 )
	tradeValidator.validateSenderVars(req, res);

	// calculate sender total of points
	tradeValidator.sumSenderItemPoints(req, res);

	// Validate fields (convert null and undefined to 0 )
	tradeValidator.validateReceiverVars(req, res);

	// calculate receiver total of points
	tradeValidator.sumReceiverItemPoints(req, res);

	if (req.senderItemPoints != req.receiverItemPoints) {
		//console.log(req.senderItemPoints)
		res.json("Can't trade because the items points sum do not match!");
	} else {
		// here begins the items trade part

		// implement in the future a check to see if the item request/sent exists in each survivor inventory
		tradeValidator.validateItemsOrInfection(req, res, function() {
			console.log("hahahahahahahahahahahahahahahahahahahahahahahahahahahahahahahahahahahahahahahahahahahaha");
			console.log(req.errorMessage);
			if (req.errorMessage) {
				//res.json({message: "The survivor is already a zombie!"})
				res.json({ErrorMessage: req.errorMessage})

			} else {

				// Database saving of sent itens from survivor A to B (Itens are withdrawn of A's inventory)
				for (var key in req.sentItems) { // A's inventory
					//newKey = "inventory." + key;
					//console.log(key);
					Survivor.findOneAndUpdate( 
						{ name: req.senderVars.senderName }, // A
						{ $inc: { [key]: -req.sentItems[key]} }, 
						{ new: true },
						function(err, result) {
							if (err) res.send(err);
						}
					)
				}

				// Database saving of received itens from survivor B to A (Itens are put in A's inventory)
				for (var key in req.receivedItems) { // B's inventory 
					//newKey = "inventory." + key;
					Survivor.findOneAndUpdate( 
						{ name: req.senderVars.senderName }, // A
						{ $inc: { [key]: req.receivedItems[key]} }, 
						{ new: true },
						function(err, result) {
							if (err) res.send(err);
						}
					)
				}

				// Database saving of sent itens from survivor B to A (Itens are withdrawn of B's inventory)
				for (var key in req.receivedItems) { // B's inventory
					//newKey = "inventory." + key;
					Survivor.findOneAndUpdate( 
						{ name: req.receiverVars.receiverName }, // B
						{ $inc: { [key]: -req.receivedItems[key]} }, 
						{ new: true },
						function(err, result) {
							if (err) res.send(err);
						}
					)
				}

				var finalResult = [];
				var sentItemsPropsLength = Object.keys(req.sentItems).length;
				// Database saving of received itens from survivor A to B (Itens are put in B's inventory)
				for (var key in req.sentItems) { // A's inventory
					//newKey = "inventory." + key;
					Survivor.findOneAndUpdate( 
						{ name: req.receiverVars.receiverName }, // B
						{ $inc: { [key]: req.sentItems[key]} }, 
						{ new: true },
						function(err, result) {
							if (err) res.send(err);
							finalResult.push(result);

							if (finalResult.length >= sentItemsPropsLength) {
							 	console.log(finalResult[finalResult.length-1]);
								res.json(finalResult[finalResult.length-1]);
							}
						}
					)	
				} 
			}
		})
	}
};