const { body, validationResult } = require("express-validator");

// **🔹 User Registration Validation**
exports.validateUserRegistration = [
    body("first_name").isString().bail().trim().notEmpty().withMessage("First name is required"),
    body("last_name").isString().bail().trim().notEmpty().withMessage("Last name is required"),
    body("email").isString().bail().trim().isEmail().withMessage("Invalid email address"),
    body("password").isString().bail()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
        .matches(/\d/)
        .withMessage("Password must contain at least one number"),
    body("phone").optional()
        .matches(/^\+?[1-9]\d{1,14}$/)
        .withMessage("Invalid phone number"),
    body("date_of_birth").optional().isISO8601().withMessage("Invalid date format"),
    body("gender").optional().isIn(["Male", "Female", "Non-binary", "Other"]).withMessage("Invalid gender"),
];

// **🔹 User Login Validation**
exports.validateLogin = [
    body("email").isString().bail().trim().isEmail().withMessage("Invalid email address"),
    body("password").isString().bail().notEmpty().withMessage("Password is required"),
];

// **🔹 Password Reset Validation**
exports.validatePasswordReset = [
    body("token").isHexadecimal().isLength({ min: 64, max: 64 }),
    body("newPassword").isString().bail()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
        .matches(/\d/)
        .withMessage("Password must contain at least one number"),
];

exports.validateEmail = [body("email").isString().bail().trim().isEmail()];
exports.validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array().map(({ path, msg }) => ({ field: path, message: msg })) });
  next();
};
