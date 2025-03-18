const express = require("express");
const { createOrder, updateOrderStatus, cancelOrder, processRefund, getOrderById, getAllOrders } = require("./orderController");
const { validateCreateOrder, validateUpdateOrderStatus, validateResult } = require("./orderValidator");

const router = express.Router();

// **🔹 Route for Creating a New Order**
router.post("/create", validateCreateOrder, validateResult, createOrder);  // Create order with validation

// **🔹 Route for Updating Order Status**
router.put("/:id/status", validateUpdateOrderStatus, validateResult, updateOrderStatus);  // Update order status (Shipped, Delivered, etc.)

// **🔹 Route for Canceling an Order**
router.put("/:id/cancel", cancelOrder);  // Cancel order and restore stock

// **🔹 Route for Processing Refund for an Order**
router.put("/:id/refund", processRefund);  // Process refund and update payment status

// **🔹 Route to Get a Single Order by ID**
router.get("/:id", getOrderById);  // Get the full details of a specific order

// **🔹 Route to Get All Orders (Admin)**
router.get("/", getAllOrders);  // Get all orders for admin (could be paginated)

module.exports = router;
