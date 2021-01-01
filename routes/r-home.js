const express = require('express');
const router = express.Router();

//Importing Controller
const homeController = require('../controller/c-home');

router.post('/add-advertisement', homeController.postAdvertisement);
router.post('/get-home-products', homeController.getHomeProducts);
router.post('/shop-by-category', homeController.postShopeByCategory);

module.exports = router;