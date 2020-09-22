const CurrencyService = require('./currency.service');

class CurrencyController {
  constructor(currencyService) {
    this.currencyService = currencyService;
  }
  async getStatistics(req, res) {
    const statistic = await this.currencyService.getStatistics();
    await res.json(statistic);
  }
}

const currencyController = new CurrencyController(CurrencyService);
module.exports = currencyController;
