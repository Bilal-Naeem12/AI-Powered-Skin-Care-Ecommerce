const mongoose = require('mongoose');
const { Schema, model, Types } = require("mongoose");
const createError = require('http-errors');
const Analytics = require("../analytics/analyticsModel");

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
         type : Types.ObjectId,
            ref  : "Category",
           index: true,          // for fast lookups
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

    skinProblem: {
        type: [String],
        enum: {
          values: ["Dark Circles","Acne"],
          message: "{VALUE} is not a supported skin problem"
        },
        default: []
      },

    // **Images**
    images: {
        type: [String], // URLs of product images
        // validate: [arrayLimit, "At least one product image is required"]
    },

    // **Ingredients & Allergen Safety**
    ingredients: {
        type: [String], // Example: ["Aloe Vera", "Hyaluronic Acid", "Parabens"]
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
    reviewCount:   { type: Number, default: 0 },
    ratingBuckets: {               // optional histogram for ★ distribution
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    },

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
ProductSchema.virtual("reviews", {
    ref: "Review",
    localField: "_id",
    foreignField: "productId"
  });
  ProductSchema.pre(/^find/, function (next) {
    this.populate({
      path: "category",
      select: "name imageUrl",
    });
    next();
  });


  ProductSchema.methods.adjustStock = async function (
  qty,
  variant = null,
  session = null
) {
  if (variant) {
    const v = this.variants.find(v => v.size === variant);
    if (!v || v.stock < qty) throw createError(400, "Variant out of stock");;
    v.stock -= qty;
  } else {
    if (this.stock < qty) throw createError(400, "Product out of stock");
    this.stock -= qty;
  }
  this.soldCount += qty;

     await Promise.all([
      Analytics.bump("MostPurchasedProduct", qty, "Day",   new Date(), { associatedEntity: this._id, entityModel: "Product" }),
      Analytics.bump("MostPurchasedProduct", qty, "Month", new Date(), { associatedEntity: this._id, entityModel: "Product" })
    ]);
  await this.save({ session });
};

ProductSchema.index({ name: 1, brand: 1 });

module.exports = mongoose.model("Product", ProductSchema);
