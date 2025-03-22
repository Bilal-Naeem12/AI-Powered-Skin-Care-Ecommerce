const CouponService = require("./couponService");

// **🔹 Create a New Coupon**
exports.createCoupon = async (req, res) => {
    try {
        const couponData = req.body;
        const newCoupon = await CouponService.createCoupon(couponData);
        res.status(201).json({ message: "Coupon created successfully", coupon: newCoupon });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// **🔹 Get Active Coupon by Code**
exports.getCoupon = async (req, res) => {
    try {
        const { code } = req.params;
        const coupon = await CouponService.getCouponByCode(code);
        if (!coupon) return res.status(404).json({ message: "Coupon not found or expired" });

        res.status(200).json(coupon);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Get All Active Coupons**
exports.getAllActiveCoupons = async (req, res) => {
    try {
        const coupons = await CouponService.getActiveCoupons();
        res.status(200).json(coupons);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Deactivate Coupon**
exports.deactivateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCoupon = await CouponService.deactivateCoupon(id);
        res.status(200).json({ message: "Coupon deactivated successfully", coupon: updatedCoupon });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Apply Coupon to Order**
exports.applyCouponToOrder = async (req, res) => {
    try {
        const { couponCode, orderAmount } = req.body;
        const totalAfterDiscount = await CouponService.applyCouponToOrder(couponCode, orderAmount);
        res.status(200).json({ totalAmount: totalAfterDiscount });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
