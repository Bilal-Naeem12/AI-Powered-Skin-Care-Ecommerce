const OrderService = require("./orderService");

// **🔹 Create a New Order**
exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;  // Get the user from the authenticated session
        const orderData = req.body;

        const newOrder = await OrderService.createOrder(userId, orderData);
        res.status(201).json({ message: "Order created successfully", order: newOrder });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// **🔹 Update Order Status (Shipped, Delivered, etc.)**
exports.updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        const updatedOrder = await OrderService.updateOrderStatus(orderId, status);
        res.status(200).json({ message: "Order status updated", order: updatedOrder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Cancel Order**
exports.cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { reason } = req.body;

        const cancelledOrder = await OrderService.cancelOrder(orderId, reason);
        res.status(200).json({ message: "Order cancelled successfully", order: cancelledOrder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Process Refund**
exports.processRefund = async (req, res) => {
    try {
        const orderId = req.params.id;

        const refundedOrder = await OrderService.processRefund(orderId);
        res.status(200).json({ message: "Refund processed successfully", order: refundedOrder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Get Single Order by ID**
exports.getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await OrderService.getOrderById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Get All Orders (Admin)**
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await OrderService.getAllOrders();
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
