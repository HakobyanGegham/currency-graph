const CurrencyController = require('./currency.controller');
const express = require('express');
const router = express.Router();

router.get('/statistics', CurrencyController.getStatistics.bind(CurrencyController));

module.exports = router;
