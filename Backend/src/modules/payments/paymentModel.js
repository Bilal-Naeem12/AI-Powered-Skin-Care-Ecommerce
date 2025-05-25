const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    paymentGateway: {
        type: String,
        enum: ["Stripe", "PayPal", "Google Pay", "Apple Pay", "Bank Transfer", "Cash on Delivery"],
        required: true
    },
 transactionId: {
  type: String,
  unique: true,
  sparse: true // allows auto-generation only when needed
}
,
    amountPaid: {
        type: Number,
        required: true,
        min: [0, "Amount cannot be negative"]
    },
    currency: {
        type: String,
        default: "USD" // Change based on regional settings
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Completed", "Failed", "Refunded"],
        default: "Pending"
    },
    refundStatus: {
        type: String,
        enum: ["Not Requested", "Requested", "Processed", "Rejected"],
        default: "Not Requested"
    },
    refundTransactionId: {
        type: String, // Stores the refund transaction ID if applicable
        default: null
    },
    paymentMethodDetails: {
        cardType: { type: String, default: null }, // e.g., "Visa", "MasterCard"
        last4Digits: { type: String, default: null }, // Last 4 digits of card number
        paypalEmail: { type: String, default: null } // If PayPal is used
    },
    webhookResponse: {
        type: mongoose.Schema.Types.Mixed, // Stores raw webhook response from Stripe/PayPal
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

/* ── Auto-generate transactionId if not provided ──────────────── */
PaymentSchema.pre("validate", async function (next) {
  if (!this.transactionId) {
    const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.transactionId = `TXN-${Date.now()}-${suffix}`;
  }
  next();
});

/* ── Auto-update timestamps ───────────────────────────────────── */
PaymentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});




module.exports = mongoose.model("Payment", PaymentSchema);
