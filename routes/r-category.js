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
router.get('/get-brand', brandController.getBrand);

//Type
router.post('/add-type', brandController.postType);
router.get('/get-type', brandController.getType);

//Fabric
router.post('/add-fabric', brandController.postFabric);
router.get('/get-fabric', brandController.getFabric);

//common
router.get('/auto-complete', brandController.autoComplete);

module.exports = router;