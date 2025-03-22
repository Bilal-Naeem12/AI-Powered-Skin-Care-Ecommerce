const Analytics = require("./analyticsModel");
const { formatAnalyticsPeriod, calculateTrend, getMetricSummary } = require("./analyticsUtils");

// **🔹 Create Analytics Data**
exports.createAnalytics = async (metricData) => {
    const newAnalytics = new Analytics(metricData);
    await newAnalytics.save();
    return newAnalytics;
};

// **🔹 Fetch Analytics Data by Period**
exports.getAnalyticsByPeriod = async (period) => {
    return await Analytics.find({ period }).sort({ recordedAt: -1 });
};

// **🔹 Calculate Trend for Analytics**
exports.calculateAnalyticsTrend = async (metricType, period) => {
    const previousData = await Analytics.findOne({ metricType, period })
        .sort({ recordedAt: -1 })
        .skip(1); // Skip the most recent data

    const currentData = await Analytics.findOne({ metricType, period })
        .sort({ recordedAt: -1 })
        .limit(1); // Get the most recent data

    if (!previousData || !currentData) return null; // No data to calculate trend

    const trend = calculateTrend(previousData.value, currentData.value);
    currentData.trend = trend;
    await currentData.save();
    return currentData;
};

// **🔹 Get Analytics Summary**
exports.getAnalyticsSummary = (metricType, value) => {
    return getMetricSummary(metricType, value);
};
