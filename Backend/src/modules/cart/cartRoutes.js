const express = require('express');
const router = express.Router();
const { authMiddleware } = require("../../middleware/authMiddleware");
const { validateResult } = require("../users/userValidator");
router.use(authMiddleware);
const ownCart = (req, res, next) => {
  const userId = req.params.userId || req.body?.userId;
  if (String(req.user._id) !== userId) return res.status(403).json({ message: "Access denied." });
  next();
};
const { addItem, removeItem, getCart, checkout } = require('./cartController');
const { validateAddItem, validateRemoveItem, validateCheckout } = require('./cartValidator');

// **Add item to cart**
router.post('/add', validateAddItem, validateResult, ownCart, addItem);

// **Remove item from cart**
router.delete('/remove/:userId/:productId', validateRemoveItem, validateResult, ownCart, removeItem);

// **Get cart**
router.get('/:userId', ownCart, getCart);

// **Checkout cart**
router.post('/checkout/:userId', validateCheckout, validateResult, ownCart, checkout);

module.exports = router;
