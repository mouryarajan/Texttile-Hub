const express = require('express');
const router = express.Router();

//Importing Controller
const orderController = require('../controller/c-order');

router.post('/order', orderController.postOrder);
router.post('/get-order', orderController.getOrder);
router.post('/update-status-order', orderController.postUpdateOrderStatus);
router.post('/cancel-order', orderController.orderCancel);
router.post('/update-address', orderController.orderAddressUpdate);

module.exports = router;