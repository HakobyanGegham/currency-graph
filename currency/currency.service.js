const makeGetRequest = require('../request.js');
const Currency = require('./currency.schema');
const parser = require('fast-xml-parser');
const getTimestampFormattedDate = require('../util/date.util');
const Iconv = require('iconv').Iconv;

class CurrencyService {
  constructor(currencyModel) {
    this.model = currencyModel;
  }

  async getStatistics() {

  }

  async getCurrencies() {
    const result = await makeGetRequest(process.env.CURRENCY_API_URL, {}, {
      headers: {'Content-Type': 'text/html; charset=windows-1251'}
    });

    const currencies = this.parseXml(result);
    this.createUpdateCurrency(currencies);
    return {};
  }

  parseXml(xml) {
    if (parser.validate(xml) === false) {
      throw new Error('Invalid xml.');
    }
    const currenciesXml = parser.parse(xml);
    return currenciesXml.ValCurs.Valute;
  }

  async createUpdateCurrency(currencies) {
    const currencyNumCodes = currencies.map(currency => currency.NumCode);
    const existingCurrencies = await this.model.find({NumCode: {$in: currencyNumCodes}});
    for (const i in currencies) {
      if (!currencies.hasOwnProperty(i)) {
        continue;
      }

      const currency = existingCurrencies.find(item => {
        return item.NumCode === currencies[i].NumCode;
      });

      if (!currency) {
        return this.create(currencies[i]);
      }
      return this.update(currency, currencies[i]);
    }
  }

  async create(newCurrency) {
    const {Name, NumCode, CharCode, Value} = newCurrency;
    const date = new Date();
    const CreatedAt = getTimestampFormattedDate(date);
    const UpdatedAt = CreatedAt;
    const Values = {
      Value, CreatedAt, UpdatedAt
    };
    const currency = new Currency({
      Name, NumCode, CharCode, Value, CreatedAt, UpdatedAt, Values
    });

    currency.save();
  }

  async update(existingCurrency, newItem) {

  }
}

const currencyService = new CurrencyService(Currency);
module.exports = currencyService;
