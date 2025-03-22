// **🔹 Validate Review Rating**
exports.isValidRating = (rating) => {
    return rating >= 1 && rating <= 5;
};

// **🔹 Calculate Average Rating for Product**
exports.calculateAverageRating = (reviews) => {
    const totalRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRatings / reviews.length;
};

// **🔹 Format Review Data**
exports.formatReviewData = (review) => {
    return {
        userId: review.userId,
        productId: review.productId,
        rating: review.rating,
        reviewText: review.reviewText,
        reviewImages: review.reviewImages,
        pros: review.pros,
        cons: review.cons,
        isVerifiedPurchase: review.isVerifiedPurchase,
        status: review.status,
        upvotes: review.upvotes,
        downvotes: review.downvotes,
        replies: review.replies,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
    };
};
