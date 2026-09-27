const { sendError } = require("../../middleware/errorHandler");
const ReferralService = require("./referralService");

// **🔹 Create a New Referral Code**
exports.createReferral = async (req, res) => {
    try {
        const { userId } = req.body;
        const referral = await ReferralService.createReferral(userId);
        res.status(201).json({ message: "Referral code created", referral });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// **🔹 Get Referral by Code**
exports.getReferral = async (req, res) => {
    try {
        const { referralCode } = req.params;
        const referral = await ReferralService.getReferralByCode(referralCode);
        if (!referral) return res.status(404).json({ message: "Referral not found or expired" });

        res.status(200).json(referral);
    } catch (error) {
        sendError(res, error);
    }
};

// **🔹 Add Invited User**
exports.addInvitedUser = async (req, res) => {
    try {
        const { referralCode, invitedUserId } = req.body;
        const referral = await ReferralService.addInvitedUser(referralCode, invitedUserId);
        res.status(200).json({ message: "User added to referral", referral });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// **🔹 Update Referral Reward Status**
exports.updateReferralReward = async (req, res) => {
    try {
        const { referralCode, rewardAmount } = req.body;
        const referral = await ReferralService.updateReferralReward(referralCode, rewardAmount);
        res.status(200).json({ message: "Referral reward updated", referral });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// **🔹 Track Referral Success (User makes a purchase)**
exports.trackReferralSuccess = async (req, res) => {
    try {
        const { referralCode } = req.body;
        const referral = await ReferralService.trackReferralSuccess(referralCode);
        res.status(200).json({ message: "Referral success tracked", referral });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
