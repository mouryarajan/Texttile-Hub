const express = require('express');
const router = express.Router();

//Importing Controller
const userController = require('../controller/c-user');

//Routes
router.post('/login', userController.postLoginCheck);
router.post('/register', userController.postRegister);
router.post('/password', userController.postPassword);
router.post('/edit-user', userController.postEditUser);

router.post('/add-address', userController.postAddress);
router.post('/remove-address', userController.postRemoveAddress);
router.get('/get-address', userController.postGetAddress);

router.post('/add-cart', userController.postCart);
router.post('/remove-cart', userController.postRemoveProductFromCart);
router.get('/clear-cart', userController.postClearCart);
router.get('/get-cart', userController.postGetCart);

router.post('/add-wishlist', userController.postAddWishlist);
router.post('/remove-wishlist', userController.postRemoveProductWishList);
router.get('/clear-wishlist', userController.postClearWishList);
router.get('/get-wishlist', userController.postGetWishList);

router.post('/add-recent-item', userController.postRecentItems);
router.get('/get-recent-item', userController.postGetRecentList);

router.post('/cart-quantity', userController.postIncreaseQuantity);
router.post('/add-notification-token', userController.addNotificationToken);
module.exports = router;