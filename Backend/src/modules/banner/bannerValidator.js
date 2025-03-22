const { body } = require("express-validator");

exports.validateBannerData = [
    body("title").notEmpty().withMessage("Title is required"),
    body("imageUrl").notEmpty().withMessage("Image URL is required"),
    body("startDate").isDate().withMessage("Start date should be a valid date"),
    body("endDate").isDate().withMessage("End date should be a valid date"),
    body("bannerType").isIn(["Homepage", "Category", "Flash Sale", "Seasonal Offer"])
        .withMessage("Invalid banner type"),
    body("priority").optional().isInt({ min: 1 }).withMessage("Priority must be a positive number")
];
