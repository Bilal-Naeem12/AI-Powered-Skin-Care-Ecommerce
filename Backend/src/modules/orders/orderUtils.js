const crypto = require('crypto');

// **🔹 Generate Unique Order ID**
exports.generateOrderId = () => {
    return 'ORD-' + crypto.randomBytes(6).toString('hex').toUpperCase();
};

// **🔹 Calculate Total Amount for the Order**
exports.calculateTotalAmount = (items) => {
    let totalAmount = 0;
    items.forEach(item => {
        totalAmount += item.priceAtTimeOfOrder * item.quantity;
    });
    return totalAmount;
};

// **🔹 Calculate Total Price for an Item (Including Discounts)**
exports.calculateItemTotal = (priceAtTimeOfOrder, quantity, discountPercentage) => {
    let totalPrice = priceAtTimeOfOrder * quantity;
    if (discountPercentage > 0) {
        totalPrice -= totalPrice * (discountPercentage / 100);
    }
    return totalPrice;
};

// **🔹 Update Order Status Helper**
exports.updateOrderStatus = (order, status) => {
    order.deliveryStatus = status;
    if (status === 'Shipped') order.shippedAt = new Date();
    if (status === 'Delivered') order.deliveredAt = new Date();
    if (status === 'Cancelled') order.cancelledAt = new Date();
    return order;
};
