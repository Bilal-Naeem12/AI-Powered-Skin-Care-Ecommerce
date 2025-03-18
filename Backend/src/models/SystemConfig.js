const mongoose = require('mongoose');

const SystemConfigSchema = new mongoose.Schema({
    siteName: {
        type: String,
        default: "AI Skincare E-Commerce",
        trim: true
    },
    siteLogo: {
        type: String,
        default: null // Stores URL of the platform's logo
    },
    maintenanceMode: {
        type: Boolean,
        default: false // Enables/disables maintenance mode
    },
    paymentGateways: {
        stripe: { type: Boolean, default: true },
        paypal: { type: Boolean, default: true },
        googlePay: { type: Boolean, default: false },
        applePay: { type: Boolean, default: false },
        bankTransfer: { type: Boolean, default: false }
    },
    shippingOptions: [
        {
            carrier: { type: String, enum: ["DHL", "FedEx", "UPS", "USPS", "Local Delivery"] },
            deliveryTime: { type: String, default: "5-7 Business Days" },
            cost: { type: Number, default: 5.0 }
        }
    ],
    taxSettings: {
        taxPercentage: { type: Number, default: 8.0 }, // Default tax rate
        applyTaxOnCheckout: { type: Boolean, default: true }
    },
    emailNotifications: {
        orderUpdates: { type: Boolean, default: true },
        promotions: { type: Boolean, default: true },
        reviewRequests: { type: Boolean, default: true }
    },
    featureToggles: {
        allowGuestCheckout: { type: Boolean, default: false },
        enableLoyaltyProgram: { type: Boolean, default: true },
        enableReferralProgram: { type: Boolean, default: true },
        enableLiveChatSupport: { type: Boolean, default: false }
    },
    supportEmail: {
        type: String,
        default: "support@example.com"
    },
    contactNumber: {
        type: String,
        default: "+1-800-123-4567"
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
SystemConfigSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("SystemConfig", SystemConfigSchema);
