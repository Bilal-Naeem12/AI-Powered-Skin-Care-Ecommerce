// /routes/orderRoutes.js
const express = require("express");
const {
  createOrder,
  updateOrderStatus,
  cancelOrder,
  processRefund,
  getOrderById,
  getAllOrders,
  getOrderTrackingStatus
} = require("./orderController");
const { authMiddleware } = require("../../middleware/authMiddleware");
const { roleMiddleware } = require("../../middleware/roleMiddleware");

const router = express.Router();

/* user-level */
router.post("/", authMiddleware, createOrder);
router.get("/:id", authMiddleware, getOrderById);
router.put("/:id/cancel", authMiddleware, cancelOrder);
router.get("/:id/tracking", authMiddleware, getOrderTrackingStatus);

/* admin-level */
router.put("/:id/status", authMiddleware, roleMiddleware("admin"), updateOrderStatus);
router.put("/:id/refund", authMiddleware, roleMiddleware("admin"), processRefund);
router.get("/", authMiddleware, roleMiddleware("admin"), getAllOrders);

module.exports = router;
