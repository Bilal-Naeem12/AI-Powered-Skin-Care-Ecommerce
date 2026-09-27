const { sendError } = require("../../middleware/errorHandler");
const { addItemToCart, removeItemFromCart, getCart, checkoutCart } = require('./cartService');

// **Add item to the cart**
exports.addItem = async (req, res) => {
    try {
        const { userId, productId, quantity, selectedVariant } = req.body;
        const cart = await addItemToCart(userId, productId, quantity, selectedVariant);
        res.status(200).json({ message: "Item added to cart", cart });
    } catch (error) {
        sendError(res, error);
    }
};

// **Remove item from the cart**
exports.removeItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const cart = await removeItemFromCart(userId, productId);
        res.status(200).json({ message: "Item removed from cart", cart });
    } catch (error) {
        sendError(res, error);
    }
};

// **Get the user's cart**
exports.getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await getCart(userId);
        res.status(200).json({ cart });
    } catch (error) {
        sendError(res, error);
    }
};

// **Checkout the cart**
exports.checkout = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await checkoutCart(userId);
        res.status(200).json({ message: "Cart checked out successfully", cart });
    } catch (error) {
        sendError(res, error);
    }
};
