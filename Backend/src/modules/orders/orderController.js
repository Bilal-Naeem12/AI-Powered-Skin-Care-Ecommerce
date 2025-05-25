// /controllers/orderController.js
const orderService = require("./orderService");
const Shipping = require("../shipping/shippingModel");

exports.createOrder = async (req, res, next) => {
  try {
    const order = await orderService.placeOrder({
      userId: req.user._id,
      items: req.body.items,
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
      status: req.body.status,
      updatedBy: req.user.userId,
    });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await orderService.cancelOrder({
      orderId: req.params.id,
      reason: req.body.reason,
      updatedBy: req.user.userId,
    });
    res.json(order);
  } catch (err) {
    next(err);
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
