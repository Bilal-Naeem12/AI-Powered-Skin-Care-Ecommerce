const Review = require("./reviewModel");
const { isValidRating, calculateAverageRating, formatReviewData } = require("./reviewUtils");

// **🔹 Create a New Review**
exports.createReview = async (reviewData) => {
    if (!isValidRating(reviewData.rating)) throw new Error("Rating must be between 1 and 5");

    const newReview = new Review(reviewData);
    await newReview.save();
    return newReview;
};

// **🔹 Get Reviews by Product ID**
exports.getReviewsByProduct = async (productId) => {
    return await Review.find({ productId, isDeleted: false }).populate("userId");
};

// **🔹 Get All Reviews by User ID**
exports.getReviewsByUser = async (userId) => {
    return await Review.find({ userId, isDeleted: false }).populate("productId");
};

// **🔹 Update Review Status (Approve/Reject)**
exports.updateReviewStatus = async (reviewId, status) => {
    const review = await Review.findById(reviewId);
    if (!review) throw new Error("Review not found");

    review.status = status;
    await review.save();
    return review;
};

// **🔹 Add Reply to Review**
exports.addReplyToReview = async (reviewId, userId, comment) => {
    const review = await Review.findById(reviewId);
    if (!review) throw new Error("Review not found");

    review.replies.push({ userId, comment });
    await review.save();
    return review;
};

// **🔹 Vote on Review**
exports.voteOnReview = async (reviewId, type) => {
    const review = await Review.findById(reviewId);
    if (!review) throw new Error("Review not found");

    if (type === "upvote") review.upvotes += 1;
    if (type === "downvote") review.downvotes += 1;

    await review.save();
    return review;
};
