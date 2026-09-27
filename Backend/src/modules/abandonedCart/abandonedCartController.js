const { sendError } = require("../../middleware/errorHandler");
const AbandonedCartService = require("./abandonedCartService");

// **🔹 Create a New Abandoned Cart**
exports.createAbandonedCart = async (req, res) => {
    try {
        const { userId, cartItems, totalAmount } = req.body;
        const newCart = await AbandonedCartService.createAbandonedCart(userId, cartItems, totalAmount);
        res.status(201).json({ message: "Abandoned cart created", cart: newCart });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// **🔹 Get Abandoned Cart by User ID**
exports.getAbandonedCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await AbandonedCartService.getAbandonedCartByUser(userId);
        if (!cart) return res.status(404).json({ message: "No abandoned cart found" });

        res.status(200).json(cart);
    } catch (error) {
        sendError(res, error);
    }
};

// **🔹 Send Recovery Email for Abandoned Cart**
exports.sendRecoveryEmail = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await AbandonedCartService.getAbandonedCartByUser(userId);

        if (!cart) return res.status(404).json({ message: "No abandoned cart found" });

        const result = await AbandonedCartService.sendRecoveryEmailForCart(cart.userId, cart.items);
        if (result) {
            await AbandonedCartService.updateCartRecoveryStatus(cart._id, 'email');
            res.status(200).json({ message: "Recovery email sent successfully" });
        } else {
            res.status(500).json({ message: "Failed to send recovery email" });
        }
    } catch (error) {
        sendError(res, error);
    }
};
