process.env.NODE_ENV = 'test';
var chai = require('chai');
//var chaiHttp = require('chai-http');
//var mongoose = require('mongoose');
//var server = require('../../app');
var Survivor = require('../../api/models/survivor');
var should = chai.should();
//chai.use(chaiHttp);

var tradeValidator = require('../../api/validators/trade_validator');

describe('Unit tests to test validators and external functions', function() {

	it('should check if sum of points match', function(done) {

		res = {};
		req = {
			senderVars: {
				senderWater: 2,
				senderFood: 3,
				senderMedication: 1,
				senderAmmunition: 4
			}
		}

		tradeValidator.sumSenderItemPoints(req, res);
		req.senderItemPoints.should.be.a('number');
		req.senderItemPoints.should.be.equal(23);

		done();
	});

	it('should validate received vars', function(done) {

		res = {};
		req = {
			receiverVars: {
				receiverWater: undefined,
				receiverFood: null,
				receiverMedication: null,
				receiverAmmunition: 4
			}
		}

		tradeValidator.validateReceiverVars(req, res);
		req.receiverVars.receiverWater.should.be.a('number');		
		req.receiverVars.receiverFood.should.be.a('number');		
		req.receiverVars.receiverMedication.should.be.a('number');
		req.receiverVars.receiverAmmunition.should.be.a('number');

		done();
	});


});