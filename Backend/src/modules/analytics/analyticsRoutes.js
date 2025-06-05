// src/modules/analytics/analyticsRoutes.js
const express = require("express");
const {
  createAnalytics,
  getAnalyticsByPeriod,
  calculateAnalyticsTrend,
  kpiCard,
  lineChart,
  leaderboard
} = require("./analyticsController");

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

module.exports = router;
