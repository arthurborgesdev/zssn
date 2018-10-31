var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test'); // changed URI to test
var Random = mongoose.model('Random', new mongoose.Schema({a:Number }));
var assert = require('assert');

describe("performs checks against the DB", function() {

	it("adds a Random entity to DB", function() {
		Random.create({a: 1}, function(doc) {
			assert(doc.a, 1);
			done();
		});
	});


})