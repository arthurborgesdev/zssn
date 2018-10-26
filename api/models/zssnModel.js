var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SurvivorSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	age: {
		type: Number,
		required: true
	},
	gender: {
		type: String,
		required: true
	},
	lastLocation: {
		longitude: {
			type: Number,
			required: true
		},
		latitude: { 
			type: Number,
			required: true
		}
	},
	inventory: {
		type: Array,
		//enum: ['Water', 'Food', 'Medication', 'Ammunition']
	},
	inventoryLocked: Boolean,
	infectionFlagPoints: Number
});

module.exports = mongoose.model('Survivor', SurvivorSchema);