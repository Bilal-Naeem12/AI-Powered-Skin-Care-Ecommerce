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
 step: {
    stepKey: { type: String, required: true },         // e.g. "step1"
    title: { type: String, required: true },           // e.g. "Cleanse Your Skin"
    category: { type: String, required: true },        // e.g. "Cleanser"
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
