const makeGetRequest = require('../request.js');
const Currency = require('./currency.schema');
const parser = require('fast-xml-parser');
const {getSubstrDate, isBetween} = require('../util/date.util');
const Dataset = require('./currency.dataset.struct');

class CurrencyService {
  intervalsCount = 5;
  intervalsDuration = 10;

  constructor(currencyModel) {
    this.model = currencyModel;
  }

  async getStatistics(intervalsDuration = this.intervalsDuration, intervalsCount = this.intervalsCount) {
    const currencies = await this.model.find();
    return this.getIntervals(currencies, intervalsDuration, intervalsCount);
  }

  async updateCurrencies() {
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

    currencies.forEach(newCurrency => {
      const existingCurrency = existingCurrencies.find(item => {
        return item.NumCode === newCurrency.NumCode;
      });

      if (!existingCurrency) {
        return this.create(newCurrency);
      }
      return this.update(existingCurrency, newCurrency);
    });
  }

  async create(newCurrency) {
    const {Name, NumCode, CharCode, Value} = newCurrency;
    const CreatedAt = new Date();
    const UpdatedAt = CreatedAt;
    const Values = {Value: parseFloat(Value.replace(',', '.')), CreatedAt};
    const currency = new Currency({
      Name, NumCode, CharCode, Value, CreatedAt, UpdatedAt, Values
    });

    currency.setGraphColor();
    currency.save();
  }

  async update(existingCurrency, newItem) {
    const lastValue = existingCurrency.Values[existingCurrency.Values.length - 1];
    existingCurrency.setGraphColor();
    if (parseFloat(newItem.Value.replace(',', '.')).toFixed(5) === lastValue.Value.toFixed(5)) {
      return;
    }
    const CreatedAt = new Date();
    const UpdatedAt = CreatedAt;
    const Values = {
      Value: parseFloat(newItem.Value.replace(',', '.')), CreatedAt
    };
    existingCurrency.Values.push(Values);
    existingCurrency.UpdatedAt = UpdatedAt;
    existingCurrency.save();
  }

  getIntervals(currencies, intervalsDuration, intervalsCount, key = 'minutes') {
    const dataSetArray = [];
    currencies.forEach(currency => {
      const dataset = this.getDataset(currency);
      const date = new Date();
      for (let i = 0; i < intervalsCount; i++) {
        const startDate = getSubstrDate(date, intervalsDuration * i, key);
        const endDate = getSubstrDate(date, intervalsDuration * i + 1, key);
        dataset.setSingleInterval(currency, startDate, endDate);
      }
      dataSetArray.push(dataset);
    });

    return dataSetArray;
  }

  getDataset(currency) {
    return new Dataset(currency.Name, currency.CharCode, currency.GraphColor);
  }
}

const currencyService = new CurrencyService(Currency);
module.exports = currencyService;
