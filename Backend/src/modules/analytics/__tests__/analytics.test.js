const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../../app"); // Import your Express app
const Analytics = require("../../../models/Analytics"); // Import the Analytics model

describe("Analytics Module Tests", () => {
    beforeAll(async () => {
        const mongoURI = process.env.MONGODB_URI_TEST || "mongodb://localhost:27017/test"; // Use an in-memory DB or local DB for tests
        try {
            await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
            console.log("✅ MongoDB connected for testing");
        } catch (err) {
            console.error("❌ Error connecting to MongoDB:", err);
            process.exit(1);
        }
    });

    afterAll(async () => {
        try {
            await mongoose.connection.dropDatabase(); // Drop the test database after all tests
            await mongoose.connection.close(); // Close the database connection
            console.log("✅ MongoDB connection closed");
        } catch (err) {
            console.error("❌ Error during cleanup:", err);
        }
    });

    beforeEach(async () => {
        try {
            await Analytics.deleteMany({}); // Clear any existing analytics before each test
        } catch (err) {
            console.error("❌ Error clearing analytics data:", err);
        }
    });

    it("should create new analytics data", async () => {
        const analyticsData = {
            metricType: "TotalSales",
            period: "Monthly",
            value: 10000,
        };

        try {
            const response = await request(app)
                .post("/api/analytics/create")
                .send(analyticsData)
                .expect(201);

            expect(response.body.message).toBe("Analytics data created successfully");
            expect(response.body.analytics.value).toBe(10000);
        } catch (err) {
            console.error("❌ Error during 'create analytics' test:", err);
            throw err;
        }
    });

    it("should get analytics data by period", async () => {
        const analyticsData = {
            metricType: "TotalSales",
            period: "Monthly",
            value: 10000,
        };

        try {
            // Create sample analytics data first
            await request(app)
                .post("/api/analytics/create")
                .send(analyticsData);

            // Get the data by period (Monthly)
            const response = await request(app)
                .get("/api/analytics/Monthly")
                .expect(200);

            expect(response.body.length).toBeGreaterThan(0);
        } catch (err) {
            console.error("❌ Error during 'get analytics by period' test:", err);
            throw err;
        }
    });

    it("should calculate the trend for analytics data", async () => {
        const analyticsData = {
            metricType: "TotalSales",
            period: "Monthly",
            value: 20000,
        };

        try {
            // Create sample analytics data first
            await request(app)
                .post("/api/analytics/create")
                .send(analyticsData);

            // Get the trend data for the specified metric and period
            const response = await request(app)
                .get("/api/analytics/TotalSales/Monthly/trend")
                .expect(200);

            expect(response.body.message).toBe("Trend calculated successfully");
        } catch (err) {
            console.error("❌ Error during 'calculate trend' test:", err);
            throw err;
        }
    });

    // Error handling in case of invalid data (example of 400 Bad Request)
    it("should return error for invalid analytics data", async () => {
        const invalidData = {
            metricType: "", // Invalid data: metricType is required
            period: "InvalidPeriod", // Invalid period value
            value: -500, // Invalid value
        };

        try {
            const response = await request(app)
                .post("/api/analytics/create")
                .send(invalidData)
                .expect(400);

            expect(response.body.message).toBe("Validation Error");
            expect(response.body.errors).toBeDefined();
        } catch (err) {
            console.error("❌ Error during 'invalid analytics data' test:", err);
            throw err;
        }
    });
});
