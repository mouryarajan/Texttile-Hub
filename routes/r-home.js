const express = require('express');
const router = express.Router();

//Importing Controller
const homeController = require('../controller/c-home');

router.post('/add-advertisement', homeController.postAdvertisement);
router.post('/get-home-products', homeController.getHomeProducts);
router.post('/shop-by-category', homeController.postShopeByCategory);
router.post('/shop-by-brand', homeController.postShopeByBrand);
router.post('/shop-by-fabric', homeController.postShopeByFabric);
router.post('/shop-by-type', homeController.postShopeByType);
router.post('/shop-by-store', homeController.getStoreProduct);
router.get('/trending-product', homeController.getTrendingProduct);
router.post('/payment', homeController.payment);

router.post('/search-product', homeController.postSearchProduct);
router.post('/filter-product', homeController.postFilter);

module.exports = router;