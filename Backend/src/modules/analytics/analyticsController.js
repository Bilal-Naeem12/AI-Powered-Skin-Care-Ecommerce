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
// src/modules/analytics/analyticsController.js
exports.dashboardOverview = async (req, res) => {
  try {
    /* ----------------------------------------------------------------
       0.  Configurable via query (?period=Month&months=6)
       ---------------------------------------------------------------- */
    const period  = (req.query.period  || "Month") || "Day" | "Week" | "Month";
    const months  = parseInt(req.query.months || "5", 10);   // default 5

    /* ----------------------------------------------------------------
       1.  Parallel reads
       ---------------------------------------------------------------- */
    const [
      kpiRevenue,
      kpiOrders,
      kpiUsers,
      kpiProducts,
      revenueTrend,
      topProducts
    ] = await Promise.all([
      AnalyticsService.getKPICard("TotalRevenue",  period),
      AnalyticsService.getKPICard("TotalOrders",   period),
      AnalyticsService.getKPICard("TotalUsers",    period),
      AnalyticsService.getKPICard("TotalProducts", period),
      AnalyticsService.getLineChart("TotalRevenue", period, months),
      AnalyticsService.getLeaderboard("ProductViews", 10)
    ]);

    /* ----------------------------------------------------------------
       2.  Build response
       ---------------------------------------------------------------- */
    const kpi = {
      totalRevenue : kpiRevenue?.value  ?? 0,
      totalOrders  : kpiOrders?.value   ?? 0,
      totalUsers   : kpiUsers?.value    ?? 0,
      totalProducts: kpiProducts?.value ?? 0
    };

    // Ensure chronological order (service already sorts asc, but be safe)
    const lineChart = (revenueTrend || [])
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .map(dp => ({ date: dp.startDate, value: dp.value }));

    res.json({
      kpi,
      lineChart,
      leaderboard: topProducts   // already in correct { views, product } shape
    });
  } catch (err) {
    console.error("dashboardOverview error:", err);
    res.status(500).json({ error: err.message });
  }
};