const express = require('express');
const router = express.Router();

//Importing Controller
const categoryController = require('../controller/c-category');
const brandController = require('../controller/c-brand');

//Category
router.post('/add-category', categoryController.postCategory);
router.post('/edit-category', categoryController.postEditCategory);
router.get('/get-category', categoryController.getCategory);

//Brand
router.post('/add-brand', brandController.postBrand);

//Type
router.post('/add-type', brandController.postType);

//Fabric
router.post('/add-fabric', brandController.postFabric);

//common
router.get('/auto-complete', brandController.autoComplete);

module.exports = router;