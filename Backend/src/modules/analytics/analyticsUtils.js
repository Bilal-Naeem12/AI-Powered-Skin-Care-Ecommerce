// **🔹 Format Analytics Period**
// Utility function to format the time period for analytics (Daily, Weekly, etc.)
exports.formatAnalyticsPeriod = (period) => {
    switch (period) {
        case "Daily":
            return "24 hours";
        case "Weekly":
            return "7 days";
        case "Monthly":
            return "30 days";
        case "Yearly":
            return "365 days";
        default:
            return "Unknown period";
    }
};

// **🔹 Generate Analytics Trend**
// Utility function to analyze trends from previous values and current values
exports.calculateTrend = (previousValue, currentValue) => {
    if (currentValue > previousValue) return "Increase";
    if (currentValue < previousValue) return "Decrease";
    return "Stable";
};

// **🔹 Get Metrics Summary**
// Utility function to return a summary of the metric for display or API responses
exports.getMetricSummary = (metricType, value) => {
    let message = '';
    switch (metricType) {
        case "TotalSales":
            message = `The total sales for the given period is $${value}.`;
            break;
        case "TotalRevenue":
            message = `Total revenue generated is $${value}.`;
            break;
        case "NewUsers":
            message = `We acquired ${value} new users.`;
            break;
        case "ActiveUsers":
            message = `Currently, there are ${value} active users.`;
            break;
        default:
            message = `Metric value is ${value}.`;
    }
    return message;
};
