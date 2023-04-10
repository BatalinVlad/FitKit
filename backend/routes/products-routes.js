const express = require('express');
const router = express.Router();
const productsControllers = require('../controllers/products-controllers');

router.get('/', productsControllers.getProducts);

router.get('/:pid', productsControllers.getProductById);

module.exports = router;
