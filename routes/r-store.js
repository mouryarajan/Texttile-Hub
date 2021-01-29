const express = require('express');
const router = express.Router();

//Importing Controller
const storeController = require('../controller/c-store');

//Routes
router.post('/add-store', storeController.postStore);
router.get('/store-list', storeController.getStore);
router.post('/approve-store', storeController.approveStore);
router.get('/store-list-home', storeController.getStoreHome);

module.exports = router;