var tradeService = require("../services/trade_service");

exports.tradeItemsController = function(req, res) {
	tradeService.tradeItems(req, res);
}