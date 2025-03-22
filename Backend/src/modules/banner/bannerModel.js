const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: null,
        trim: true
    },
    imageUrl: {
        type: String,
        required: true, // URL for the banner image
        trim: true
    },
    videoUrl: {
        type: String,
        default: null, // Optional video-based banners
        trim: true
    },
    redirectUrl: {
        type: String,
        default: null, // Link to product, category, or custom URL
        trim: true
    },
    bannerType: {
        type: String,
        enum: ["Homepage", "Category", "Flash Sale", "Seasonal Offer"],
        default: "Homepage"
    },
    priority: {
        type: Number,
        default: 1 // Lower number = higher priority (Displayed first)
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
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

// **Middleware: Auto-update timestamps & deactivate expired banners**
BannerSchema.pre('save', function (next) {
    this.updatedAt = Date.now();

    // Auto-disable expired banners
    if (this.endDate < new Date() && this.isActive) {
        this.isActive = false;
    }

    next();
});

module.exports = mongoose.model("Banner", BannerSchema);
