const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app"); // Import your Express app

describe("AuditLog Module Tests", () => {
    beforeAll(async () => {
        const mongoURI = "mongodb://localhost:27017/test"; // Use an in-memory DB or local DB for tests
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await AuditLog.deleteMany({});
    });

    it("should create an audit log", async () => {
        const auditLogData = {
            adminId: "605c72ef1532073f74fdb945", // Replace with actual admin ID
            actionType: "User Management",
            targetModel: "User",
            targetId: "605c72ef1532073f74fdb948", // Replace with actual target model ID
            actionDescription: "Created a new user",
            ipAddress: "127.0.0.1",
            deviceInfo: "Mozilla/5.0",
            role: "Admin"
        };

        const response = await request(app)
            .post("/api/auditLog/create")
            .send(auditLogData)
            .expect(201);

        expect(response.body.message).toBe("Audit log created successfully");
        expect(response.body.log.actionType).toBe("User Management");
    });

    it("should get all audit logs", async () => {
        const response = await request(app)
            .get("/api/auditLog")
            .expect(200);

        expect(response.body.length).toBeGreaterThan(0);
    });

    it("should get audit log by ID", async () => {
        const auditLogData = {
            adminId: "605c72ef1532073f74fdb945", // Replace with actual admin ID
            actionType: "User Management",
            targetModel: "User",
            targetId: "605c72ef1532073f74fdb948", // Replace with actual target model ID
            actionDescription: "Created a new user",
            ipAddress: "127.0.0.1",
            deviceInfo: "Mozilla/5.0",
            role: "Admin"
        };

        const createdLog = await request(app)
            .post("/api/auditLog/create")
            .send(auditLogData);

        const logId = createdLog.body.log._id;

        const response = await request(app)
            .get(`/api/auditLog/${logId}`)
            .expect(200);

        expect(response.body._id).toBe(logId);
    });
});
