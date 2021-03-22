const express = require('express');
const router = express.Router();

//Importing Controller
const productseController = require('../controller/c-products');

//Routes
router.post('/add-products', productseController.postProducts);
router.post('/edit-products', productseController.postEditProducts);
router.get('/product-list', productseController.getProducts);
router.post('/product-list-user-by-shop', productseController.postProductList);
router.get('/size', productseController.getSize);
router.post('/remove-product', productseController.removeProduct);

router.post('/post-review', productseController.postReview);
router.post('/get-review', productseController.postGetReview);

router.post('/get-product-detail', productseController.getProductDetails);

module.exports = router;