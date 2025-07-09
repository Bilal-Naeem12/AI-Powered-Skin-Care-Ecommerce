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
    const today = floorDate(new Date(), "Day");
    const daysStart = shiftDate(today, "Day", -6); // last 7 days

    // Get last 7 Day docs
    const docs = await Analytics.find({
      metricType,
      period: "Day",
      startDate: { $gte: daysStart, $lte: today }
    }).sort({ startDate: 1 }).lean();

    // Build map for easy sum
    const map = Object.fromEntries(
      docs.map(d => [d.startDate.toISOString().slice(0, 10), d.value || 0])
    );

    let total = 0;
    const breakdown = [];

    for (let i = 0; i < 7; i++) {
      const d = shiftDate(daysStart, "Day", i);
      const key = d.toISOString().slice(0, 10);
      const v = map[key] || 0;

      breakdown.push({
        label: key,
        v: v
      });

      total += v;
    }

    // Return same shape as a real Analytics doc
    return {
      _id: null, // or a virtual `_id` if you want
      metricType,
      period: "Week",
      startDate: daysStart,
      endDate: shiftDate(today, "Day", 1), // exclusive end
      value: total,
      breakdown: breakdown,
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
      dimension: {},
      associatedEntity: null,
      entityModel: null,
      trendAbs: 0,
      trendPct: 0
    };
  }

  // Real doc for Day or Month
  const today = floorDate(new Date(), period);
  const doc = await Analytics.findOne({
    metricType,
    period,
    startDate: today
  }).lean();

  if (!doc) {
    return await Analytics.findOne({ metricType, period })
      .sort({ startDate: -1 })
      .lean();
  }

  return doc;
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