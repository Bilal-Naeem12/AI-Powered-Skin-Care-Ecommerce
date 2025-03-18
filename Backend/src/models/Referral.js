const mongoose = require('mongoose');

const ReferralSchema = new mongoose.Schema({
    referrerUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    referralCode: {
        type: String,
        unique: true,
        required: true,
        uppercase: true,
        trim: true
    },
    invitedUsers: [
        {
            invitedUserId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            joinedAt: {
                type: Date,
                default: Date.now
            },
            hasMadePurchase: {
                type: Boolean,
                default: false
            },
            firstPurchaseDate: {
                type: Date,
                default: null
            }
        }
    ],
    totalSuccessfulReferrals: {
        type: Number,
        default: 0
    },
    totalRewardsEarned: {
        type: Number,
        default: 0
    },
    rewardStatus: {
        type: String,
        enum: ["Pending", "Processing", "Completed"],
        default: "Pending"
    },
    rewardType: {
        type: String,
        enum: ["Discount", "Cashback", "Store Credit", "Gift"],
        default: "Store Credit"
    },
    rewardAmount: {
        type: Number,
        default: 0
    },
    lastRewardedAt: {
        type: Date,
        default: null
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

// **Middleware: Auto-update timestamps on save**
ReferralSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Referral", ReferralSchema);
