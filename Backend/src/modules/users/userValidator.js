const { body } = require("express-validator");

// **🔹 User Registration Validation**
exports.validateUserRegistration = [
    body("first_name").notEmpty().withMessage("First name is required"),
    body("last_name").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
        .matches(/\d/)
        .withMessage("Password must contain at least one number"),
    body("phone")
        .matches(/^\+?[1-9]\d{1,14}$/)
        .withMessage("Invalid phone number"),
    body("date_of_birth").isISO8601().withMessage("Invalid date format"),
    body("gender").isIn(["Male", "Female", "Non-binary", "Other"]).withMessage("Invalid gender"),
];

// **🔹 User Login Validation**
exports.validateLogin = [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").notEmpty().withMessage("Password is required"),
];

// **🔹 Password Reset Validation**
exports.validatePasswordReset = [
    body("newPassword")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
        .matches(/\d/)
        .withMessage("Password must contain at least one number"),
];
