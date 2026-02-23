const express = require('express');
const {getProductTypes} = require('../controllers/productTypeController');

const router = express.Router();

router.get('/', getProductTypes);

module.exports = router;