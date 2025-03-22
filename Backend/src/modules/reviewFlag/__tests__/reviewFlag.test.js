const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../../app"); // Import your Express app

describe("ReviewFlag Module Tests", () => {
    beforeAll(async () => {
        const mongoURI = process.env.MONGODB_URI_TEST; // Use an in-memory DB or local DB for tests
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await ReviewFlag.deleteMany({});
    });

    it("should create a new review flag", async () => {
        const flagData = {
            reviewId: "605c72ef1532073f74fdb945", // Replace with actual review ID
            flaggedBy: "605c72ef1532073f74fdb946", // Replace with actual user ID
            reason: "Inappropriate Language",
            additionalComment: "This review contains offensive language"
        };

        const response = await request(app)
            .post("/api/reviewFlag/create")
            .send(flagData)
            .expect(201);

        expect(response.body.message).toBe("Review flagged successfully");
    });

    it("should get all flagged reviews", async () => {
        const response = await request(app)
            .get("/api/reviewFlag")
            .expect(200);

        expect(response.body.length).toBeGreaterThan(0);
    });

    it("should get a flagged review by ID", async () => {
        const flagData = {
            reviewId: "605c72ef1532073f74fdb945",
            flaggedBy: "605c72ef1532073f74fdb946",
            reason: "Inappropriate Language",
            additionalComment: "This review contains offensive language"
        };

        const createdFlag = await request(app)
            .post("/api/reviewFlag/create")
            .send(flagData);

        const flagId = createdFlag.body.flag._id;

        const response = await request(app)
            .get(`/api/reviewFlag/${flagId}`)
            .expect(200);

        expect(response.body._id).toBe(flagId);
    });

    it("should resolve a flagged review", async () => {
        const flagData = {
            reviewId: "605c72ef1532073f74fdb945",
            flaggedBy: "605c72ef1532073f74fdb946",
            reason: "Inappropriate Language",
            additionalComment: "This review contains offensive language"
        };

        const createdFlag = await request(app)
            .post("/api/reviewFlag/create")
            .send(flagData);

        const flagId = createdFlag.body.flag._id;
        const resolutionData = { resolution: "Deleted Review", reviewedBy: "605c72ef1532073f74fdb947" };

        const response = await request(app)
            .put(`/api/reviewFlag/${flagId}/resolve`)
            .send(resolutionData)
            .expect(200);

        expect(response.body.message).toBe("Review flag resolved successfully");
        expect(response.body.flag.resolution).toBe("Deleted Review");
    });
});
