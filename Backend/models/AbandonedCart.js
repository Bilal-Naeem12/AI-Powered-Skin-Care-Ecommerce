const mongoose = require('mongoose');

const AbandonedCartSchema = new mongoose.Schema({
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
            priceAtTimeOfAbandonment: {
                type: Number,
                required: true
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    discountOffered: {
        type: Number,
        default: 0 // Used for sending limited-time discount offers
    },
    cartAbandonedAt: {
        type: Date,
        default: Date.now
    },
    recoveryEmailSent: {
        type: Boolean,
        default: false
    },
    recoverySMSsent: {
        type: Boolean,
        default: false
    },
    recovered: {
        type: Boolean,
        default: false
    },
    recoveredAt: {
        type: Date,
        default: null
    }
});

// **Middleware: Auto-update timestamps and mark recovered carts**
AbandonedCartSchema.pre('save', function (next) {
    if (this.recovered) {
        this.recoveredAt = Date.now();
    }
    next();
});

module.exports = mongoose.model("AbandonedCart", AbandonedCartSchema);
