const Referral = require("./referralModel");
const { generateReferralCode, calculateReferralReward, isReferralActive } = require("./referralUtils");

// **🔹 Create Referral Record**
exports.createReferral = async (userId) => {
    const referralCode = generateReferralCode();
    const newReferral = new Referral({
        referrerUserId: userId,
        referralCode,
    });

    await newReferral.save();
    return newReferral;
};

// **🔹 Get Referral by Code**
exports.getReferralByCode = async (referralCode) => {
    return await Referral.findOne({ referralCode, isActive: true });
};

// **🔹 Add Invited User to Referral**
exports.addInvitedUser = async (referralCode, invitedUserId) => {
    const referral = await Referral.findOne({ referralCode, isActive: true });

    if (!referral) throw new Error("Referral code not found or expired");

    referral.invitedUsers.push({ invitedUserId });
    await referral.save();
    return referral;
};

// **🔹 Update Referral Reward Status**
exports.updateReferralReward = async (referralCode, rewardAmount) => {
    const referral = await Referral.findOne({ referralCode });

    if (!referral) throw new Error("Referral not found");

    referral.rewardAmount = rewardAmount;
    referral.rewardStatus = "Completed";
    referral.lastRewardedAt = Date.now();
    await referral.save();

    return referral;
};

// **🔹 Track Referral Success**
exports.trackReferralSuccess = async (referralCode) => {
    const referral = await Referral.findOne({ referralCode });

    if (!referral) throw new Error("Referral not found");

    referral.totalSuccessfulReferrals += 1;

    // Calculate reward after every successful referral
    const rewardAmount = calculateReferralReward(referral.totalSuccessfulReferrals);
    referral.rewardAmount = rewardAmount;

    await referral.save();
    return referral;
};
