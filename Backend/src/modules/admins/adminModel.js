const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AdminSchema = new mongoose.Schema({
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
    role: {
        type: String,
        enum: ["superadmin", "admin", "moderator"],
        default: "admin"
    },
    profileImage: {
        type: String, // URL of profile picture
        default: null
    },

    // **Authentication & Security**
    isVerified: {
        type: Boolean,
        default: false // Email verification status
    },
    twoFactorEnabled: {
        type: Boolean,
        default: false // MFA (Multi-Factor Authentication)
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    },

    // **Permissions & Actions**
    permissions: {
        manageUsers: { type: Boolean, default: false },
        manageOrders: { type: Boolean, default: true },
        manageProducts: { type: Boolean, default: true },
        manageAnalytics: { type: Boolean, default: false },
        manageAdmins: { type: Boolean, default: false }
    },

    // **Admin Activity Logs**
    activityLogs: [
        {
            action: { type: String, required: true }, // Example: "Added Product", "Deleted User"
            details: { type: String }, // Additional details
            timestamp: { type: Date, default: Date.now }
        }
    ],

    // **Platform Analytics & Reports**
    lastLogin: {
        type: Date,
        default: null
    },
    totalRevenueGenerated: {
        type: Number,
        default: 0
    },
    totalOrdersManaged: {
        type: Number,
        default: 0
    },
    totalUsersManaged: {
        type: Number,
        default: 0
    },

    // **Timestamps & Soft Deletion**
    isDeleted: {
        type: Boolean,
        default: false // Soft delete instead of permanent removal
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
AdminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// **Method: Generate JWT Token**
AdminSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        { adminId: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// **Method: Compare Hashed Password**
AdminSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// **Method: Log Admin Activity**
AdminSchema.methods.logActivity = async function (action, details) {
    this.activityLogs.push({ action, details });
    await this.save();
};

module.exports = mongoose.model("Admin", AdminSchema);
