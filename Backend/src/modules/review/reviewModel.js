const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating must be at most 5"]
    },
    reviewText: {
        type: String,
        trim: true
    },
    reviewImages: {
        type: [String], // Stores URLs of uploaded review images
        default: []
    },
    pros: {
        type: [String], // Example: ["Hydrating", "Gentle on skin"]
        default: []
    },
    cons: {
        type: [String], // Example: ["Expensive", "Greasy"]
        default: []
    },
    isVerifiedPurchase: {
        type: Boolean,
        default: false // Ensures user actually purchased the product
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending" // Admin moderation system
    },

    // **User Interactions**
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    },
    replies: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            comment: { type: String, trim: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],

    // **Timestamps & Soft Deletion**
    isDeleted: {
        type: Boolean,
        default: false // Allows soft deletion
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

// **Middleware: Auto-update timestamps on edits**
ReviewSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});



module.exports = mongoose.model("Review", ReviewSchema);
