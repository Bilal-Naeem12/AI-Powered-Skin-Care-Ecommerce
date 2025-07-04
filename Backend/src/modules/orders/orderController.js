// /controllers/orderController.js
const orderService = require("./orderService");
const Shipping = require("../shipping/shippingModel");
const mongoose = require("mongoose")
const Order = require("./orderModel");
const { notify } = require("../notification/notificationService");

exports.createOrder = async (req, res, next) => {
  try {
    const order = await orderService.placeOrder({
      userId: req.user._id,
      cartItems: req.body.cartItems,
      paymentPayload: req.body.payment, // { paymentGateway, transactionId, ... }
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
    });
       await notify({
  kind: "ORDER_PLACED",
  title: "Order placed successfully",
  body: `Your order #${order.orderNumber} has been placed.`,
  userId: order.userId,
  data: { orderId: order._id }
});

  await notify({
      kind: "MANAGEMENT_ORDER_PLACED",
      title: "New order received",
      body: `Order #${order.orderNumber} has been placed by ${req.user.name || "a customer"}.`,
      role: "admin",
      data: { orderId: order._id },
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
    await notify({
  kind: "ORDER_STATUS",
  title: `Order #${order.orderNumber} cancelled`,
  body: "Your order has been successfully cancelled.",
  userId: order.userId,
  data: { orderId: order._id }
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
    await notify({
  kind: "ORDER_STATUS",
  title: `Refund processed for Order #${order.orderNumber}`,
  body: "Your refund has been processed successfully.",
  userId: order.userId,
  data: { orderId: order._id }
});
    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid Order ID format" });
  }

    const order = await orderService.getOrderById(req.params.id);
    
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
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

// GET /api/orders?page=1&limit=10
exports.getAllOrders = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const search = req.query.q?.trim() || "";
  const statusFilter = req.query.status;

  // Fetch all orders with user and shipping populated
  const allOrders = await Order.find()
    .populate("userId")
    .populate("shippingId")
    .sort({ createdAt: -1 });

  // Post-filtering (in-memory)
  let filteredOrders = allOrders;

  // Filter by latest status
if (statusFilter && statusFilter !== "All") {
  filteredOrders = filteredOrders.filter((order) => {
    // Force sorting here to guarantee latest is on top
    const sortedHistory = [...(order.statusHistory || [])].sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    const latestStatus = sortedHistory[0]?.what || "Created";
    return latestStatus === statusFilter;
  });
}

  // Filter by search string (orderNumber, email, first or last name)
  if (search) {
    const searchLower = search.toLowerCase();
    filteredOrders = filteredOrders.filter((order) => {
      const user = order.userId || {};
      return (
        order.orderNumber?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.first_name?.toLowerCase().includes(searchLower) ||
        user.last_name?.toLowerCase().includes(searchLower)
      );
    });
  }

  const totalCount = filteredOrders.length;
  const paginatedOrders = filteredOrders.slice(skip, skip + limit);

  res.json({
    orders: paginatedOrders,
    totalCount,
    page,
    limit,
  });
};



exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const {
    isCancelled,
    statusHistory,
    shippingId,
  } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: "Order not found." });

    // Explicitly handle isCancelled update if provided
    if (typeof isCancelled === "boolean") {
      order.isCancelled = isCancelled;
    }

    // Status history
    if (Array.isArray(statusHistory)) {
      order.statusHistory = statusHistory;
    }

    // Update Shipping (nested)
    if (shippingId && typeof shippingId === "object") {
      const shipping = await Shipping.findById(order.shippingId);
      if (shipping) {
        shipping.carrier = shippingId.carrier ?? shipping.carrier;
        shipping.shippingStatus = shippingId.shippingStatus ?? shipping.shippingStatus;
        shipping.trackingNumber = shippingId.trackingNumber ?? shipping.trackingNumber;
        shipping.estimatedDeliveryDate = shippingId.estimatedDeliveryDate ?? shipping.estimatedDeliveryDate;
        if (shippingId.shippingAddress) {
          shipping.shippingAddress = {
            ...shipping.shippingAddress,
            ...shippingId.shippingAddress,
          };
        }
        await shipping.save();
      }
    }

    await order.save();
    await notify({
  kind: "ORDER_STATUS",
  title: `Order #${order.orderNumber} updated`,
  body: "Your order details have been updated by the admin. Click to view details",
  userId: order.userId,
  data: { orderId: order._id }
});
    res.status(200).json({ message: "Order updated", order });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ error: "Server error" });
  }
};
