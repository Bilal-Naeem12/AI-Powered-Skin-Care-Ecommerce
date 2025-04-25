const Review = require("./reviewModel");
const { isValidRating, calculateAverageRating, formatReviewData } = require("./reviewUtils");

// **🔹 Create a New Review**
exports.addReview = async ({
    productId,
    userId,
    rating,
    reviewText,
    pros = [],
    cons = [],
    reviewImages = []
  }) => {
    const session = await mongoose.startSession();
  
    await session.withTransaction(async () => {
      // 1) create the review (status: "Pending" by default)
      await Review.create(
        [{
          productId,
          userId,
          rating,
          reviewText,
          pros,
          cons,
          reviewImages,
          isVerifiedPurchase: true // if you already checked order history
        }],
        { session }
      );
  
      // 2) update aggregate stats on Product
      const incObj = {
        reviewCount: 1,
        [`ratingBuckets.${rating}`]: 1
      };
      await Product.updateOne({ _id: productId }, { $inc: incObj }, { session });
  
      // 3) recalc averageRating quickly from buckets
      const p = await Product.findById(productId).session(session);
      const total =
        p.ratingBuckets[1] * 1 +
        p.ratingBuckets[2] * 2 +
        p.ratingBuckets[3] * 3 +
        p.ratingBuckets[4] * 4 +
        p.ratingBuckets[5] * 5;
      p.averageRating = total / p.reviewCount;
      await p.save({ session });
    });
  
    session.endSession();
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
