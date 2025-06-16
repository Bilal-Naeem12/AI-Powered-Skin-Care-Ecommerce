const User = require("./userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail } = require("../../services/emailService");
const getVerificationEmailTemplate = require("../../templates/verificationEmailTemplate");

// **🔹 Create New User**
exports.registerUser = async ({ first_name, last_name, email, password }) => {
  // 1. Check for existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email is already in use");


  // 2. Create user & generate token
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const tokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes in ms

const newUser = new User({
  first_name,
  last_name,
  email,
  password,
  verificationToken,
  verificationTokenExpires: new Date(tokenExpiry),
});
  await newUser.save();

  // 3. Send email
  const link = `${process.env.BACKEND_URL}/api/users/verify-email?token=${verificationToken}`;
  const htmlContent = getVerificationEmailTemplate(first_name, link);
  await sendEmail(email, "Verify Your Email – SkinCare Pro", htmlContent, true); // `true` for HTML body

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
