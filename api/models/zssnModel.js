// Mongoose requiring and schema definition
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema declaration
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
		water: {
			type: Number,
			required: true
		},
		food: {
			type: Number,
			required: true
		},
		medication: {
			type: Number,
			required: true
		},
		ammunition: {
			type: Number,
			required: true
		}
	},
	inventoryLocked: {
		type: Boolean,
		default: false
	},
	infectionFlagPoints: {
		type: Number,
		default: 0
	}
});

// Schema compiling and exportation
module.exports = mongoose.model('Survivor', SurvivorSchema);