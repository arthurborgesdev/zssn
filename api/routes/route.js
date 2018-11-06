module.exports = function(app) {
	var zssn = require('../controllers/survivors_controller');
	var zssnTrade = require('../controllers/trades_controller');

	app.route('/survivor')
		.post(zssn.addSurvivor);
	
	app.route('/survivor/location')
		.put(zssn.updateSurvivorLocation);

	app.route('/flag/infection')
		.put(zssn.flagSurvivorAsInfected);

	app.route('/trade/items')
		.put(zssnTrade.tradeItems);

	app.route('/survivors/infected')
		.get(zssn.readPercentageOfNonSurvivors);

	app.route('/survivors/noninfected')
		.get(zssn.readPercentageOfSurvivors);

	app.route('/average/resources')
		.get(zssn.readAverageOfResources);

	app.route('/points/lost')
		.get(zssn.readPointsLost);
};