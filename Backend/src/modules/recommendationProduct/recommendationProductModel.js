const mongoose = require("mongoose");

const RecommendationProductSchema = new mongoose.Schema({
  skinHistoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SkinAnalysisHistory",
    required: true,
    index: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    index: true
  },
  step: {     // optional: which routine step (e.g. "step1")
    type: String,
    default: null
  },
  recommendedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model(
  "RecommendationProduct",
  RecommendationProductSchema
);
