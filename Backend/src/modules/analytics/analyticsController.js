const AnalyticsService = require("./analyticsService");

// **🔹 Create Analytics**
exports.createAnalytics = async (req, res) => {
    try {
        const metricData = req.body;
        const newAnalytics = await AnalyticsService.createAnalytics(metricData);
        res.status(201).json({ message: "Analytics data created successfully", analytics: newAnalytics });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// **🔹 Get Analytics by Period**
exports.getAnalyticsByPeriod = async (req, res) => {
    try {
        const { period } = req.params;
        const analytics = await AnalyticsService.getAnalyticsByPeriod(period);
        if (!analytics) {
            return res.status(404).json({ message: "Analytics data not found" });
        }
        res.status(200).json(analytics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Calculate Analytics Trend**
exports.calculateAnalyticsTrend = async (req, res) => {
    try {
        const { metricType, period } = req.params;
        const analyticsData = await AnalyticsService.calculateAnalyticsTrend(metricType, period);
        if (!analyticsData) {
            return res.status(404).json({ message: "Trend data not found" });
        }
        res.status(200).json({ message: "Trend calculated successfully", analytics: analyticsData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
