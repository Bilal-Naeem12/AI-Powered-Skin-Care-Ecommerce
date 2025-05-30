// /controllers/orderController.js
const orderService = require("./orderService");
const Shipping = require("../shipping/shippingModel");
const Order = require("./orderModel");
exports.createOrder = async (req, res, next) => {
  try {
    const order = await orderService.placeOrder({
      userId: req.user._id,
      cartItems: req.body.cartItems,
      paymentPayload: req.body.payment, // { paymentGateway, transactionId, ... }
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
    });
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus({
      orderId: req.params.id,
      orderStatus:req.body.orderStatus,
      shippingStatus: req.body.shippingStatus,
      updatedBy: req.user._id,
    });
    res.json(order);
  } catch (err) {
 const msg = err.message || "";
    if (msg.includes("not found")) {
      return res.status(404).json({ message: msg });
    }
    console.error("Order status update error:", err);
    res.status(500).json({ message: "Failed to update order status." });
  }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await orderService.cancelOrder({
      orderId: req.params.id,
      reason: req.body.reason,
      updatedBy: req.user._id,
    });
    res.json(order);
  } catch (err) {
     const msg = err.message || "";

    if (msg.includes("not found")) {
      return res.status(404).json({ status: "error", message: msg });
    }

    if (msg.includes("already cancelled")) {
      return res.status(409).json({ status: "error", message: msg });
    }

    // fallback error
    console.error("Unexpected error:", err);
    return res.status(500).json({ status: "error", message: "Something went wrong. Try again later." });
  
  
  }
};

exports.processRefund = async (req, res, next) => {
  try {
    const order = await orderService.processRefund({ orderId: req.params.id });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (err) {
    next(err);
  }
};
exports.getOrderTrackingStatus = async (req, res, next) => {
  try {
    const { id: orderId } = req.params;

    const shipping = await Shipping.findOne({ orderId });

    if (!shipping) {
      return res.status(404).json({ message: "No shipping record found for this order." });
    }

    res.status(200).json({
      trackingNumber: shipping.trackingNumber,
      carrier: shipping.carrier,
      shippingStatus: shipping.shippingStatus,
      estimatedDeliveryDate: shipping.estimatedDeliveryDate,
      isDelayed: shipping.isDelayed,
      delayReason: shipping.delayReason || null,
      updatedAt: shipping.updatedAt
    });
  } catch (err) {
    next(err);
  }
};


exports.getCustomerOrder = async (req, res) => {
  try {
    const userId = req.user._id; // populated by authMiddleware
    const orders = await Order.find({ userId })
      .populate("payment shipping invoice")
      .sort({ placedAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user." });
    }
    console.log(orders)
    res.status(200).json(orders);
  } catch (err) {
    console.error("Failed to fetch user orders:", err);
    res.status(500).json({ message: "Server error while fetching your orders." });
  }
};