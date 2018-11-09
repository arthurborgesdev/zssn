process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');

var server = require('../../app');
var Survivor = require('../../api/models/survivor');

var should = chai.should();
chai.use(chaiHttp);

describe('Actions performed in survivors service', function() {

	var fixedLatitude = -49.277381;
	var fixedLongitude = -16.682067;
	
	Survivor.collection.drop();

	beforeEach(function(done) {
		var newSurvivor = new Survivor({
			name: 'Fernando',
			age: 30,
			gender: 'Male',
			"lastLocation.latitude": fixedLatitude,
			"lastLocation.longitude": fixedLongitude,
			infectionFlagPoints: 2,
			"inventory.water": 50,
			"inventory.food": 50,
			"inventory.medication": 50,
			"inventory.ammunition": 50
		});
		newSurvivor.save(function(err) {
			done();
		})
	});

	
	afterEach(function(done) {
		Survivor.collection.drop();
		done();
	});
	

	it('should add a survivor on /survivor POST', function(done) {
		chai.request(server)
			.post('/survivor')
			.send({
				'name': 'Fernando',
				'age': 30,
				'gender': 'Male',
				'lastLocation.latitude': -49.277381,
				'lastLocation.longitude': -16.682067,
				'inventory.water': 50,
				'inventory.food': 50,
				'inventory.medication': 50,
				'inventory.ammunition': 50
			})
			.end(function(err, res) {
				//console.log(res.body);
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.have.property('inventoryLocked'); // here I can see that it passed all mongoose validation
				res.body.name.should.equal('Fernando');
				done();
			});
	});


	it('should update a survivor location on /survivor/location PUT', function(done) {
		chai.request(server)
			.put('/survivor/location')
			.send({
				'name': 'Fernando',
				'lastLocation.latitude': -49.577381,
				'lastLocation.longitude': -16.892067,
			})
			.end(function(err, res) {
				res.should.have.status(200);
				res.should.be.json;
				// if the lat and long aren't equal, it means they changed!
				res.body.lastLocation.latitude.should.not.equal(fixedLatitude);
				res.body.lastLocation.longitude.should.not.equal(fixedLongitude);
				done();
			})
	});

	it('should flag a survivor as infected on /flag/infection PUT', function(done) {
		chai.request(server)
			.put('/flag/infection')
			.send({
				'name': 'Fernando'
			})
			.end(function(err, res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.infectionFlagPoints.should.equal(3);
				res.body.inventoryLocked.should.equal(true);
				done();
			})
	});

	it('should trade items on /trade/items PUT', function(done) {

		var newSurvivor = new Survivor({
			name: 'Isadora',
			age: 35,
			gender: 'Female',
			"lastLocation.latitude": fixedLatitude,
			"lastLocation.longitude": fixedLongitude,
			"inventory.water": 30,
			"inventory.food": 30,
			"inventory.medication": 30,
			"inventory.ammunition": 30
		});
		newSurvivor.save(function(err) {

			chai.request(server)
				.put('/trade/items')
				.send({
					'sender.name': 'Fernando',
					'sender.medication': 3,
					'sender.ammunition': 2,
					'receiver.name': 'Isadora',
					'receiver.water': 2
				})
				.end(function(err, res) {
					res.should.have.status(200);
					console.log(res.body);
					res.body.inventory.water.should.equal(28);
					res.body.inventory.food.should.equal(30);
					res.body.inventory.medication.should.equal(33);
					res.body.inventory.ammunition.should.equal(32);
					done();
				})

		})
	});

	it('should read a percentage of infected survivors on /survivors/infected GET', function(done) {
		chai.request(server)
			.get('/survivors/infected')
			.end(function(err, res) {
				res.should.have.status(200);
				res.body.should.equal("0.00%"); // Fernando isn't infected
				done();
			})
	});

	it('should read a percentage of non infected survivors on /survivors/noninfected GET', function(done) {
		chai.request(server)
			.get('/survivors/noninfected')
			.end(function(err, res) {
				res.should.have.status(200);
				res.body.should.equal("100.00%"); // Fernando is a non infected
				done();
			})
	});

	it('should read number of average resources of survivors on /average/resources GET', function(done) {
		
		var newSurvivor = new Survivor({
			name: 'Camila',
			age: 27,
			gender: 'Female',
			"lastLocation.latitude": fixedLatitude,
			"lastLocation.longitude": fixedLongitude,
			"inventory.water": 30,
			"inventory.food": 30,
			"inventory.medication": 30,
			"inventory.ammunition": 30
		});

		newSurvivor.save(function(err) {

			chai.request(server)
				.get('/average/resources')
				.end(function(err, res) {
					res.should.have.status(200);
					res.body[0].water.should.equal(40);
					res.body[0].food.should.equal(40);
					res.body[0].medication.should.equal(40);
					res.body[0].ammunition.should.equal(40);
					done();
				})
		})
	});
	
	it('should read number of total points lost on /points/lost GET', function(done) {
		
		var newSurvivor = new Survivor({
			name: 'Gumercindo',
			age: 48,
			gender: 'Male',
			"lastLocation.latitude": fixedLatitude,
			"lastLocation.longitude": fixedLongitude,
			inventoryLocked: true, // to assert that this one is a zombie
			"inventory.water": 40,
			"inventory.food": 40,
			"inventory.medication": 40,
			"inventory.ammunition": 40
		});
		newSurvivor.save(function(err) {

			chai.request(server)
				.get('/points/lost')
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.equal(400);
					done();
				})
		})
	});
})