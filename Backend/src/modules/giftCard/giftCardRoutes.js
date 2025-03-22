const express = require("express");
const {
    createGiftCard,
    redeemGiftCard,
    getGiftCardByCode,
    getAllGiftCards
} = require("./giftCardController");

const router = express.Router();

// **🔹 Route to Create a Gift Card**
router.post("/create", createGiftCard);

// **🔹 Route to Redeem a Gift Card**
router.post("/redeem", redeemGiftCard);

// **🔹 Route to Get Gift Card by Code**
router.get("/:code", getGiftCardByCode);

// **🔹 Route to Get All Gift Cards**
router.get("/", getAllGiftCards);

module.exports = router;
