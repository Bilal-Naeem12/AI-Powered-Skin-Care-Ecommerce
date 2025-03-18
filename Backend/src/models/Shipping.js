const mongoose = require('mongoose');

const ShippingSchema = new mongoose.Schema({
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
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        postalCode: { type: String, required: true }
    },
    trackingNumber: {
        type: String,
        unique: true,
        default: null
    },
    carrier: {
        type: String,
        enum: ["DHL", "FedEx", "UPS", "USPS", "Other"],
        default: "Other"
    },
    estimatedDeliveryDate: {
        type: Date
    },
    shippingStatus: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Out for Delivery", "Delivered", "Returned"],
        default: "Pending"
    },
    deliveryConfirmation: {
        type: Boolean,
        default: false
    },
    isDelayed: {
        type: Boolean,
        default: false
    },
    delayReason: {
        type: String,
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

// **Middleware: Auto-update timestamps on save**
ShippingSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Shipping", ShippingSchema);
