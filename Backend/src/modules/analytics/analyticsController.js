// src/modules/analytics/analyticsController.js
const AnalyticsService = require("./analyticsService");

/* ----- admin CRUD (optional) ----- */
exports.createAnalytics = async (req, res) => {
  try {
    const data = await AnalyticsService.createAnalytics(req.body);
    res.status(201).json({ message: "Analytics created", data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAnalyticsByPeriod = async (req, res) => {
  try {
    const { period } = req.params;
    const data = await AnalyticsService.getAnalyticsByPeriod(period);
    if (!data.length) return res.status(404).json({ message: "No data" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.calculateAnalyticsTrend = async (req, res) => {
  try {
    const { metricType, period } = req.params;
    await AnalyticsService.calculateAnalyticsTrend(metricType, period);
    res.json({ message: "Trend updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ----- dashboard endpoints ----- */
exports.kpiCard = async (req, res) => {
  const { metric, period = "Day" } = req.query;
  const data = await AnalyticsService.getKPICard(metric, period);
  if (!data) return res.status(404).json({ message: "No data" });
  res.json(data);
};

exports.lineChart = async (req, res) => {
  const { metric, months = 12 } = req.query;
  const data = await AnalyticsService.getLineChart(metric, "Month", +months);
  res.json(data);
};

exports.leaderboard = async (req, res) => {
  const { metric, limit = 10 } = req.query;
  const data = await AnalyticsService.getLeaderboard(metric, +limit);
  res.json(data);
};





async function fetchKPIWithChange(metricType, period) {
  // 1. Determine the “startDate” for the current period and the previous period.
  //    For example, if today is June 18, 2025 and period="Month", then:
  //      currentStart = 2025-06-01
  //      previousStart = 2025-05-01
  //
  //    We re‐use the same floorDate() logic as in analyticsModel.
  const now = new Date();
  const currentStart = floorDate(now, period);
  const previousStart = floorDate(shiftDate(now, period, -1), period);

  // 2. Look up the document for the currentStart and previousStart.
  //    We use .lean() for efficiency. If no doc exists, treat its value as 0.
  const [currentDoc, prevDoc] = await Promise.all([
    AnalyticsService.getKPICardByStart(metricType, period, currentStart),
    AnalyticsService.getKPICardByStart(metricType, period, previousStart),
  ]);

  const currentValue = currentDoc?.value || 0;
  const prevValue = prevDoc?.value || 0;

  // 3. Compute percentage change. If prevValue is 0 and currentValue > 0, treat as +100%.
  //    If both are zero, pctChange = 0.
  let pctChange = 0;
  if (prevValue === 0) {
    pctChange = currentValue === 0 ? 0 : 100;
  } else {
    pctChange = ((currentValue - prevValue) / prevValue) * 100;
  }

  return {
    currentValue,
    prevValue,
    pctChange: parseFloat(pctChange.toFixed(2)), // round to two decimals
  };
}
/**
 * Dashboard overview endpoint:
 *   GET /api/analytics/dashboard?period=Month&months=6
 */
exports.dashboardOverview = async (req, res) => {
  try {
    // 0. Query parameters (default to Month, last 6 months):
    const period = req.query.period === "Day"
      ? "Day"
      : req.query.period === "Week"
      ? "Week"
      : req.query.period === "Quarter"
      ? "Quarter"
      : req.query.period === "Year"
      ? "Year"
      : "Month";
    const months = parseInt(req.query.months || "6", 10);

    // 1. Fetch each KPI (current + previous) in parallel:
    const [
      revenueKPI,
      ordersKPI,
      usersKPI,
      productsKPI
    ] = await Promise.all([
      fetchKPIWithChange("TotalRevenue", period),
      fetchKPIWithChange("TotalOrders", period),
      fetchKPIWithChange("TotalUsers", period),
      fetchKPIWithChange("TotalProducts", period)
    ]);

    // 2. Fetch line‐chart data for “TotalRevenue” over the last N months:
    const revenueTrend = await AnalyticsService.getLineChart("TotalRevenue", period, months);
    //    We only need the startDate/value pairs for the front‐end:
    const lineChart = (revenueTrend || [])
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .map((dp) => ({
        date: dp.startDate,
        value: dp.value
      }));

    // 3. Fetch the top 10 products by “ProductViews” (monthly buckets):
    const topProducts = await AnalyticsService.getLeaderboard("ProductViews", 10);

    // 4. Build the response payload:
    res.json({
      kpi: {
        totalRevenue: {
          value: revenueKPI.currentValue,
          changePct: revenueKPI.pctChange
        },
        totalOrders: {
          value: ordersKPI.currentValue,
          changePct: ordersKPI.pctChange
        },
        totalUsers: {
          value: usersKPI.currentValue,
          changePct: usersKPI.pctChange
        },
        totalProducts: {
          value: productsKPI.currentValue,
          changePct: productsKPI.pctChange
        }
      },
      lineChart,
      leaderboard: topProducts
    });
  } catch (err) {
    console.error("dashboardOverview error:", err);
    res.status(500).json({ error: err.message });
  }
};


/* ────────────────────────────────────────────────────────────────── */
/* ─────────────── Date Helper Functions ─────────────────────────── */
/* These must match exactly the ones in analyticsModel.js for floorDate / shiftDate. */

function floorDate(date, period) {
  const d = new Date(date);
  switch (period) {
    case "Day":
      d.setHours(0, 0, 0, 0);
      break;
    case "Week":
      d.setDate(d.getDate() - d.getDay());
      d.setHours(0, 0, 0, 0);
      break;
    case "Month":
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      break;
    case "Quarter":
      d.setMonth(Math.floor(d.getMonth() / 3) * 3, 1);
      d.setHours(0, 0, 0, 0);
      break;
    case "Year":
      d.setMonth(0, 1);
      d.setHours(0, 0, 0, 0);
      break;
  }
  return d;
}

function shiftDate(date, period, offset) {
  const d = new Date(date);
  switch (period) {
    case "Day":
      d.setDate(d.getDate() + offset);
      break;
    case "Week":
      d.setDate(d.getDate() + 7 * offset);
      break;
    case "Month":
      d.setMonth(d.getMonth() + offset);
      break;
    case "Quarter":
      d.setMonth(d.getMonth() + 3 * offset);
      break;
    case "Year":
      d.setFullYear(d.getFullYear() + offset);
      break;
  }
  return d;
}