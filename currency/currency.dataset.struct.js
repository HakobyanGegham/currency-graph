const {isBetween} = require('../util/date.util');

class Dataset {
  label;
  charCode;
  backGroundColor;
  borderColor;
  data = [];
  fill;

  constructor(label, charCode, backGroundColor, borderColor = backGroundColor, data = [], fill = false) {
    this.label = label;
    this.charCode = charCode;
    this.backGroundColor = backGroundColor;
    this.borderColor = borderColor;
    this.data = data;
    this.fill = fill;
  }

  setSingleInterval(currency, startDate, endDate) {
    const item = currency.Values.find(value => {
      return isBetween(value.CreatedAt, startDate, endDate);
    });

    if (item) {
      return this.data.unshift(item.Value);
    }

    if (!this.data.length) {
      return this.data.unshift(currency.Values[currency.Values.length - 1].Value);
    }

    return this.data.unshift(this.data[0]);
  }
}

module.exports = Dataset;
