const crypto = require("crypto");

// **🔹 Generate Unique Payment Transaction ID**
exports.generateTransactionId = () => {
    return "TRANS-" + crypto.randomBytes(6).toString("hex").toUpperCase();
};

// **🔹 Format Payment Data (for consistency)**
exports.formatPaymentData = (paymentData) => {
    return {
        userId: paymentData.userId,
        orderId: paymentData.orderId,
        paymentGateway: paymentData.paymentGateway,
        transactionId: paymentData.transactionId,
        amountPaid: paymentData.amountPaid,
        currency: paymentData.currency || "USD",
        paymentStatus: paymentData.paymentStatus || "Pending",
        refundStatus: paymentData.refundStatus || "Not Requested",
        paymentMethodDetails: paymentData.paymentMethodDetails || {},
        createdAt: paymentData.createdAt || new Date(),
        updatedAt: paymentData.updatedAt || new Date()
    };
};

// **🔹 Validate Payment Method**
exports.validatePaymentMethod = (paymentMethod) => {
    const validPaymentMethods = [
        "Credit Card", "Debit Card", "PayPal", "Google Pay", "Apple Pay", "Bank Transfer", "Cash on Delivery"
    ];
    return validPaymentMethods.includes(paymentMethod);
};

// **🔹 Validate Refund Status**
exports.validateRefundStatus = (refundStatus) => {
    const validRefundStatuses = ["Not Requested", "Requested", "Processed", "Rejected"];
    return validRefundStatuses.includes(refundStatus);
};
