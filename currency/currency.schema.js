const mongoose = require('mongoose');
const getRandomNumbers = require('../util/math.util');

const CurrencySchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
    maxlength: 50
  },
  NumCode: {
    type: Number,
    required: true,
    maxlength: 15,
    unique: true,
  },
  CharCode: {
    type: String,
    required: true,
    maxlength: 15
  },
  Values: {
    type: Array,
  },
  CreatedAt: {type: Date},
  UpdatedAt: {type: Date},
  GraphColor: {type: String},
});

CurrencySchema.methods.setGraphColor = function() {
  const red = getRandomNumbers(255);
  const blue = getRandomNumbers(255);
  const green = getRandomNumbers(255);

  this.GraphColor = `rgb(${red}, ${green}, ${blue})`;
};

module.exports = mongoose.model('Currency', CurrencySchema);
