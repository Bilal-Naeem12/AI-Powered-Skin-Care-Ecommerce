const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: [1, "Quantity cannot be less than 1"]
            },
            selectedVariant: {
                type: String, // Example: "50ml", "100ml"
                default: null
            },
            priceAtTimeOfOrder: {
                type: Number,
                required: true
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Completed", "Failed", "Refunded"],
        default: "Pending"
    },
    paymentMethod: {
        type: String,
        enum: ["Credit Card", "Debit Card", "PayPal", "Google Pay", "Apple Pay", "Cash on Delivery"],
        required: true
    },
    transactionId: {
        type: String, // Stores payment gateway transaction ID
        default: null
    },

    // **Shipping & Delivery Information**
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        postal_code: { type: String, required: true }
    },
    trackingNumber: {
        type: String,
        default: null
    },
    estimatedDeliveryDate: {
        type: Date
    },
    deliveryStatus: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],
        default: "Pending"
    },

    // **Order History & Lifecycle**
    orderPlacedAt: {
        type: Date,
        default: Date.now
    },
    shippedAt: {
        type: Date
    },
    deliveredAt: {
        type: Date
    },
    cancelledAt: {
        type: Date
    },

    // **Cancellation & Refund Handling**
    isCancelled: {
        type: Boolean,
        default: false
    },
    isRefunded: {
        type: Boolean,
        default: false
    },
    refundReason: {
        type: String,
        default: null
    }
});

// **Auto-update timestamps when the order status changes**
OrderSchema.pre('save', function (next) {
    if (this.deliveryStatus === "Shipped") this.shippedAt = new Date();
    if (this.deliveryStatus === "Delivered") this.deliveredAt = new Date();
    if (this.deliveryStatus === "Cancelled") this.cancelledAt = new Date();
    next();
});

module.exports = mongoose.model("Order", OrderSchema);
