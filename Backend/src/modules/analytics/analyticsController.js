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
