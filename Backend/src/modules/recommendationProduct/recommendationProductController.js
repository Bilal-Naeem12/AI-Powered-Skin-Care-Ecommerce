const Recommendation = require("./recommendationProductModel");
const SkinHistory   = require("../skinAnalysisHistory/skinAnalysisHistoryModel");
const mongoose      = require("mongoose");

/**
 * Bulk-create recommended products for a history entry
 * POST /api/recommendations/:historyId
 * Body: { products: [{ productId, step? }, …] }
 */
exports.addRecommendations = async (req, res) => {
  try {
    const { historyId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(historyId))
      return res.status(400).json({ error: "Invalid historyId" });

    const skinHistory = await SkinHistory.findById(historyId);
    if (!skinHistory) return res.status(404).json({ error: "History not found" });

    const products = req.body.products; 
    // e.g. [{ productId: "...", step: "step1" }, …]

    // Create all recommendation docs
    const recDocs = products.map(p => ({
      skinHistoryId: historyId,
      productId:     p.productId,
      step:          p.step,
    }));
    const created = await Recommendation.insertMany(recDocs);

    // Save their IDs back onto the history entry
    skinHistory.recommendations.push(...created.map(d => d._id));
    await skinHistory.save();

    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add recommendations" });
  }
};

/**
 * Get recommendations by history entry
 * GET /api/recommendations/:historyId
 */
exports.getByHistory = async (req, res) => {
  try {
    const { historyId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(historyId))
      return res.status(400).json({ error: "Invalid historyId" });

    const recs = await Recommendation.find({ skinHistoryId: historyId })
      .populate("productId") // optionally populate product details
      .lean();

    res.json(recs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
};
