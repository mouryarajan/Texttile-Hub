const express = require('express');
const router = express.Router();

//Importing Controller
const userController = require('../controller/c-user');

//Routes
router.post('/login', userController.postLoginCheck);
router.post('/register', userController.postRegister);
router.post('/password', userController.postPassword);


module.exports = router;