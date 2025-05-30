// middleware/validateReview.js
const mongoose = require("mongoose");
const Product  = require("../modules/products/productModel");
const Review   = require("../modules/review/reviewModel");

/**
 * Middleware: validates a review submission.
 *  - rating must be an integer 1-5
 *  - reviewText optional but ≤ 1 000 chars
 *  - pros/cons arrays (max 5 each, strings ≤ 60 chars)
 *  - reviewImages array of URL strings (max 4)
 *  - makes sure product exists
 *  - enforces "one review per user per product"
 *  - sets req.validatedReview for the controller
 */
module.exports = async function validateReviewMiddleware(req, res, next) {
  try {
    const {id: productId } = req.params;
    const {
      rating,
      reviewText = "",
      pros = [],
      cons = [],
      reviewImages = []
    } = req.body;
    const userId = req.user?._id; // set by isAuth

    // ---------- Basic type & range checks ----------
    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }

    if (![1, 2, 3, 4, 5].includes(Number(rating))) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }

    if (reviewText.length > 1000) {
      return res.status(400).json({ message: "Review text exceeds 1 000 characters." });
    }

    const arrCheck = (arr, label) => {
      if (!Array.isArray(arr) || arr.length > 5)
        return `${label} must be an array with at most 5 items.`;
      if (arr.some((x) => typeof x !== "string" || x.trim().length > 60))
        return `${label} items must be non-empty strings ≤ 60 chars.`;
      return null;
    };
    let msg;
    if ((msg = arrCheck(pros, "pros")) || (msg = arrCheck(cons, "cons"))) {
      return res.status(400).json({ message: msg });
    }

    if (!Array.isArray(reviewImages) || reviewImages.length > 6) {
      return res.status(400).json({ message: "You can upload up to 6 images." });
    }

    // ---------- Existence & uniqueness ----------
    const product = await Product.findById(productId).select("_id").lean();
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const existing = await Review.findOne({ productId, userId }).select("_id").lean();
    if (existing) {
      return res
        .status(409)
        .json({ message: "You have already reviewed this product." });
    }

    //   (Optional) verify purchase history here…

    // ---------- Pass sanitized payload forward ----------
    req.validatedReview = {
      productId,
      userId,
      rating: Number(rating),
      reviewText: reviewText.trim(),
      pros,
      cons,
      reviewImages
    };

    next();
  } catch (err) {
    next(err);
  }
};
