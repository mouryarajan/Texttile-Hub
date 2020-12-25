const express = require('express');
const router = express.Router();

//Importing Controller
const userController = require('../controller/c-user');

//Routes
router.post('/login', userController.postLoginCheck);
router.post('/register', userController.postRegister);
router.post('/password', userController.postPassword);

router.post('add-cart', userController.postCart);
router.post('remove-cart', userController.postRemoveProductFromCart);

module.exports = router;