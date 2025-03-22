const Coupon = require("./couponModel");
const { calculateDiscount, applyCoupon } = require("./couponUtils");

// **🔹 Create a Coupon**
exports.createCoupon = async (couponData) => {
    const newCoupon = new Coupon(couponData);
    await newCoupon.save();
    return newCoupon;
};

// **🔹 Get Active Coupon by Code**
exports.getCouponByCode = async (code) => {
    return await Coupon.findOne({ code, isActive: true });
};

// **🔹 Get All Active Coupons**
exports.getActiveCoupons = async () => {
    return await Coupon.find({ isActive: true });
};

// **🔹 Deactivate Coupon**
exports.deactivateCoupon = async (couponId) => {
    const coupon = await Coupon.findById(couponId);
    if (!coupon) throw new Error("Coupon not found");

    coupon.isActive = false;
    await coupon.save();
    return coupon;
};

// **🔹 Apply Coupon to Order**
exports.applyCouponToOrder = async (couponCode, orderAmount) => {
    const coupon = await this.getCouponByCode(couponCode);
    if (!coupon) throw new Error("Invalid or expired coupon");

    return applyCoupon(coupon, orderAmount);
};
