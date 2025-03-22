const GiftCardService = require("./giftCardService");

// **🔹 Create Gift Card**
exports.createGiftCard = async (req, res) => {
    try {
        const giftCardData = req.body;
        const newGiftCard = await GiftCardService.createGiftCard(giftCardData);
        res.status(201).json({ message: "Gift card created successfully", giftCard: newGiftCard });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// **🔹 Redeem Gift Card**
exports.redeemGiftCard = async (req, res) => {
    try {
        const { giftCardId, amount, orderId } = req.body;
        const updatedGiftCard = await GiftCardService.redeemGiftCard(giftCardId, amount, orderId);
        res.status(200).json({ message: "Gift card redeemed successfully", giftCard: updatedGiftCard });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// **🔹 Get Gift Card by Code**
exports.getGiftCardByCode = async (req, res) => {
    try {
        const { code } = req.params;
        const giftCard = await GiftCardService.getGiftCardByCode(code);
        if (!giftCard) return res.status(404).json({ message: "Gift card not found" });

        res.status(200).json(giftCard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Get All Gift Cards**
exports.getAllGiftCards = async (req, res) => {
    try {
        const giftCards = await GiftCardService.getAllGiftCards();
        res.status(200).json(giftCards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
