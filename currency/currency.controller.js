const CurrencyService = require('./currency.service');
const {body, validationResult} = require('express-validator');

class CurrencyController {
  constructor(currencyService) {
    this.currencyService = currencyService;
  }

  getIndex(req, res) {
    return res.render('currency');
  }

  async getStatistics(req, res) {
    const dataset = await this.currencyService.getStatistics(req.params.duration, req.params.count);
    await res.json({dataset});
  }

  validate() {
    return [
      body('duration', 'Duration should be numeric.').isNumeric(),
      body('count', 'Count should be numeric.').isNumeric(),
    ];
  }
}

const currencyController = new CurrencyController(CurrencyService);
module.exports = currencyController;
