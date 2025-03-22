const GiftCard = require("./giftCardModel");
const { generateGiftCardCode, isGiftCardActive, isGiftCardExpired, updateGiftCardStatus } = require("./giftCardUtils");

// **🔹 Create Gift Card**
exports.createGiftCard = async (giftCardData) => {
    giftCardData.code = generateGiftCardCode();
    giftCardData.balance = giftCardData.amount; // Initially set balance to the amount
    const newGiftCard = new GiftCard(giftCardData);
    await newGiftCard.save();
    return newGiftCard;
};

// **🔹 Redeem Gift Card**
exports.redeemGiftCard = async (giftCardId, amount, orderId) => {
    const giftCard = await GiftCard.findById(giftCardId);
    if (!giftCard) throw new Error("Gift card not found");
    if (!isGiftCardActive(giftCard.status)) throw new Error("Gift card is not active");

    // Deduct balance and record transaction
    giftCard.balance -= amount;
    giftCard.transactions.push({ orderId, amountUsed: amount });
    await giftCard.save();

    // Update status if balance is 0
    await updateGiftCardStatus(giftCard);
    return giftCard;
};

// **🔹 Get Gift Card By Code**
exports.getGiftCardByCode = async (code) => {
    return await GiftCard.findOne({ code }).populate("senderId recipientId");
};

// **🔹 Get All Gift Cards**
exports.getAllGiftCards = async () => {
    return await GiftCard.find();
};

// **🔹 Update Gift Card Status (Expire or Mark as Used)**
exports.updateGiftCardStatus = async (giftCardId) => {
    const giftCard = await GiftCard.findById(giftCardId);
    if (!giftCard) throw new Error("Gift card not found");
    return await updateGiftCardStatus(giftCard);
};
