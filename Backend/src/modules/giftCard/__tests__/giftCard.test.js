const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../../app"); // Import your Express app

describe("GiftCard Module Tests", () => {
    beforeAll(async () => {
        const mongoURI = process.env.MONGODB_URI_TEST; // Use an in-memory DB or local DB for tests
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await GiftCard.deleteMany({});
    });

    it("should create a new gift card", async () => {
        const giftCardData = {
            senderId: "605c72ef1532073f74fdb945", // Replace with actual sender ID
            recipientId: "605c72ef1532073f74fdb948", // Replace with actual recipient ID
            amount: 100,
            balance: 100,
            expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        };

        const response = await request(app)
            .post("/api/giftCard/create")
            .send(giftCardData)
            .expect(201);

        expect(response.body.message).toBe("Gift card created successfully");
        expect(response.body.giftCard.code).toBeDefined();
    });

    it("should redeem a gift card", async () => {
        const giftCardData = {
            senderId: "605c72ef1532073f74fdb945",
            recipientId: "605c72ef1532073f74fdb948",
            amount: 100,
            balance: 100,
            expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        };

        const createdGiftCard = await request(app)
            .post("/api/giftCard/create")
            .send(giftCardData);

        const giftCardId = createdGiftCard.body.giftCard._id;
        const orderId = "605c72ef1532073f74fdb950"; // Replace with actual order ID

        const redeemResponse = await request(app)
            .post("/api/giftCard/redeem")
            .send({ giftCardId, amount: 50, orderId })
            .expect(200);

        expect(redeemResponse.body.message).toBe("Gift card redeemed successfully");
        expect(redeemResponse.body.giftCard.balance).toBe(50);
    });
});
