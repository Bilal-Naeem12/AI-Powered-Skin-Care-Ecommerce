const express = require("express");
const {
  registerUser,
  verifyEmail,
  loginUser,
  refreshToken,
  requestPasswordReset,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  softDeleteAccount,
  getAllUsers,
  changeUserRole
} = require("./userController");

const { authMiddleware } = require("../../middleware/authMiddleware");
const { roleMiddleware } = require("../../middleware/roleMiddleware");
const { validateUserRegistration, validateLogin, validatePasswordReset } = require("./userValidator");

const router = express.Router();

// **🔹 Authentication Routes**
router.post("/register", validateUserRegistration, registerUser);  // Register
router.get("/verify-email", verifyEmail);  // Email Verification
router.post("/login", validateLogin, loginUser);  // Login
router.post("/refresh-token", refreshToken);  // Refresh Token

// **🔹 Password Reset Routes**
router.post("/request-password-reset", requestPasswordReset);  // Request Password Reset
router.post("/reset-password", validatePasswordReset, resetPassword);  // Reset Password

// **🔹 User Profile Routes (Protected)**
router.get("/profile", authMiddleware, getUserProfile);  // Get User Profile
router.put("/profile", authMiddleware, updateUserProfile);  // Update User Profile
router.delete("/profile", authMiddleware, softDeleteAccount);  // Soft Delete Account

// **🔹 Admin Routes (Requires Admin Role)**
router.get("/admin/all-users", authMiddleware, roleMiddleware("admin"), getAllUsers);  // Get All Users
router.put("/admin/change-role", authMiddleware, roleMiddleware("admin"), changeUserRole);  // Change User Role

module.exports = router;
