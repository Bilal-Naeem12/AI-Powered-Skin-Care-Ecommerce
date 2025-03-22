const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../../app"); // Import your Express app

describe("Notification Module Tests", () => {
    beforeAll(async () => {
        const mongoURI = process.env.MONGODB_URI_TEST; // Use an in-memory DB or local DB for tests
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Notification.deleteMany({});
    });

    it("should create a new notification", async () => {
        const notificationData = {
            userId: "605c72ef1532073f74fdb945", // Replace with actual user ID
            type: "Order",
            relatedId: "605c72ef1532073f74fdb946", // Replace with actual related ID
            relatedModel: "Order",
            message: "Your order has been placed."
        };

        const response = await request(app)
            .post("/api/notification/create")
            .send(notificationData)
            .expect(201);

        expect(response.body.message).toBe("Notification created successfully");
        expect(response.body.notification.type).toBe("Order");
    });

    it("should get all notifications for a user", async () => {
        const response = await request(app)
            .get("/api/notification/605c72ef1532073f74fdb945") // Replace with actual user ID
            .expect(200);

        expect(response.body.length).toBeGreaterThan(0);
    });

    it("should mark a notification as read", async () => {
        const notificationData = {
            userId: "605c72ef1532073f74fdb945",
            type: "Order",
            relatedId: "605c72ef1532073f74fdb946",
            relatedModel: "Order",
            message: "Your order has been placed."
        };

        const createdNotification = await request(app)
            .post("/api/notification/create")
            .send(notificationData);

        const notificationId = createdNotification.body.notification._id;

        const response = await request(app)
            .put(`/api/notification/${notificationId}/read`)
            .expect(200);

        expect(response.body.message).toBe("Notification marked as read");
    });

    it("should delete a notification", async () => {
        const notificationData = {
            userId: "605c72ef1532073f74fdb945",
            type: "Order",
            relatedId: "605c72ef1532073f74fdb946",
            relatedModel: "Order",
            message: "Your order has been placed."
        };

        const createdNotification = await request(app)
            .post("/api/notification/create")
            .send(notificationData);

        const notificationId = createdNotification.body.notification._id;

        const response = await request(app)
            .delete(`/api/notification/${notificationId}`)
            .expect(200);

        expect(response.body.message).toBe("Notification deleted");
    });
});
