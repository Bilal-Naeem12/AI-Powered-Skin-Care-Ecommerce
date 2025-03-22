// **🔹 Validate if the GiftCard is Expired**
exports.isGiftCardExpired = (expirationDate) => {
    return new Date(expirationDate) < new Date();
};

// **🔹 Generate Gift Card Code**
exports.generateGiftCardCode = () => {
    return `GC-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
};

// **🔹 Check if Gift Card is Active**
exports.isGiftCardActive = (status) => {
    return status === "Active";
};

// **🔹 Update Gift Card Status (Used/Expired)**
exports.updateGiftCardStatus = (giftCard) => {
    if (giftCard.balance <= 0) {
        giftCard.status = "Used";
        giftCard.redeemedAt = new Date();
    } else if (new Date(giftCard.expirationDate) < new Date()) {
        giftCard.status = "Expired";
    }
    return giftCard;
};
