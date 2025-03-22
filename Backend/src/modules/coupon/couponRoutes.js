const express = require("express");
const {
    createCoupon,
    getCoupon,
    getAllActiveCoupons,
    deactivateCoupon,
    applyCouponToOrder
} = require("./couponController");

const router = express.Router();

// **🔹 Route to Create Coupon**
router.post("/create", createCoupon);

// **🔹 Route to Get Active Coupon by Code**
router.get("/:code", getCoupon);

// **🔹 Route to Get All Active Coupons**
router.get("/", getAllActiveCoupons);

// **🔹 Route to Deactivate Coupon**
router.put("/:id/deactivate", deactivateCoupon);

// **🔹 Route to Apply Coupon to Order**
router.post("/apply", applyCouponToOrder);

module.exports = router;
