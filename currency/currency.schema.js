const mongoose = require('mongoose');

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

CurrencySchema.methods.setGraphColor = () => {
  const red = Math.floor(Math.random() * Math.floor(255));
  const blue = Math.floor(Math.random() * Math.floor(255));
  const green = Math.floor(Math.random() * Math.floor(255));
  this.graphColor = `rgb(${red}, ${green}, ${blue})`;
};

module.exports = mongoose.model('Currency', CurrencySchema);
