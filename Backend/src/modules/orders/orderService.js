const mongoose = require("mongoose");
const Order = require("./orderModel");
const Product = require("../products/productModel");
const Payment = require("../payments/paymentModel");
const Shipping = require("../shipping/shippingModel");
const { generateOrderId } = require("./orderUtils");

/* ────────────────────────────────────────────────────────────── *
 * 1.  PLACE ORDER  (create Order → Payment → Shipping)           *
 * ────────────────────────────────────────────────────────────── */
exports.placeOrder = async ({
  userId,
  cartItems,
  paymentPayload,   // { gateway, ... }
  shippingAddress   // { street, city, state, country, postalCode }
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let committed = false;

  try {
    /* 1-A  Reserve stock & calc total */
    let total = 0;
    for (const it of cartItems) {
      const prod = await Product.findById(it.productId).session(session);
      if (!prod || prod.isDeleted) throw new Error("Product not found");

      await prod.adjustStock(it.quantity, it.selectedVariant, session);
      it.priceAtTimeOfOrder = it.priceAtTimeOfOrder || prod.price;
      total += it.priceAtTimeOfOrder * it.quantity;
    }

    /* 1-B  Create Order (no payment/shipping data yet) */
    const newOrderId = new mongoose.Types.ObjectId();
    const order = await new Order({
      _id: newOrderId,
      orderNumber: generateOrderId(),
      userId,
      cartItems,
      totalAmount: total,
      statusHistory: [{ what: "Created", at: new Date(), by: userId }]
    }).save({ session });

    /* 1-C  Payment */
    const payment = await new Payment({
      ...paymentPayload,
      userId,
      orderId: newOrderId,
      amountPaid: total
    }).save({ session });

    /* 1-D  Shipping  (convert keys to schema shape) */
    const shipping = await new Shipping({
      userId,
      orderId: newOrderId,
      shippingAddress: {
        street:      shippingAddress.street,
        city:        shippingAddress.city,
        state:       shippingAddress.state,
        country:     shippingAddress.country,
        postal_code:  shippingAddress.postal_code
      },
      status: "Pending"
    }).save({ session });

    /* 1-E  Patch refs back onto Order */
    order.paymentId  = payment._id;
    order.shippingId = shipping._id;
    await order.save({ session });

    /* 1-F  Commit and return fully-populated order */
    await session.commitTransaction();
    committed = true;
    session.endSession();

    return await Order.withAll(newOrderId); // static helper populates everything
  } catch (err) {
    if (!committed) await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

/* ────────────────────────────────────────────────────────────── *
 * 2.  UPDATE ORDER STATUS  (admin)                               *
 *    – delegates to Shipping so single source of truth           *
 * ────────────────────────────────────────────────────────────── */
exports.updateOrderStatus = async ({ orderId, shippingStatus,orderStatus, updatedBy }) => {
  const order = await Order.findById(orderId);
  if (!order || !order.shippingId) throw new Error("Order/Shipping not found");


  const shipping = await Shipping.findOne({ orderId });
  if (!shipping) throw new Error("Shipping info not found for this order");

  shipping.shippingStatus = shippingStatus;
   order.statusHistory.push({
      what: orderStatus,
      at: new Date(),
      by:updatedBy
    });
  await shipping.save();
await order.save()
  // statusHistory is pushed by Shipping hook
  return await Order.withAll(orderId);
};

/* ────────────────────────────────────────────────────────────── *
 * 3.  CANCEL ORDER                                              *
 * ────────────────────────────────────────────────────────────── */
exports.cancelOrder = async ({ orderId, reason, updatedBy }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(orderId).session(session);
    if (!order) throw new Error("Order not found");
    if (order.isCancelled) throw new Error("Order already cancelled");

    // restore stock
    for (const it of order.cartItems) {
      const prod = await Product.findById(it.productId).session(session);
      await prod.adjustStock(-it.quantity, it.selectedVariant, session);
    }

    // cancel shipping
    const shipping = await Shipping.findOne({ orderId }).session(session);
    if (shipping) {
      shipping.shippingStatus = "Cancelled";
      await shipping.save({ session });
    }

    // refund payment
    const payment = await Payment.findOne({ orderId }).session(session);
    if (payment) {
      payment.paymentStatus = "Refunded";
      await payment.save({ session });
    }

    // mark order cancelled
    order.isCancelled   = true;
    order.refundReason  = reason;
    order.statusHistory.push({
      what: "Cancelled",
      at: new Date(),
      by:updatedBy
    });
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return await Order.withAll(orderId);   // populated order
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};


/* ────────────────────────────────────────────────────────────── *
 * 4.  SIMPLE FETCHERS                                           *
 * ────────────────────────────────────────────────────────────── */
exports.getOrderById  = (id) => Order.withAll(id);
exports.getAllOrders  = ()   => Order.find().populate("userId", "first_name last_name email");
