const SkinHistory = require("./skinAnalysisHistoryModel");
const mongoose     = require("mongoose");
const RecommendationProduct = require("../recommendationProduct/recommendationProductModel")
// Create a new history record
exports.createHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ error: "Invalid userId" });

    // 1) Create the SkinHistory entry (without recs yet)
    const history = await SkinHistory.create({
      userId,
      scanned_image_before:   req.body.scanned_image_before,
      scanned_image_after:   req.body.scanned_image_after,
      step: req.body.step,
      detections:      req.body.detections,
      classifications: req.body.classifications,
      hydrationLevel:  req.body.hydrationLevel,
      uvExposureIndex: req.body.uvExposureIndex,
      analyzedAt:      req.body.analyzedAt || Date.now(),
      recommendations: [] // fill in next
    });

    // 2) Read productId list from payload
   const recProducts = Array.isArray(req.body.recommendations)
  ? req.body.recommendations
  : [];

if (recProducts.length) {
  const recDocs = recProducts.map((entry) => ({
    skinHistoryId: history._id,
    productId:     entry.productId,
    step: {
      stepKey:  entry.step?.stepKey ?? null,
      title:    entry.step?.title ?? null,
      category: entry.step?.category ?? null,
    }
  }));
      const createdRecs = await RecommendationProduct.insertMany(recDocs);

      // 4) Store their IDs back on the history record
      history.recommendations = createdRecs.map((d) => d._id);
      await history.save();
    }

    // 5) Return the populated history
    const populated = await SkinHistory.findById(history._id)
      .populate({
        path: "recommendations",
        populate: { path: "productId", select: "name price image" }
      })
      .lean();

    res.status(201).json(populated);
  } catch (err) {
    console.error("createHistory error:", err);
    res.status(500).json({ error: "Failed to create history record" });
  }
};
// Get all history for a user
exports.getHistoryByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ error: "Invalid userId" });

    const entries = await SkinHistory.find({ userId })
      .sort({ analyzedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "recommendations",
        populate: {
          path: "productId",
          select: "name price images",
          transform: (doc) => {
            if (doc?.images?.length > 0) {
              doc.images = [doc.images[0]];
            }
            return doc;
          },
        },
      })
      .lean();

    const total = await SkinHistory.countDocuments({ userId });

    res.json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      totalEntries: total,
      entries,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user history" });
  }
};

// Get one history entry
exports.getHistoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid history ID" });

    const entry = await SkinHistory.findById(id)
      .populate("recommendations")
      .lean();
    if (!entry) return res.status(404).json({ error: "Record not found" });

    res.json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch history record" });
  }
};

// Delete history
exports.deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid history ID" });

    const result = await SkinHistory.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ error: "Record not found" });

    res.json({ message: "History record deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete history record" });
  }
};
