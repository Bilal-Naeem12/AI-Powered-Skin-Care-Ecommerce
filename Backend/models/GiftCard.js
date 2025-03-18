const mongoose = require('mongoose');

const GiftCardSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true,
        uppercase: true,
        trim: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null // If purchased for self, this can be null
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null // If purchased as a gift for another user
    },
    emailRecipient: {
        type: String,
        lowercase: true,
        trim: true,
        default: null // Stores recipient email if they are not registered
    },
    amount: {
        type: Number,
        required: true,
        min: [0, "Gift card amount cannot be negative"]
    },
    balance: {
        type: Number,
        required: true,
        min: [0, "Gift card balance cannot be negative"]
    },
    currency: {
        type: String,
        default: "USD"
    },
    expirationDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["Active", "Used", "Expired"],
        default: "Active"
    },
    redeemedAt: {
        type: Date,
        default: null
    },
    transactions: [
        {
            orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
            amountUsed: { type: Number, required: true },
            transactionDate: { type: Date, default: Date.now }
        }
    ],
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
GiftCardSchema.pre('save', function (next) {
    this.updatedAt = Date.now();

    // Mark as expired if the expiration date has passed
    if (this.expirationDate < new Date() && this.status !== "Expired") {
        this.status = "Expired";
    }

    // Mark as used if the balance reaches zero
    if (this.balance <= 0 && this.status !== "Used") {
        this.status = "Used";
        this.redeemedAt = new Date();
    }

    next();
});

module.exports = mongoose.model("GiftCard", GiftCardSchema);
