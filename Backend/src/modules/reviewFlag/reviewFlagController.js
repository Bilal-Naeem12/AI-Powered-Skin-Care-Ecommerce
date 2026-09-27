const { sendError } = require("../../middleware/errorHandler");
const ReviewFlagService = require("./reviewFlagService");

// **🔹 Create a Flag for a Review**
exports.createReviewFlag = async (req, res) => {
    try {
        const flagData = req.body;
        const newFlag = await ReviewFlagService.createReviewFlag(flagData);
        res.status(201).json({ message: "Review flagged successfully", flag: newFlag });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// **🔹 Get All Flagged Reviews**
exports.getFlaggedReviews = async (req, res) => {
    try {
        const flaggedReviews = await ReviewFlagService.getFlaggedReviews();
        res.status(200).json(flaggedReviews);
    } catch (error) {
        sendError(res, error);
    }
};

// **🔹 Get Flagged Review by ID**
exports.getFlaggedReviewById = async (req, res) => {
    try {
        const { flagId } = req.params;
        const flag = await ReviewFlagService.getFlaggedReviewById(flagId);
        if (!flag) return res.status(404).json({ message: "Review flag not found" });

        res.status(200).json(flag);
    } catch (error) {
        sendError(res, error);
    }
};

// **🔹 Resolve a Flagged Review**
exports.resolveFlag = async (req, res) => {
    try {
        const { flagId } = req.params;
        const resolutionData = req.body;
        const resolvedFlag = await ReviewFlagService.resolveFlag(flagId, resolutionData);
        res.status(200).json({ message: "Review flag resolved successfully", flag: resolvedFlag });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
