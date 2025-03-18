const User = require("./userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail } = require("../../services/emailService");

// **🔹 Create New User**
exports.createUser = async (userData) => {
    const { email, password } = userData;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email already in use.");

    // Hash password before saving
    userData.password = await bcrypt.hash(password, 10);

    // Generate email verification token
    userData.verificationToken = crypto.randomBytes(32).toString("hex");

    // Create new user
    const newUser = await User.create(userData);

    // Send verification email
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${userData.verificationToken}`;
    await sendEmail(email, "Verify Your Email", `Click here to verify: ${verificationLink}`);

    return newUser;
};

// **🔹 Find User by ID**
exports.getUserById = async (userId) => {
    return await User.findById(userId).select("-password -refreshToken");
};

// **🔹 Update User Profile**
exports.updateUser = async (userId, updateData) => {
    return await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
};

// **🔹 Soft Delete User**
exports.softDeleteUser = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found.");

    user.isDeleted = true;
    await user.save();
    return { message: "User soft deleted successfully." };
};

// **🔹 Authenticate User (Login)**
exports.authenticateUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid email or password.");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid email or password.");

    if (!user.isVerified) throw new Error("Please verify your email first.");

    return {
        accessToken: user.generateAuthToken(),
        refreshToken: user.generateRefreshToken(),
    };
};

// **🔹 Generate Password Reset Token**
exports.generateResetToken = async (email) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found.");

    user.resetPasswordToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();
    return user.resetPasswordToken;
};

// **🔹 Reset Password**
exports.resetPassword = async (token, newPassword) => {
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) throw new Error("Invalid or expired reset token.");

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();
    return { message: "Password reset successful." };
};

// **🔹 Get All Users (Admin)**
exports.getAllUsers = async () => {
    return await User.find().select("-password -refreshToken");
};

// **🔹 Change User Role (Admin)**
exports.changeUserRole = async (userId, newRole) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found.");

    user.role = newRole;
    await user.save();
    return { message: "User role updated successfully." };
};
