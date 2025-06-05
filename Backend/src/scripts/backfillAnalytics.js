/**
 * node scripts/backfillAnalytics.js
 * Populates metrics from existing paid orders & users.
 */
const mongoose = require("mongoose");
const Order = require("../modules/orders/orderModel");
const User  = require("../modules/users/userModel");
const Analytics = require("../modules/analytics/analyticsModel");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const orders = await Order.find({ "statusHistory.0.what": "Paid" });
  for (const o of orders) {
    await Analytics.bump("TotalOrders", 1, o.placedAt);
    await Analytics.bump("TotalRevenue", o.totalAmount, o.placedAt);
    await Analytics.bump("AverageOrderValue", o.totalAmount, o.placedAt);
  }

  const users = await User.find({});
  for (const u of users) await Analytics.bump("NewUsers", 1, u.createdAt);

  console.log("Back-fill complete ✔");
  process.exit(0);
})();
