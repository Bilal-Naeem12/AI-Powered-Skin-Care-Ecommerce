const { sendError } = require("../../middleware/errorHandler");
// src/modules/analytics/analyticsController.js
const AnalyticsService = require("./analyticsService");
const { floorDate, ceilDate,shiftDate } = require("../../utils/dateUtils");
const Analytics = require("./analyticsModel");
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
    const { metricTypes, startDate, endDate, today } = req.query;

    const query = { period };
    const dateNow = new Date();
    let rangeStart, rangeEnd, prevRangeStart, prevRangeEnd;

    // Handle today shortcut for Day or Month
    if (today === "true") {
      if (period === "Day") {
        rangeStart = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate());
        rangeEnd = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate() + 1);
        prevRangeStart = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate() - 1);
        prevRangeEnd = rangeStart;
      } else if (period === "Month") {
        rangeStart = new Date(dateNow.getFullYear(), dateNow.getMonth(), 1);
        rangeEnd = new Date(dateNow.getFullYear(), dateNow.getMonth() + 1, 1);
        prevRangeStart = new Date(dateNow.getFullYear(), dateNow.getMonth() - 1, 1);
        prevRangeEnd = rangeStart;
      }

      query.startDate = { $gte: prevRangeStart, $lt: rangeEnd };
    } else if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate);
      if (endDate) query.startDate.$lte = new Date(endDate);
    }

    // Optional metric type filter
    if (metricTypes) {
      const types = metricTypes.split(",").map((t) => t.trim());
      query.metricType = { $in: types };
    }

    const data = await AnalyticsService.getAnalyticsByCustomQuery(query);
    if (!data.length) return res.status(404).json({ message: "No data found" });

    const result = [];
    const grouped = {};

    // Group by metricType
    for (const doc of data) {
      const type = doc.metricType;
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push(doc);
    }

    // Sort and calculate changePct
    for (const type in grouped) {
      const items = grouped[type].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
      const latest = items[items.length - 1];
      const previous = items.length > 1 ? items[items.length - 2] : null;

      const changePct = previous ? ((latest.value - previous.value) / previous.value) * 100 : 0;

      result.push({
        ...latest._doc,
        changePct: +changePct.toFixed(2),
      });
    }

    res.json({ docs: result });
  } catch (err) {
    sendError(res, err);
  }
};

exports.calculateAnalyticsTrend = async (req, res) => {
  try {
    const { metricType, period } = req.params;
    await AnalyticsService.calculateAnalyticsTrend(metricType, period);
    res.json({ message: "Trend updated" });
  } catch (err) {
    sendError(res, err);
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
  try {
    const { metric, period = "Month", units = 12 } = req.query;
    // 1️⃣ get raw points
    const points = await AnalyticsService.getLineChart(
      metric,
      period,
      parseInt(units, 10)
    );

    // 2️⃣ normalize every `date` to a string
    const formatted = points.map(({ date, value }) => ({
      date:
        typeof date === "string"
          ? date
          : date instanceof Date
          ? date.toISOString()
          : String(date),
      value,
    }));

    // 3️⃣ return
    res.json(formatted);
  } catch (err) {
    console.error("lineChart error:", err);
    sendError(res, err);
  }
};

exports.leaderboard = async (req, res) => {
  const { metric, period = "Month", limit = 10 } = req.query;
  const data = await AnalyticsService.getLeaderboard(metric, period, +limit);
  res.json(data);
};




async function fetchKPIWithChange(metricType, period) {
  const now = new Date();

  if (period === "Week") {
    // 🟢 Calculate this week’s Monday
    const today = floorDate(now, "Day");
    const dayOfWeek = today.getUTCDay(); // Sunday = 0, Monday = 1
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const currentStart = shiftDate(today, "Day", daysToMonday);
    const previousStart = shiftDate(currentStart, "Day", -7);

    // 🟢 Fetch all Day docs for current + previous week
    const [currentDocs, prevDocs] = await Promise.all([
      Analytics.find({
        metricType,
        period: "Day",
        startDate: { $gte: currentStart, $lte: shiftDate(currentStart, "Day", 6) }
      }).lean(),
      Analytics.find({
        metricType,
        period: "Day",
        startDate: { $gte: previousStart, $lte: shiftDate(previousStart, "Day", 6) }
      }).lean()
    ]);

    // 🟢 Sum values
    const currentValue = currentDocs.reduce((sum, d) => sum + (d.value || 0), 0);
    const prevValue = prevDocs.reduce((sum, d) => sum + (d.value || 0), 0);

    let pctChange = 0;
    if (prevValue === 0) {
      pctChange = currentValue === 0 ? 0 : 100;
    } else {
      pctChange = ((currentValue - prevValue) / prevValue) * 100;
    }

    return {
      currentValue,
      prevValue,
      pctChange: parseFloat(pctChange.toFixed(2))
    };
  }

  // ✅ Non-week: floor dates, look up normal doc
  const currentStart = floorDate(now, period);
  const previousStart = floorDate(shiftDate(now, period, -1), period);

  const [currentDoc, prevDoc] = await Promise.all([
    AnalyticsService.getKPICardByStart(metricType, period, currentStart),
    AnalyticsService.getKPICardByStart(metricType, period, previousStart),
  ]);

  const currentValue = currentDoc?.value || 0;
  const prevValue = prevDoc?.value || 0;

  let pctChange = 0;
  if (prevValue === 0) {
    pctChange = currentValue === 0 ? 0 : 100;
  } else {
    pctChange = ((currentValue - prevValue) / prevValue) * 100;
  }

  return {
    currentValue,
    prevValue,
    pctChange: parseFloat(pctChange.toFixed(2))
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
    const lineChart = revenueTrend ||[] 

    // 3. Fetch the top 10 products by “ProductViews” (monthly buckets):
    const topProducts = await AnalyticsService.getLeaderboard("ProductViews", period,10);

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
    sendError(res, err);
  }
};


/* ────────────────────────────────────────────────────────────────── */
/* ─────────────── Date Helper Functions ─────────────────────────── */
/* These must match exactly the ones in analyticsModel.js for floorDate / shiftDate. */



exports.getAllLineCharts = async (req, res) => {
  try {
    // 1. Read query params
    const period = req.query.period || "Month";
    const units  = parseInt(req.query.units || "12", 10);
    // optional comma-separated override, otherwise take your default set:
    const metrics = req.query.metrics
      ? req.query.metrics.split(",").map((m) => m.trim())
      : ["TotalRevenue", "TotalOrders", "TotalUsers", "TotalProducts"];

    // 2. Fetch each series in parallel
    const seriesEntries = await Promise.all(
      metrics.map(async (metricType) => {
        const rawPoints = await AnalyticsService.getLineChart(
          metricType,
          period,
          units
        );
        // normalize date→string
        const points = rawPoints.map(({ date, value }) => ({
          date:
            typeof date === "string"
              ? date
              : date instanceof Date
              ? date.toISOString()
              : String(date),
          value,
        }));
        return [metricType, points];
      })
    );

    // 3. Build response object
    const payload = Object.fromEntries(seriesEntries);
    return res.json(payload);
  } catch (err) {
    console.error("getAllLineCharts error:", err);
    return sendError(res, err);
  }
};


async function computeKpi(metricType, period) {
  // reuse your existing logic for week vs non-week inside fetchKPIWithChange...
  // here is a simplified version for Month/Day/Week:
  const now = new Date();
  let currentValue = 0, prevValue = 0;

  if (period === "Week") {
    // get last 7 days
    const today = floorDate(now, "Day");
    const weekStart = shiftDate(today, "Day", -6);
    const docs = await Analytics.find({
      metricType,
      period: "Day",
      startDate: { $gte: weekStart, $lte: today },
    }).lean();
    // sum for current week
    currentValue = docs.reduce((sum, d) => sum + (d.value||0), 0);

    // previous week
    const prevStart = shiftDate(weekStart, "Day", -7);
    const prevEnd   = shiftDate(prevStart, "Day", 6);
    const prevDocs = await Analytics.find({
      metricType,
      period: "Day",
      startDate: { $gte: prevStart, $lte: prevEnd },
    }).lean();
    prevValue = prevDocs.reduce((sum, d) => sum + (d.value||0), 0);
  } else {
    // Day or Month or Year etc.
    const currentStart = floorDate(now, period);
    const prevStart    = floorDate(shiftDate(now, period, -1), period);

    const [currDoc, prevDoc] = await Promise.all([
      Analytics.findOne({ metricType, period, startDate: currentStart }).lean(),
      Analytics.findOne({ metricType, period, startDate: prevStart }).lean(),
    ]);
    currentValue = currDoc?.value || 0;
    prevValue    = prevDoc?.value    || 0;
  }

  const changePct = prevValue === 0
    ? currentValue === 0 ? 0 : 100
    : ((currentValue - prevValue) / prevValue) * 100;

  return {
    value: currentValue,
    changePct: +changePct.toFixed(2),
  };
}

/**
 * GET /api/analytics/kpis?period=Day|Week|Month
 * Returns an object: { TotalOrders: {value,changePct}, TotalRevenue: {...}, ... }
 */
exports.getAllKpis = async (req, res) => {
  try {
    const period = req.query.period || "Month";
    // exclude any metrics that don't make sense as a single KPI
    const keys =  [
  /* commerce */          "TotalOrders", "TotalRevenue", "AverageOrderValue", "RefundRate",
  /* user */              "NewUsers", "ActiveUsers", "ReturningCustomers", "CustomerChurn",
  /* product engagement */"ProductViews", "MostPurchasedProduct", "AbandonedCarts","TotalUsers",
  /* custom */            "Custom"
].filter(
      (m) => m !== "MostPurchasedProduct" && m !== "Custom"
    );

    const entries = await Promise.all(
      keys.map(async (metric) => {
        const kpi = await computeKpi(metric, period);
        return [metric, kpi];
      })
    );

    const payload = Object.fromEntries(entries);
    return res.json(payload);
  } catch (err) {
    console.error("getAllKpis error:", err);
    return sendError(res, err);
  }
};