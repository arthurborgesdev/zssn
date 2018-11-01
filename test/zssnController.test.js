var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test'); // changed URI to test
var Random = mongoose.model('Random', new mongoose.Schema({a:Number }));
var assert = require('assert');

describe("performs checks against the DB", function() {

	it("adds a Random collection to DB", function() { // it appears to work only on the first time run
		Random.create({a: 1}, function(doc) {
			assert(doc.a, 1);
			done();
		});
	});


	// it is desirable to have here some tests of the routes
	// ...


	it("removes a Random collection from DB", function() {
		Random.deleteOne({a: 1}, function(doc) {
			assert(doc, null);
			done();
		});
	});


})