const CurrencyController = require('./currency.controller');
const express = require('express');
const router = express.Router();

router.get('/statistics', CurrencyController.validate(), CurrencyController.getStatistics.bind(CurrencyController));
router.get('/', CurrencyController.getIndex);

module.exports = router;
