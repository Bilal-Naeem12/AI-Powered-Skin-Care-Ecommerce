const Order = require("./orderModel");
const ProductService = require("../products/productService");  // To reduce stock when an order is placed

// **🔹 Create a New Order**
exports.createOrder = async (userId, orderData) => {
    const { items, paymentMethod, shippingAddress } = orderData;

    // Calculate total amount and check stock
    let totalAmount = 0;
    for (let item of items) {
        const product = await ProductService.getProductById(item.productId);
        if (!product || product.isDeleted || product.stock < item.quantity) {
            throw new Error("Insufficient stock for product: " + product.name);
        }
        totalAmount += item.priceAtTimeOfOrder * item.quantity;

        // Reduce stock after order placement
        await ProductService.reduceStock(item.productId, item.quantity);
    }

    // Create new order
    const newOrder = new Order({
        userId,
        items,
        totalAmount,
        paymentMethod,
        shippingAddress,
        paymentStatus: "Pending",
    });

    return await newOrder.save();
};

// **🔹 Update Order Status**
exports.updateOrderStatus = async (orderId, status) => {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    order.deliveryStatus = status;

    // Trigger auto-update of timestamps when status changes
    await order.save();
    return order;
};

// **🔹 Cancel Order**
exports.cancelOrder = async (orderId, reason) => {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    if (order.isCancelled) throw new Error("Order already cancelled");

    order.isCancelled = true;
    order.refundReason = reason;
    order.deliveryStatus = "Cancelled";
    order.cancelledAt = new Date();

    // Restore stock after cancellation
    for (let item of order.items) {
        await ProductService.updateStockAfterPurchase(item.productId, item.quantity);  // Revert stock
    }

    await order.save();
    return order;
};

// **🔹 Process Refund**
exports.processRefund = async (orderId) => {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    if (order.isRefunded) throw new Error("Refund already processed");

    order.isRefunded = true;
    order.paymentStatus = "Refunded";

    await order.save();
    return order;
};

// **🔹 Get Order by ID**
exports.getOrderById = async (orderId) => {
    return await Order.findById(orderId).populate("items.productId");
};

// **🔹 Get All Orders (Admin View)**
exports.getAllOrders = async () => {
    return await Order.find().populate("userId");
};
