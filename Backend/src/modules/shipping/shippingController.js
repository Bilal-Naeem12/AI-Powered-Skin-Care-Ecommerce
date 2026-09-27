const { sendError } = require("../../middleware/errorHandler");
const ShippingService = require("./shippingService");

// **🔹 Create Shipping Record**
exports.createShipping = async (req, res) => {
    try {
        const shippingData = req.body;
        const newShipping = await ShippingService.createShippingRecord(shippingData);
        res.status(201).json({ message: "Shipping record created", shipping: newShipping });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// **🔹 Get Shipping Info by Order ID**
exports.getShippingInfo = async (req, res) => {
    try {
        const { orderId } = req.params;
        const shippingInfo = await ShippingService.getShippingInfoByOrder(orderId);
        if (!shippingInfo) return res.status(404).json({ message: "Shipping record not found" });

        res.status(200).json(shippingInfo);
    } catch (error) {
        sendError(res, error);
    }
};

// **🔹 Update Shipping Status**
exports.updateShippingStatus = async (req, res) => {
    try {
        const { shippingId, newStatus } = req.body;
        const updatedShipping = await ShippingService.updateShippingStatus(shippingId, newStatus);
        res.status(200).json({ message: "Shipping status updated", shipping: updatedShipping });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// **🔹 Confirm Delivery**
exports.confirmDelivery = async (req, res) => {
    try {
        const { shippingId } = req.body;
        const updatedShipping = await ShippingService.confirmDelivery(shippingId);
        res.status(200).json({ message: "Delivery confirmed", shipping: updatedShipping });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// **🔹 Mark as Delayed**
exports.markAsDelayed = async (req, res) => {
    try {
        const { shippingId, reason } = req.body;
        const updatedShipping = await ShippingService.markAsDelayed(shippingId, reason);
        res.status(200).json({ message: "Shipping marked as delayed", shipping: updatedShipping });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
