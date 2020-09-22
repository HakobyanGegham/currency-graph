const CurrencyService = require('./currency.service');

const updateValues = () => {
  setInterval(() => {
    return CurrencyService.updateCurrencies();
  }, 10000);
};

module.exports = updateValues;
