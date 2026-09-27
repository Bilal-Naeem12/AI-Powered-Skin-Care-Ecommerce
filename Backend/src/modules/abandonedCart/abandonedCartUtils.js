const { sendEmail } = require("../../services/emailService");
const { discountOffer } = require("../../config/env");
exports.sendRecoveryEmail = (userEmail, cartDetails) => sendEmail(userEmail,
  "Your Cart is Waiting for You!",
  `It looks like you left some items in your cart. Cart details: ${JSON.stringify(cartDetails)}. Use code RECOVERY20 for a ${discountOffer}% discount.`);

// **🔹 Calculate Discount Based on Cart Total**
exports.calculateDiscount = (totalAmount) => {
    return totalAmount * (discountOffer / 100);
};
