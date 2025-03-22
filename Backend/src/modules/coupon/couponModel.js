const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true,
        uppercase: true,
        trim: true
    },
    description: {
        type: String,
        default: null,
        trim: true
    },
    discountType: {
        type: String,
        enum: ["Percentage", "Fixed Amount"],
        required: true
    },
    discountValue: {
        type: Number,
        required: true,
        min: [0, "Discount value cannot be negative"]
    },
    minOrderAmount: {
        type: Number,
        default: 0
    },
    maxDiscountAmount: {
        type: Number,
        default: null // Used for percentage discounts to set a cap
    },
    applicableProducts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    applicableCategories: [
        {
            type: String // Example: "Moisturizer", "Serum", "Cleanser"
        }
    ],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    usageLimit: {
        type: Number,
        default: null // Maximum number of times this coupon can be used
    },
    usedCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
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

// **Middleware: Auto-update timestamps & deactivate expired coupons**
CouponSchema.pre('save', function (next) {
    this.updatedAt = Date.now();

    // Auto-deactivate expired coupons
    if (this.endDate < new Date() && this.isActive) {
        this.isActive = false;
    }

    next();
});

module.exports = mongoose.model("Coupon", CouponSchema);
