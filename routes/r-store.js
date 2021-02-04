const express = require('express');
const router = express.Router();

//Importing Controller
const storeController = require('../controller/c-store');

//Routes
router.post('/add-store', storeController.postStore);
router.post('/edit-store', storeController.editStore);
router.post('/edit-store-minor-information', storeController.editMinorStore);
//router.post('/get-payment-mode', )
router.post('/approve-store', storeController.approveStore);
router.get('/store-list', storeController.getStore);
router.get('/store-list-home', storeController.getStoreHome);
router.get('/own-store-detail', storeController.getOwnStore);

module.exports = router;