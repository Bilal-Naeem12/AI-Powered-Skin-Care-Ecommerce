const express = require("express");
const {
    createReferral,
    getReferral,
    addInvitedUser,
    updateReferralReward,
    trackReferralSuccess
} = require("./referralController");

const router = express.Router();

// **🔹 Route to Create a New Referral Code**
router.post("/create", createReferral);

// **🔹 Route to Get Referral by Code**
router.get("/:referralCode", getReferral);

// **🔹 Route to Add Invited User to Referral**
router.post("/add-invited", addInvitedUser);

// **🔹 Route to Update Referral Reward**
router.put("/reward", updateReferralReward);

// **🔹 Route to Track Referral Success**
router.put("/success", trackReferralSuccess);

module.exports = router;
