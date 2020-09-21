const express = require('express');
const connect = require('./connect.js');
const currencyRoutes = require('./currency/currency.route');

const app = express();
connect();
app.use(currencyRoutes);
app.listen(process.env.PORT, () => {
  console.log('')
});
