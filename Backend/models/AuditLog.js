const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    },
    actionType: {
        type: String,
        enum: [
            "User Management", "Order Management", "Product Management",
            "Discount Management", "Review Moderation", "System Configuration", 
            "Payment Processing", "Security"
        ],
        required: true
    },
    targetModel: {
        type: String,
        enum: ["User", "Order", "Product", "Discount", "Review", "SystemConfig"],
        required: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: null
    },
    actionDescription: {
        type: String,
        required: true,
        trim: true
    },
    ipAddress: {
        type: String,
        required: false,
        default: null
    },
    deviceInfo: {
        type: String,
        required: false,
        default: null
    },
    role: {
        type: String,
        enum: ["Admin", "SuperAdmin", "Support"],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("AuditLog", AuditLogSchema);
