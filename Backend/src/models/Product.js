const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Product description is required"],
        trim: true
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        enum: ["Moisturizer", "Cleanser", "Serum", "Sunscreen", "Exfoliator", "Toner", "Mask", "Other"]
    },
    brand: {
        type: String,
        required: [true, "Brand is required"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },
    discount: {
        percentage: { type: Number, default: 0 }, // e.g., 10% off
        discountedPrice: { type: Number } // Final price after discount
    },
    stock: {
        type: Number,
        required: [true, "Stock quantity is required"],
        min: [0, "Stock cannot be negative"]
    },
    isAvailable: {
        type: Boolean,
        default: true
    },

    // **Product Variants (Sizes, Packaging)**
    variants: [
        {
            size: String, // e.g., "50ml", "100ml"
            price: Number,
            stock: Number
        }
    ],

    // **Images**
    images: {
        type: [String], // URLs of product images
        validate: [arrayLimit, "At least one product image is required"]
    },

    // **Ingredients & Allergen Safety**
    ingredients: {
        type: [String], // Example: ["Aloe Vera", "Hyaluronic Acid", "Parabens"]
        default: []
    },
    allergens: {
        type: [String], // Example: ["Fragrance", "Alcohol"]
        default: []
    },

    // **AI Skin Suitability Tags**
    aiSkinSuitability: {
        type: [String], // Example: ["Oily Skin", "Sensitive Skin", "Acne-Prone"]
        default: []
    },

    // **Customer Ratings & Reviews**
    averageRating: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            rating: { type: Number, min: 1, max: 5 },
            comment: { type: String, trim: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],

    // **Usage Instructions & Precautions**
    usageInstructions: {
        type: String,
        trim: true
    },
    precautions: {
        type: String,
        trim: true
    },

    // **E-commerce Details**
    soldCount: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },

    // **Timestamps & Soft Deletion**
    isDeleted: {
        type: Boolean,
        default: false // Soft delete instead of removing the product
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

// **Helper function to enforce image validation**
function arrayLimit(val) {
    return val.length > 0;
}

module.exports = mongoose.model("Product", ProductSchema);
