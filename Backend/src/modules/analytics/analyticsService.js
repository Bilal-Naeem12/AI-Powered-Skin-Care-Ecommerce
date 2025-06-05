// src/modules/analytics/analyticsService.js
const Analytics = require("./analyticsModel");

/* ---------- CRUD helpers ---------- */
exports.createAnalytics = (data) => new Analytics(data).save();
exports.getAnalyticsByPeriod = (period) => Analytics.find({ period }).sort({ startDate: -1 });
exports.calculateAnalyticsTrend = (metricType, period = "Day") =>
  Analytics.updateTrend(metricType, period);

/* ---------- Dashboard helpers ---------- */
exports.getKPICard = async (metricType, period = "Day") =>
  Analytics.findOne({ metricType, period }).sort({ startDate: -1 }).lean();

exports.getLineChart = async (metricType, period = "Month", months = 12) => {
  const start = new Date();
  start.setMonth(start.getMonth() - (months - 1));
  start.setDate(1); // align to first of month

  return Analytics.find({
    metricType,
    period,
    startDate: { $gte: start }
  }).sort({ startDate: 1 }).lean();
};

exports.getLeaderboard = async (metricType, limit = 10) => {
  const docs = await Analytics.aggregate([
    { $match: { metricType, period: "Month" } },      // only monthly buckets
    { $group: { _id: "$associatedEntity", views: { $sum: "$value" } } },
    { $sort: { views: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product"
      }
    },
    { $unwind: "$product" },
    { $project: { _id: 0, product: 1, views: 1 } }
  ]);
  return docs;
};


exports.getKPICardByStart = async (metricType, period, startDate) => {
  return Analytics.findOne({ metricType, period, startDate }).lean();
};