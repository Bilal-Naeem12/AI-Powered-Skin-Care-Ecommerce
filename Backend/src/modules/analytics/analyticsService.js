// src/modules/analytics/analyticsService.js
const Analytics = require("./analyticsModel");
const { floorDate, ceilDate,shiftDate } = require("../../utils/dateUtils");

/* ---------- CRUD helpers ---------- */
exports.createAnalytics = (data) => new Analytics(data).save();
exports.getAnalyticsByCustomQuery = (query) =>
  Analytics.find(query).sort({ startDate: -1 });

exports.calculateAnalyticsTrend = (metricType, period = "Day") =>
  Analytics.updateTrend(metricType, period);

/* ---------- Dashboard helpers ---------- */
exports.getKPICard = async (metricType, period = "Day") => {
  if (period === "Week") {
    // Get last 7 days
    const daysStart = shiftDate(floorDate(new Date(), "Day"), "Day", -6);

    const docs = await Analytics.find({
      metricType,
      period: "Day",
      startDate: { $gte: daysStart }
    }).lean();

    // Sum them
    const total = docs.reduce((sum, doc) => sum + (doc.value || 0), 0);

    return { metricType, period: "Week", value: total, docs: docs.length };
  }

  // Month or Day: just use the stored doc
  return Analytics.findOne({ metricType, period }).sort({ startDate: -1 }).lean();
};

exports.getLineChart = async (metricType, period = "Month", units = 12) => {
  let start = floorDate(new Date(), period);
  start = shiftDate(start, period, -(units - 1));

  // 🔑 1. If Week: use Day docs for last 7 days
  if (period === "Week") {
    const daysStart = shiftDate(floorDate(new Date(), "Day"), "Day", -6);

    const raw = await Analytics.find({
      metricType,
      period: "Day",
      startDate: { $gte: daysStart }
    }).sort({ startDate: 1 }).lean();

    // Format: [{ date: '2025-07-07', value: 123 }]
    return raw.map(doc => ({
      date: doc.startDate,
      value: doc.value
    }));
  }

  // 🔑 2. If Day: get TODAY’s single doc & expand breakdown to 24h
  if (period === "Day") {
    const today = floorDate(new Date(), "Day");

    const doc = await Analytics.findOne({
      metricType,
      period: "Day",
      startDate: today
    }).lean();

    // fallback empty hours
    const hours = Array.from({ length: 24 }, (_, hour) => ({
      date: `${hour}:00`,
      value: 0
    }));

    if (doc && doc.breakdown?.length) {
      // Group breakdown by hour
      for (const b of doc.breakdown) {
        const hour = new Date(b.label).getUTCHours();
        hours[hour].value += b.v;
      }
    }

    return hours;
  }

  // 🔑 3. Default: Month, Quarter, Year = same as before
  const raw = await Analytics.find({
    metricType,
    period,
    startDate: { $gte: start }
  }).sort({ startDate: 1 }).lean();

  return raw;
};

exports.getLeaderboard = async (metricType, period = "Month", limit = 10) => {
  let match = { metricType, period };

  // If Week: fetch Day docs from last 7 days
  if (period === "Week") {
    const daysStart = shiftDate(floorDate(new Date(), "Day"), "Day", -6);
    match = { metricType, period: "Day", startDate: { $gte: daysStart } };
  }

  const docs = await Analytics.aggregate([
    { $match: match },
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
  const safeStart = floorDate(startDate, period);
  return Analytics.findOne({ metricType, period, startDate: safeStart }).lean();
};