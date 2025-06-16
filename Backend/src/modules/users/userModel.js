
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Analytics = require("../analytics/analyticsModel");
const AnalyticsService = require("../analytics/analyticsService");
const UserSchema = new mongoose.Schema({
  first_name: {
        type: String,
        required: [true, "First name is required"],
        trim: true
    },
    last_name: {
      type: String,
      required: [true, "Last name is required"],
      trim: true
  },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"]
    },
    phone: {
        type: String,
        match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"],
        required: false, // Make it optional
        default: null, // Allow it to be null
        // Remove the unique constraint
      }
,      
  date_of_birth: {
      type: Date,
  },
  gender: {
      type: String,
      enum: ["Male", "Female", "Non-binary", "Other"],
  },
  address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      postal_code: { type: String, trim: true, match: [/^\d{4,6}$/, "Invalid postal code"] }
  },
  preferred_language: {
      type: String,
      enum: ["English", "Spanish", "French", "German", "Chinese", "Other"],
      default: "English"
  },
  skin_concerns: {
      type: [String], // Example: ["Acne", "Wrinkles", "Hyperpigmentation"]
      default: []
  },
  lifestyle_factors: {
      smoking: { type: Boolean, default: false },
      alcohol_consumption: { type: Boolean, default: false },
      diet: { type: String, enum: ["Vegetarian", "Vegan", "Non-Vegetarian", "Other"], default: "Non-Vegetarian" }
  },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    profileImage: {
        type: String, // Stores image URL
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false // Email verification status
    },
verificationTokenExpires: {
  type: Date,
  default: null,
},
    // **Allergen Preferences**
    allergenPreferences: {
        type: [String], // Example: ["Fragrance", "Alcohol", "Parabens"]
        default: []
    },

    // **Skin Analysis History**
    // skinAnalysisHistory: [
    //     {
    //         imageUrl: String, // Link to uploaded skin image
    //         analysisResults: String, // AI-based results
    //         severityFlag: Boolean, // Indicates if condition is severe
    //         recommendations: [String], // Product recommendations
    //         analyzedAt: { type: Date, default: Date.now }
    //     }
    // ],

    // **Progress Tracking**
    progressTracking: [
        {
            uploadedImage: String, // Image for tracking progress
            analysisResult: String, // AI's results at that time
            comparedToPrevious: String, // Improvement or worsening
            uploadedAt: { type: Date, default: Date.now }
        }
    ],

    // **E-commerce Related Fields**
    cart: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number, default: 1 }
        }
    ],
    wishlist: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
        }
    ],
    orderHistory: [
        {
            orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
            orderedAt: { type: Date, default: Date.now }
        }
    ],
    verificationToken: {
        type: String, // Stores the verification token
        default: null // Initially null, will be set when user registers
    },
    // **Authentication & Security**
    refreshToken: {
        type: String // Stores refresh token for authentication
    },
    resetPasswordToken: {
        type: String // Token for password reset
    },
    resetPasswordExpires: {
        type: Date // Expiry for password reset token
    },

    // **Timestamps & Soft Deletion**
    isDeleted: {
        type: Boolean,
        default: false // Soft delete instead of permanently removing users
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

// **Middleware: Hash Password Before Saving**
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// **Method: Generate Access Token**
UserSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        { userId: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// **Method: Generate Refresh Token**
UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { userId: this._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
};

// **Method: Compare Hashed Password**
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// **Method: Soft Delete User Account**
UserSchema.methods.softDelete = async function () {
    this.isDeleted = true;
    await this.save();
};

UserSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "userId",
});
/* ───────────────── Analytics hook (NewUsers) ─ */
UserSchema.post("save", async function (doc, next) {
  try {
    if (doc.isNew) {
      // Day + Month buckets for KPI & line-chart
      await Promise.all([
        Analytics.bump("NewUsers", 1, "Day",   doc.createdAt),
        Analytics.bump("NewUsers", 1, "Month", doc.createdAt),
        Analytics.updateTrend("NewUsers", "Day"),
        Analytics.updateTrend("NewUsers", "Month")
      ]);
    }
    next();
  } catch (err) { next(err); }
});

module.exports = mongoose.model('User', UserSchema);
