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
  changeUserRole,
  logoutUser,
  adminSoftDeleteUser,
  restoreSoftDeletedUser,
  checkRefreshTokenStatus,
  updateUserConsent,
  completeWalkthrough,
  getLatestFaceVerificationImage
} = require("./userController");

const { authMiddleware } = require("../../middleware/authMiddleware");
const { roleMiddleware } = require("../../middleware/roleMiddleware");
const { validateUserRegistration, validateLogin, validatePasswordReset, validateResult, validateEmail } = require("./userValidator");

const router = express.Router();
const authLimiter = require("express-rate-limit")({ windowMs: 15 * 60 * 1000, limit: 30 });
router.use(["/login", "/register", "/request-password-reset", "/resend-verification"], authLimiter);
router.post("/resend-verification", validateEmail, validateResult, require("./userController").resendVerification);


// Authentication Routes
router.post("/register", validateUserRegistration, validateResult, registerUser);  // Register
router.get("/check-refresh-token", checkRefreshTokenStatus);  // Refresh Token
router.get("/verify-email", verifyEmail);  // Email Verification
router.post("/login", validateLogin, validateResult, loginUser);  // Login
router.post("/refresh-token", refreshToken);  // Refresh Token
router.patch("/:id/walkthrough", authMiddleware, completeWalkthrough);

router.get("/:id/face-verification", authMiddleware, getLatestFaceVerificationImage);

// Password Reset Routes
router.post("/request-password-reset", validateEmail, validateResult, requestPasswordReset);  // Request Password Reset
router.post("/reset-password", validatePasswordReset, validateResult, resetPassword);  // Reset Password

// User Profile Routes (Protected)
router.get("/profile", authMiddleware, getUserProfile);  // Get User Profile
router.put("/profile", authMiddleware, updateUserProfile);  // Update User Profile
router.delete("/profile", authMiddleware, softDeleteAccount);  // Soft Delete Account
router.patch("/consent/:userId",authMiddleware, updateUserConsent);
// Admin Routes (Requires Admin Role)
router.get("/admin/all-users", authMiddleware, roleMiddleware("admin"), getAllUsers);  // Get All Users
router.put("/admin/change-role", authMiddleware, roleMiddleware("admin"), changeUserRole);  // Change User Role
router.post("/logout", logoutUser);  // Logout
router.delete(
  "/admin/soft-delete/:id",       // matches DELETE call from UI
  authMiddleware,
  roleMiddleware("admin"),
  adminSoftDeleteUser
);

router.put(
  "/admin/restore/:id",
  authMiddleware,
  roleMiddleware("admin"),
  restoreSoftDeletedUser
);

module.exports = router;
