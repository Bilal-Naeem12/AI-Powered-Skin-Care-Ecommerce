const express = require("express");
const {
    createShipping,
    getShippingInfo,
    updateShippingStatus,
    confirmDelivery,
    markAsDelayed
} = require("./shippingController");

const router = express.Router();

// **🔹 Route to Create Shipping Record**
router.post("/create", createShipping);

// **🔹 Route to Get Shipping Info by Order ID**
router.get("/:orderId", getShippingInfo);

// **🔹 Route to Update Shipping Status**
router.put("/status", updateShippingStatus);

// **🔹 Route to Confirm Delivery**
router.put("/confirm-delivery", confirmDelivery);

// **🔹 Route to Mark as Delayed**
router.put("/delay", markAsDelayed);

module.exports = router;
