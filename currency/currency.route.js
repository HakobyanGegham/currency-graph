const CurrencyController = require('./currency.controller');
const CurrencyService = require('./currency.service');
const express = require('express');
const router = express.Router();

router.get('/statistics', CurrencyController.getStatistics.bind(CurrencyController));
router.get('/', CurrencyService.getCurrencies.bind(CurrencyService));

module.exports = router;
