const express = require("express");
const {
    createAnalytics,
    getAnalyticsByPeriod,
    calculateAnalyticsTrend
} = require("./analyticsController");

const router = express.Router();

// **🔹 Route to Create Analytics Data**
router.post("/create", createAnalytics);

// **🔹 Route to Get Analytics by Period (Daily, Weekly, etc.)**
router.get("/:period", getAnalyticsByPeriod);

// **🔹 Route to Calculate Analytics Trend**
router.get("/:metricType/:period/trend", calculateAnalyticsTrend);

module.exports = router;
