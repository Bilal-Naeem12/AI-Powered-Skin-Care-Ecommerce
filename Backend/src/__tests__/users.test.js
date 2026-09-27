jest.mock("../modules/users/userModel", () => ({ findOne: jest.fn(), findById: jest.fn(), findByIdAndUpdate: jest.fn() }));
jest.mock("../modules/notification/notificationService", () => ({ notify: jest.fn() }));
jest.mock("../services/emailService", () => ({ sendEmail: jest.fn() }));
const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../modules/users/userModel");
const controller = require("../modules/users/userController");
const { errorHandler } = require("../middleware/errorHandler");
const { authMiddleware } = require("../middleware/authMiddleware");
const { validateLogin, validateUserRegistration, validateResult } = require("../modules/users/userValidator");
function response() { const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis(), cookie: jest.fn() }; return res; }
beforeEach(() => { jest.clearAllMocks(); process.env.JWT_REFRESH_SECRET = "test-refresh-secret"; });
test("expired refresh token is rejected before database lookup", async () => {
  const token = jwt.sign({ userId: "abc" }, process.env.JWT_REFRESH_SECRET, { expiresIn: -1 });
  const res = response();
  await controller.refreshToken({ cookies: { refreshToken: token } }, res);
  expect(res.status).toHaveBeenCalledWith(401);
  expect(User.findOne).not.toHaveBeenCalled();
});
test("refresh status catches asynchronous database failures", async () => {
  jest.spyOn(console,"error").mockImplementation(() => {});
  User.findOne.mockRejectedValue(new Error("offline"));
  const token = jwt.sign({ userId: "abc" }, process.env.JWT_REFRESH_SECRET);
  const res = response();
  await controller.checkRefreshTokenStatus({ cookies: { refreshToken: token } }, res);
  expect(res.status).toHaveBeenCalledWith(500);
  console.error.mockRestore();
});
test("profile updates cannot set role, password or verification", async () => {
  User.findByIdAndUpdate.mockReturnValue({ select: jest.fn().mockResolvedValue({ first_name: "A" }) });
  await controller.updateUserProfile({ user: { _id: "abc" }, body: { first_name: "A", role: "admin", isVerified: true, password: "plaintext" } }, response());
  expect(User.findByIdAndUpdate.mock.calls[0][1]).toEqual({ first_name: "A" });
});
test("verification requires a real token before querying", async () => {
  const res = response();
  await controller.verifyEmail({ query: {} }, res);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(User.findOne).not.toHaveBeenCalled();
});
test("users cannot modify someone else's walkthrough", async () => {
  const res = response();
  await controller.completeWalkthrough({ user: { _id: "one", role: "user" }, params: { id: "two" } }, res);
  expect(res.status).toHaveBeenCalledWith(403);
});
test("missing authentication returns 401", async () => {
  const res = response();
  await authMiddleware({ cookies: {} }, res, jest.fn());
  expect(res.status).toHaveBeenCalledWith(401);
});
test("deleted accounts cannot authenticate", async () => {
  process.env.JWT_SECRET = "test-secret";
  User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue({ isDeleted: true, isVerified: true }) });
  const res = response(), next = jest.fn();
  await authMiddleware({ cookies: { accessToken: jwt.sign({ userId: "abc" }, process.env.JWT_SECRET) } }, res, next);
  expect(res.status).toHaveBeenCalledWith(403);
  expect(next).not.toHaveBeenCalled();
});
test("login rejects malformed input without invoking controller", async () => {
  const app = express(), handler = jest.fn(); app.use(express.json());
  app.post("/login", validateLogin, validateResult, handler);
  const result = await request(app).post("/login").send({ email: { $ne: null } }).expect(400);
  expect(handler).not.toHaveBeenCalled();
  expect(JSON.stringify(result.body)).not.toContain("$ne");
});
test("registration permits omitted optional demographics", async () => {
  const app = express(); app.use(express.json());
  app.post("/register", validateUserRegistration, validateResult, (req,res) => res.sendStatus(204));
  await request(app).post("/register").send({ first_name: "A", last_name: "B", email: "a@example.com", password: "pass123" }).expect(204);
});
