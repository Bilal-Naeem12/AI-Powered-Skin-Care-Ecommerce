const { body } = require("express-validator");

exports.validateReviewFlagData = [
    body("reviewId").notEmpty().withMessage("Review ID is required"),
    body("flaggedBy").notEmpty().withMessage("Flagged By (user) is required"),
    body("reason").isIn(["Inappropriate Language", "Spam", "False Information", "Hate Speech", "Personal Attack", "Other"])
        .withMessage("Invalid flag reason"),
    body("additionalComment").optional().isString().withMessage("Additional comment must be a string")
];
