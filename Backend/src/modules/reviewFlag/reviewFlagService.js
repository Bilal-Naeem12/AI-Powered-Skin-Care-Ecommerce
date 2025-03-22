const ReviewFlag = require("./reviewFlagModel");

// **🔹 Create a Flag for a Review**
exports.createReviewFlag = async (flagData) => {
    const newFlag = new ReviewFlag(flagData);
    await newFlag.save();
    return newFlag;
};

// **🔹 Get Flagged Reviews**
exports.getFlaggedReviews = async () => {
    return await ReviewFlag.find().populate("reviewId flaggedBy reviewedBy");
};

// **🔹 Get Flagged Review by ID**
exports.getFlaggedReviewById = async (flagId) => {
    return await ReviewFlag.findById(flagId).populate("reviewId flaggedBy reviewedBy");
};

// **🔹 Resolve a Flag**
exports.resolveFlag = async (flagId, resolutionData) => {
    const flag = await ReviewFlag.findById(flagId);
    if (!flag) throw new Error("Review flag not found");

    flag.status = "Reviewed";
    flag.resolution = resolutionData.resolution;
    flag.reviewedBy = resolutionData.reviewedBy;
    flag.resolvedAt = new Date();

    await flag.save();
    return flag;
};
