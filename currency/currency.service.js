const makeGetRequest = require('../request.js');
const Currency = require('./currency.schema');
const parser = require('fast-xml-parser');
const getTimestampFormattedDate = require('../util/date.util');
const Iconv = require('iconv').Iconv;

class CurrencyService {
  intervalsCount = 5;

  constructor(currencyModel) {
    this.model = currencyModel;
  }

  async getStatistics() {
    const currencies = await this.model.find();
    const dataset = this.getDataset(currencies);
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
    const date = new Date();
    const CreatedAt = getTimestampFormattedDate(date);
    const UpdatedAt = CreatedAt;
    const Values = {
      Value: parseFloat(Value.replace(',', '.')), CreatedAt, UpdatedAt
    };
    const currency = new Currency({
      Name, NumCode, CharCode, Value, CreatedAt, UpdatedAt, Values
    });

    currency.setGraphColor();
    currency.save();
  }

  async update(existingCurrency, newItem) {
    const lastValue = existingCurrency.Values[existingCurrency.Values.length - 1];
    if (parseFloat(newItem.Value.replace(',', '.')).toFixed(2) !== lastValue.Value.toFixed(2)) {
      const date = new Date();
      const CreatedAt = getTimestampFormattedDate(date);
      const UpdatedAt = CreatedAt;
      const Values = {
        Value: parseFloat(newItem.Value.replace(',', '.')), CreatedAt, UpdatedAt
      };
      existingCurrency.Values.push(Values);
      existingCurrency.UpdatedAt = UpdatedAt;
      existingCurrency.save();
    }
  }

  getDataset(currencies) {
    const dataset = {};
    currencies.forEach(currency => {
      dataset[currency._id] = {
        'label': currency.Name,
        'char_code': currency.CharCode,
        'backgroundColor': currency.GraphColor,
        'borderColor': currency.GraphColor,
        'fill': false,
        'data': []
      };
    });

    return dataset;
  }
}

const currencyService = new CurrencyService(Currency);
module.exports = currencyService;
