const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../../app"); // Import your Express app

describe("Banner Module Tests", () => {
    beforeAll(async () => {
        const mongoURI = process.env.MONGODB_URI_TEST; // Use an in-memory DB or local DB for tests
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Banner.deleteMany({});
    });

    it("should create a new banner", async () => {
        const bannerData = {
            title: "Winter Sale",
            imageUrl: "http://example.com/winter-sale.jpg",
            startDate: new Date(),
            endDate: new Date(),
            bannerType: "Seasonal Offer"
        };

        const response = await request(app)
            .post("/api/banner/create")
            .send(bannerData)
            .expect(201);

        expect(response.body.message).toBe("Banner created successfully");
        expect(response.body.banner.title).toBe("Winter Sale");
    });

    it("should get all active banners", async () => {
        const response = await request(app)
            .get("/api/banner")
            .expect(200);

        expect(response.body.length).toBeGreaterThan(0);
    });

    it("should get banner by ID", async () => {
        const bannerData = {
            title: "Winter Sale",
            imageUrl: "http://example.com/winter-sale.jpg",
            startDate: new Date(),
            endDate: new Date(),
            bannerType: "Seasonal Offer"
        };

        const createdBanner = await request(app)
            .post("/api/banner/create")
            .send(bannerData);

        const bannerId = createdBanner.body.banner._id;

        const response = await request(app)
            .get(`/api/banner/${bannerId}`)
            .expect(200);

        expect(response.body._id).toBe(bannerId);
    });
});
