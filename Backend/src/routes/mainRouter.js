const express = require("express");

// Import Routes for each module
const abandonedCartRoutes = require("../modules/abandonedCart/abandonedCartRoutes");
const analyticsRoutes = require("../modules/analytics/analyticsRoutes");
const adminRoutes = require("../modules/admins/adminRoutes");
const auditLogRoutes = require("../modules/auditLog/auditLogRoutes");
const bannerRoutes = require("../modules/banner/bannerRoutes");
const couponRoutes = require("../modules/coupon/couponRoutes");
const discountRoutes = require("../modules/discount/discountRoutes");
const giftCardRoutes = require("../modules/giftCard/giftCardRoutes");
const invoiceRoutes = require("../modules/invoice/invoiceRoutes");
const notificationRoutes = require("../modules/notification/notificationRoutes");
const orderRoutes = require("../modules/orders/orderRoutes");
// const paymentRoutes = require("../modules/payments/paymentRoutes");
const productRoutes = require("../modules/products/productRoutes");
const referralRoutes = require("../modules/referral/referralRoutes");
const reviewRoutes = require("../modules/review/reviewRoutes");
const reviewFlagRoutes = require("../modules/reviewFlag/reviewFlagRoutes");
const shippingRoutes = require("../modules/shipping/shippingRoutes");
const systemConfigRoutes = require("../modules/systemConfig/systemConfigRoutes");
const userRoutes = require("../modules/users/userRoutes");

const router = express.Router();

// **Main Router** - Combine all module routes under /api/{moduleName}
router.use("/abandoned-carts", abandonedCartRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/admins", adminRoutes);
router.use("/audit-logs", auditLogRoutes);
router.use("/banners", bannerRoutes);
router.use("/coupons", couponRoutes);
router.use("/discounts", discountRoutes);
router.use("/gift-cards", giftCardRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/notifications", notificationRoutes);
router.use("/orders", orderRoutes);
// router.use("/payments", paymentRoutes);
router.use("/products", productRoutes);
router.use("/referrals", referralRoutes);
router.use("/reviews", reviewRoutes);
router.use("/review-flags", reviewFlagRoutes);
router.use("/shipping", shippingRoutes);
router.use("/system-config", systemConfigRoutes);
router.use("/users", userRoutes);

module.exports = router;
