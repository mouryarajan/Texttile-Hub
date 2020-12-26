const express = require('express');
const router = express.Router();

//Importing Controller
const productseController = require('../controller/c-products');

//Routes
router.post('/add-products', productseController.postProducts);
router.post('/product-list', productseController.getProducts);
router.get('/size', productseController.getSize);

module.exports = router;