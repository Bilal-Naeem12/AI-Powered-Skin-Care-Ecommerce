// **🔹 Generate Referral Code**
exports.generateReferralCode = () => {
    return "REF" + Math.random().toString(36).substr(2, 9).toUpperCase(); // Generates a random 9 character referral code
};

// **🔹 Calculate Reward for Referrals**
exports.calculateReferralReward = (totalReferrals) => {
    let reward = 0;
    if (totalReferrals >= 10) {
        reward = 50;  // Example: 50 store credit for 10 referrals
    } else if (totalReferrals >= 5) {
        reward = 25;  // Example: 25 store credit for 5 referrals
    }
    return reward;
};

// **🔹 Validate Referral Status**
exports.isReferralActive = (referral) => {
    return referral.isActive && referral.rewardStatus !== "Completed";
};
