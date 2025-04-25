const ReviewService = require("./reviewService");

// **🔹 Create a New Review**
exports.createReview = async (req, res, next) => {
    try {
      const { productId } = req.params;
      const { rating, reviewText, pros, cons, images } = req.body;
      const userId = req.user._id;                       // set by isAuth
  
      await ReviewService.addReview({
        productId,
        userId,
        rating,
        reviewText,
        pros,
        cons,
        reviewImages: images
      });
  
      res.status(201).json({ message: "Review submitted for moderation." });
    } catch (err) {
      next(err); // global error handler
    }
  };

// **🔹 Get Reviews by Product ID**
exports.getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await ReviewService.getReviewsByProduct(productId);
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Get Reviews by User ID**
exports.getReviewsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const reviews = await ReviewService.getReviewsByUser(userId);
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Update Review Status (Approve/Reject)**
exports.updateReviewStatus = async (req, res) => {
    try {
        const { reviewId, status } = req.body;
        const updatedReview = await ReviewService.updateReviewStatus(reviewId, status);
        res.status(200).json({ message: "Review status updated", review: updatedReview });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Add Reply to Review**
exports.addReplyToReview = async (req, res) => {
    try {
        const { reviewId, userId, comment } = req.body;
        const updatedReview = await ReviewService.addReplyToReview(reviewId, userId, comment);
        res.status(200).json({ message: "Reply added", review: updatedReview });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// **🔹 Vote on Review (Upvote/Downvote)**
exports.voteOnReview = async (req, res) => {
    try {
        const { reviewId, type } = req.body;
        const updatedReview = await ReviewService.voteOnReview(reviewId, type);
        res.status(200).json({ message: `Review ${type}d`, review: updatedReview });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
