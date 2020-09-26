const express = require('express');
const connect = require('./connect.js');
const exphbs = require('express-handlebars');
const updateCurrencies = require('./currency/currency.update-currencies');
const currencyRoutes = require('./currency/currency.route');
const path = require('path');

const app = express();

app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));

app.use('/static', express.static(path.join(__dirname, 'public')));

app.set('view engine', 'hbs');
connect();
updateCurrencies();
app.use(currencyRoutes);
app.listen(process.env.PORT, () => {
  console.log('App listen to port ' + process.env.PORT)
});
