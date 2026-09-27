jest.mock("mongoose", () => ({ connect: jest.fn().mockResolvedValue(undefined) }));
jest.mock("node:dns", () => ({ setServers: jest.fn() }));
const mongoose = require("mongoose");
const dns = require("node:dns");
const { connectDb } = require("../config/database");

beforeEach(() => {
  jest.clearAllMocks();
  process.env.MONGODB_URI = "mongodb://localhost/test";
  delete process.env.MONGODB_DNS_SERVERS;
});

test("keeps default DNS when no override is configured", async () => {
  await connectDb();
  expect(dns.setServers).not.toHaveBeenCalled();
  expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
});

test("applies configured resolvers before connecting", async () => {
  process.env.MONGODB_DNS_SERVERS = " 192.168.1.1, 192.168.1.2 ";
  await connectDb();
  expect(dns.setServers).toHaveBeenCalledWith(["192.168.1.1", "192.168.1.2"]);
  expect(dns.setServers.mock.invocationCallOrder[0]).toBeLessThan(mongoose.connect.mock.invocationCallOrder[0]);
});

test("missing URI fails before connecting", async () => {
  delete process.env.MONGODB_URI;
  await expect(connectDb()).rejects.toThrow("MONGODB_URI is required");
  expect(mongoose.connect).not.toHaveBeenCalled();
});
