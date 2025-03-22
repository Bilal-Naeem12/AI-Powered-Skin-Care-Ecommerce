const AbandonedCart = require("./abandonedCartModel");
const { sendRecoveryEmail, calculateDiscount } = require("./abandonedCartUtils");

// **🔹 Create Abandoned Cart Record**
exports.createAbandonedCart = async (userId, cartItems, totalAmount) => {
    const newCart = new AbandonedCart({
        userId,
        items: cartItems,
        totalAmount,
        discountOffered: calculateDiscount(totalAmount),
    });

    await newCart.save();
    return newCart;
};

// **🔹 Get Abandoned Cart by User ID**
exports.getAbandonedCartByUser = async (userId) => {
    return await AbandonedCart.findOne({ userId, recovered: false });
};

// **🔹 Update Cart Recovery Status**
exports.updateCartRecoveryStatus = async (cartId, recoveryType) => {
    const cart = await AbandonedCart.findById(cartId);
    if (recoveryType === 'email') {
        cart.recoveryEmailSent = true;
    } else if (recoveryType === 'sms') {
        cart.recoverySMSsent = true;
    }
    await cart.save();
    return cart;
};

// **🔹 Recover Abandoned Cart**
exports.recoverAbandonedCart = async (cartId) => {
    const cart = await AbandonedCart.findById(cartId);
    cart.recovered = true;
    await cart.save();
    return cart;
};

// **🔹 Send Recovery Email**
exports.sendRecoveryEmailForCart = async (userEmail, cartDetails) => {
    const result = await sendRecoveryEmail(userEmail, cartDetails);
    return result;
};
