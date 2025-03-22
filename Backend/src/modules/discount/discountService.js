const Discount = require("./discountModel");
const { isValidDiscountCode, calculateDiscount, applyDiscountToOrder } = require("./discountUtils");

// **🔹 Create a Discount**
exports.createDiscount = async (discountData) => {
    const newDiscount = new Discount(discountData);
    await newDiscount.save();
    return newDiscount;
};

// **🔹 Get Discount by Code**
exports.getDiscountByCode = async (code) => {
    return await Discount.findOne({ code, isActive: true });
};

// **🔹 Get All Active Discounts**
exports.getActiveDiscounts = async () => {
    return await Discount.find({ isActive: true });
};

// **🔹 Update Discount Status**
exports.updateDiscountStatus = async (discountId, status) => {
    const discount = await Discount.findById(discountId);
    if (!discount) throw new Error("Discount not found");

    discount.isActive = status;
    await discount.save();
    return discount;
};

// **🔹 Apply Discount to Order**
exports.applyDiscountToOrder = async (code, orderAmount) => {
    const discount = await this.getDiscountByCode(code);
    if (!discount) throw new Error("Invalid or expired discount");

    return applyDiscountToOrder(discount, orderAmount);
};
