const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const { describeError, errorHandler } = require("../middleware/errorHandler");
test("importing the app does not connect to MongoDB", () => expect(mongoose.connection.readyState).toBe(0));
test("health is live but readiness returns 503 without database", async () => {
  await request(app).get("/health").expect(200);
  await request(app).get("/ready").expect(503);
  await request(app).get("/api/products").expect(503);
});
test("unknown route returns JSON 404", async () => {
  const result = await request(app).get("/unknown-route").expect(404);
  expect(result.body.message).toBe("Route not found.");
});
test("invalid JSON returns 400, not 500", async () => {
  await request(app).post("/api/users/login").set("Content-Type", "application/json").send("{").expect(400);
});
test("disallowed origin returns 403", async () => {
  await request(app).get("/health").set("Origin", "https://untrusted.example").expect(403);
});
test.each([[{ name: "CastError" },400],[{ name: "ValidationError" },400],[{ code: 11000 },409],[{ name: "TokenExpiredError" },401],[{ name: "MongoNetworkError" },503],[{ name: "MulterError", code: "LIMIT_FILE_SIZE" },413]])("classifies %j", (error,status) => expect(describeError(error).status).toBe(status));
test("unexpected details are not exposed", () => expect(describeError(new Error("secret database URL")).message).toBe("Internal server error."));
test("already-sent responses delegate without double sending", () => {
  const next = jest.fn(), error = new Error("late");
  errorHandler(error, {}, { headersSent: true }, next);
  expect(next).toHaveBeenCalledWith(error);
});
