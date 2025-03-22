const express = require("express");
const {
    createReviewFlag,
    getFlaggedReviews,
    getFlaggedReviewById,
    resolveFlag
} = require("./reviewFlagController");

const router = express.Router();

// **🔹 Route to Flag a Review**
router.post("/create", createReviewFlag);

// **🔹 Route to Get All Flagged Reviews**
router.get("/", getFlaggedReviews);

// **🔹 Route to Get Flagged Review by ID**
router.get("/:flagId", getFlaggedReviewById);

// **🔹 Route to Resolve a Flagged Review**
router.put("/:flagId/resolve", resolveFlag);

module.exports = router;
