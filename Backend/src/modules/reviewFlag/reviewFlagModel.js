const mongoose = require('mongoose');

// Check if the model is already defined before defining it again
const ReviewFlagSchema = new mongoose.Schema({
    reviewId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
        required: true
    },
    flaggedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reason: {
        type: String,
        enum: [
            "Inappropriate Language", "Spam", "False Information",
            "Hate Speech", "Personal Attack", "Other"
        ],
        required: true
    },
    additionalComment: {
        type: String,
        trim: true,
        default: null
    },
    status: {
        type: String,
        enum: ["Pending", "Reviewed", "Resolved"],
        default: "Pending"
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        default: null
    },
    resolution: {
        type: String,
        enum: ["Approved", "Rejected", "Deleted Review", "Warned User"],
        default: null
    },
    flaggedAt: {
        type: Date,
        default: Date.now
    },
    resolvedAt: {
        type: Date,
        default: null
    }
});

// Ensure the model is not redefined if already defined
const ReviewFlag = mongoose.models.ReviewFlag || mongoose.model('ReviewFlag', ReviewFlagSchema);

module.exports = ReviewFlag;
