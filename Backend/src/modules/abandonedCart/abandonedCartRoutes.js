const express = require("express");
const { createAbandonedCart, getAbandonedCart, sendRecoveryEmail } = require("./abandonedCartController");

const router = express.Router();

// **🔹 Route to Create Abandoned Cart**
router.post("/create", createAbandonedCart);

// **🔹 Route to Get Abandoned Cart by User ID**
router.get("/:userId", getAbandonedCart);

// **🔹 Route to Send Recovery Email for Abandoned Cart**
router.post("/:userId/recovery-email", sendRecoveryEmail);

module.exports = router;
