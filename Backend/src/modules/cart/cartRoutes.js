const express = require('express');
const router = express.Router();
const { addItem, removeItem, getCart, checkout } = require('./cartController');
const { validateAddItem, validateRemoveItem, validateCheckout } = require('./cartValidator');

// **Add item to cart**
router.post('/add', validateAddItem, addItem);

// **Remove item from cart**
router.delete('/remove/:userId/:productId', validateRemoveItem, removeItem);

// **Get cart**
router.get('/:userId', getCart);

// **Checkout cart**
router.post('/checkout/:userId', validateCheckout, checkout);

module.exports = router;
