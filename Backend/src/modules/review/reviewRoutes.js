const express = require("express");
const {
    createReview,
    getReviewsByProduct,
    getReviewsByUser,
    updateReviewStatus,
    addReplyToReview,
    voteOnReview
} = require("./reviewController");

const router = express.Router();

// **🔹 Route to Create a New Review**
router.post("/create", createReview);

// **🔹 Route to Get Reviews by Product ID**
router.get("/:productId", getReviewsByProduct);

// **🔹 Route to Get Reviews by User ID**
router.get("/user/:userId", getReviewsByUser);

// **🔹 Route to Update Review Status**
router.put("/status", updateReviewStatus);

// **🔹 Route to Add Reply to Review**
router.put("/reply", addReplyToReview);

// **🔹 Route to Vote on Review (Upvote/Downvote)**
router.put("/vote", voteOnReview);

module.exports = router;
