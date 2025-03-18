const mongoose = require('mongoose');

const ReturnRequestSchema = new mongoose.Schema({
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
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    reason: {
        type: String,
        enum: [
            "Damaged Product", "Wrong Item Received", "Quality Issue",
            "Changed My Mind", "Other"
        ],
        required: true
    },
    returnStatus: {
        type: String,
        enum: ["Pending", "Approved", "Rejected", "Completed"],
        default: "Pending"
    },
    refundMethod: {
        type: String,
        enum: ["Original Payment Method", "Store Credit"],
        default: "Original Payment Method"
    },
    refundAmount: {
        type: Number,
        required: true,
        min: [0, "Refund amount cannot be negative"]
    },
    adminNotes: {
        type: String,
        default: null
    },
    returnTrackingNumber: {
        type: String,
        default: null
    },
    returnShipmentStatus: {
        type: String,
        enum: ["Not Shipped", "In Transit", "Delivered"],
        default: "Not Shipped"
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
ReturnRequestSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("ReturnRequest", ReturnRequestSchema);
