const express = require('express');
const connect = require('./connect.js');
const updateCurrencies = require('./currency/currency.update-currencies');
const currencyRoutes = require('./currency/currency.route');

const app = express();
connect();
updateCurrencies();
app.use(currencyRoutes);
app.listen(process.env.PORT, () => {
  console.log('')
});
