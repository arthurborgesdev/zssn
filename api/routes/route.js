module.exports = function(app) {
	var survivorController = require('../controllers/survivors_controller');
	var tradeController = require('../controllers/trades_controller');

	app.route('/survivor')
		.post(survivorController.addSurvivorController);
	
	app.route('/survivor/location')
		.put(survivorController.updateSurvivorLocationController);

	app.route('/flag/infection')
		.put(survivorController.flagSurvivorAsInfectedController);

	app.route('/trade/items')
		.put(tradeController.tradeItemsController);

	app.route('/survivors/infected')
		.get(survivorController.readPercentageOfNonSurvivorsController);

	app.route('/survivors/noninfected')
		.get(survivorController.readPercentageOfSurvivorsController);

	app.route('/average/resources')
		.get(survivorController.readAverageOfResourcesController);

	app.route('/points/lost')
		.get(survivorController.readPointsLostController);
	
};