const express = require('express');
const router = express.Router();

//Importing Controller
const categoryController = require('../controller/c-category');

router.post('/add-category', categoryController.postCategory);
router.post('/edit-category', categoryController.postEditCategory);
router.get('/get-category', categoryController.getCategory);

module.exports = router;