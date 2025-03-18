const mongoose = require('mongoose');

const LoyaltyPointsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    totalPoints: {
        type: Number,
        default: 0
    },
    tier: {
        type: String,
        enum: ["Bronze", "Silver", "Gold", "Platinum"],
        default: "Bronze"
    },
    pointHistory: [
        {
            activityType: {
                type: String,
                enum: ["Purchase", "Referral", "Review", "Bonus", "Admin Adjustment", "Redemption"],
                required: true
            },
            points: {
                type: Number,
                required: true
            },
            description: {
                type: String,
                trim: true,
                default: null
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    pointsRedeemed: {
        type: Number,
        default: 0
    },
    lastRedemptionDate: {
        type: Date,
        default: null
    },
    expirationDate: {
        type: Date,
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
LoyaltyPointsSchema.pre('save', function (next) {
    this.updatedAt = Date.now();

    // Auto-assign tier based on total points
    if (this.totalPoints >= 5000) this.tier = "Platinum";
    else if (this.totalPoints >= 2000) this.tier = "Gold";
    else if (this.totalPoints >= 1000) this.tier = "Silver";
    else this.tier = "Bronze";

    next();
});

module.exports = mongoose.model("LoyaltyPoints", LoyaltyPointsSchema);
