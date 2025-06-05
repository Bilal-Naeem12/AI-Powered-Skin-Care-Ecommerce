// src/modules/analytics/analyticsRoutes.js
const express = require("express");
const {
  createAnalytics,
  getAnalyticsByPeriod,
  calculateAnalyticsTrend,
  kpiCard,
  lineChart,
  leaderboard,
  dashboardOverview
} = require("./analyticsController");
const Product = require("../products/productModel");
const User = require("../users/userModel");
const Order = require("../orders/orderModel");
const Analytics = require("../analytics/analyticsModel");
const bcrypt        = require("bcryptjs");
const placeOrder    = require("../orders/orderService").placeOrder; // if you have one


/* If you have auth / role middleware, uncomment the next two lines
   and pass them into the protected routes. */
// const { authMiddleware }  = require("../../middleware/authMiddleware");
// const { roleMiddleware }  = require("../../middleware/roleMiddleware");

const router = express.Router();

/* CRUD (admin) */
router.post("/create",               createAnalytics);            // optional
router.get ("/period/:period",       getAnalyticsByPeriod);       // optional
router.get ("/trend/:metricType/:period", calculateAnalyticsTrend); // optional

/* Dashboard */
router.get("/kpi",        /* authMiddleware, roleMiddleware("admin"), */ kpiCard);
router.get("/line",       /* authMiddleware, roleMiddleware("admin"), */ lineChart);
router.get("/leaderboard",/* authMiddleware, roleMiddleware("admin"), */ leaderboard);
router.get("/dashboard", dashboardOverview);









// src/routes/analyticsRoutes.js
router.post("/dummy-seed", async (_req, res) => {
  try {
    //
    // ────────────────────────────────────────────────────
    // 1. Ensure Two Dummy Users
    // ────────────────────────────────────────────────────
    let users = await User.find().limit(2);
    if (users.length < 2) {
      const salt = await bcrypt.genSalt(10);
      users = await User.insertMany([
        {
          first_name: "Alice",
          last_name: "Lee",
          email: "alice@test.com",
          password: await bcrypt.hash("123456", salt),
        },
        {
          first_name: "Bob",
          last_name: "Kim",
          email: "bob@test.com",
          password: await bcrypt.hash("123456", salt),
        },
      ]);
    }

    //
    // ────────────────────────────────────────────────────
    // 2. Grab up to Ten Existing Products
    // ────────────────────────────────────────────────────
    const products = await Product.find({ isDeleted: false }).limit(10).lean();
    if (products.length === 0) {
      return res
        .status(400)
        .json({ error: "No products found in DB. Seed some products first." });
    }

    //
    // ────────────────────────────────────────────────────
    // 3. Seed “Five Months” of Analytics
    // ────────────────────────────────────────────────────
    const now = new Date();
    const MONTHS_TO_SEED = 7;

    let totalOrdersSeeded = 0;
    let totalRevenueSeeded = 0;

    for (let i = 0; i < MONTHS_TO_SEED; i++) {
      // ────────────────
      // 3.a. Pick a random date/time in that month
      // ────────────────
      const year = now.getFullYear();
      const monthIndex = now.getMonth() - i; // e.g. 5, 4, 3, 2, 1 for i=0..4
      //  get last day of that month:
      const lastDayOfMonth = new Date(year, monthIndex + 1, 0).getDate();
      // pick random day between 1 and lastDayOfMonth
      const randomDay = Math.floor(Math.random() * lastDayOfMonth) + 1;
      // pick random hour/min/sec
      const randomHour = Math.floor(Math.random() * 24);
      const randomMin = Math.floor(Math.random() * 60);
      const randomSec = Math.floor(Math.random() * 60);
      const placedAt = new Date(
        year,
        monthIndex,
        randomDay,
        randomHour,
        randomMin,
        randomSec
      );

      // ────────────────
      // 3.b. Generate a random # of orders (1–10) and random revenue per order
      // ────────────────
      const ordersThisMonth = Math.floor(Math.random() * 10) + 1;
      let revenueThisMonth = 0;
      for (let o = 0; o < ordersThisMonth; o++) {
        // simulate “order value” as a random product price * qty 1–3
        const randomProd = products[Math.floor(Math.random() * products.length)];
        const unitPrice =
          (Array.isArray(randomProd.variants) && randomProd.variants.length
            ? randomProd.variants[0].price
            : randomProd.price) || 10;
        const qty = Math.floor(Math.random() * 3) + 1;
        revenueThisMonth += unitPrice * qty;
      }

      totalOrdersSeeded += ordersThisMonth;
      totalRevenueSeeded += revenueThisMonth;

      // ────────────────
      // 3.c. Bump “TotalOrders” (Day + Month), “TotalRevenue” (Day + Month), “AverageOrderValue” (Day + Month)
      // ────────────────
      await Promise.all([
        // DAILY bucket
        Analytics.bump("TotalOrders", ordersThisMonth, "Day", placedAt),
        Analytics.bump("TotalRevenue", revenueThisMonth, "Day", placedAt),
        Analytics.bump("AverageOrderValue", revenueThisMonth, "Day", placedAt),
        // MONTHLY bucket
        Analytics.bump("TotalOrders", ordersThisMonth, "Month", placedAt),
        Analytics.bump("TotalRevenue", revenueThisMonth, "Month", placedAt),
        Analytics.bump("AverageOrderValue", revenueThisMonth, "Month", placedAt),
      ]);

      // ────────────────
      // 3.d. Spread “ProductViews” & “MostPurchasedProduct” randomly across our 10 products, for both Day + Month
      // ────────────────
      const productCountToBump = Math.floor(Math.random() * products.length) + 1;
      // shuffle a copy of products
      const shuffled = products.slice().sort(() => 0.5 - Math.random());
      for (let p = 0; p < productCountToBump; p++) {
        const prod = shuffled[p];
        // random “views” between 5–20
        const views = Math.floor(Math.random() * 16) + 5;
        // random “purchaseQty” between 1–5
        const purchaseQty = Math.floor(Math.random() * 5) + 1;

        await Promise.all([
          // ProductViews Day + Month
          Analytics.bump(
            "ProductViews",
            views,
            "Day",
            placedAt,
            { associatedEntity: prod._id, entityModel: "Product" }
          ),
          Analytics.bump(
            "ProductViews",
            views,
            "Month",
            placedAt,
            { associatedEntity: prod._id, entityModel: "Product" }
          ),
          // MostPurchasedProduct Day + Month
          Analytics.bump(
            "MostPurchasedProduct",
            purchaseQty,
            "Day",
            placedAt,
            { associatedEntity: prod._id, entityModel: "Product" }
          ),
          Analytics.bump(
            "MostPurchasedProduct",
            purchaseQty,
            "Month",
            placedAt,
            { associatedEntity: prod._id, entityModel: "Product" }
          ),
        ]);
      }
    }

    //
    // ────────────────────────────────────────────────────
    // 4. Ensure “TotalUsers” & “TotalProducts” exist (Month buckets only)
    // ────────────────────────────────────────────────────
    const [userTotal, productTotal] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments({ isDeleted: false }),
    ]);

    // bump single “Month” bucket at “now”
    await Promise.all([
      Analytics.bump("TotalUsers", userTotal, "Month", now),
      Analytics.bump("TotalProducts", productTotal, "Month", now),
    ]);

    //
    // ────────────────────────────────────────────────────
    // 5. Done — Return a summary
    // ────────────────────────────────────────────────────
    return res.json({
      message: `Dummy analytics created for the past ${MONTHS_TO_SEED} months.`,
      summary: {
        users: userTotal,
        products: productTotal,
        ordersSeeded: totalOrdersSeeded,
        revenueSeeded: totalRevenueSeeded.toFixed(2),
      },
    });
  } catch (err) {
    console.error("DUMMY‐SEED ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});






module.exports = router;
