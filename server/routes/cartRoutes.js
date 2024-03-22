const express = require('express');
const CartController = require('../controllers/cartController');
const router = express.Router();

// lägger till produkt i varukorgen
router.post('/add', CartController.addToCart);

// hämtar användarens varukorg
router.get('/', CartController.getCart);

// uppdaterar produktens antal i varukorgen
router.put('/update', CartController.updateCartItem);

// tar bort produkt från varukorgen
router.post('/remove', CartController.removeFromCart);

// rensar hela varukorgen
router.delete('/clear', CartController.clearCart);

module.exports = router;
