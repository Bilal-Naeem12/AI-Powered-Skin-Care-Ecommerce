const express = require("express");
const request = require("supertest");
const rateLimit = require("express-rate-limit");
const { configureProxy } = require("../config/proxy");

test("direct connections default to no proxy trust", () => {
  const app = express();
  configureProxy(app, {});
  expect(app.get("trust proxy")).toBe(0);
});

test("Render defaults to one trusted hop", () => {
  const app = express();
  configureProxy(app, { RENDER: "true" });
  expect(app.get("trust proxy")).toBe(1);
});

test("explicit deployment settings override defaults", () => {
  const app = express();
  configureProxy(app, { RENDER: "true", TRUST_PROXY_HOPS: "0" });
  expect(app.get("trust proxy")).toBe(0);
  expect(() => configureProxy(app, { TRUST_PROXY_HOPS: "true" })).toThrow();
});

test("rate limits distinguish forwarded clients and ignore spoofed earlier hops", async () => {
  const app = express();
  configureProxy(app, { TRUST_PROXY_HOPS: "1" });
  app.use(rateLimit({ windowMs: 60000, limit: 1 }));
  app.get("/", (req, res) => res.json({ ip: req.ip }));
  const response = await request(app).get("/").set("X-Forwarded-For", "198.51.100.99, 203.0.113.1").expect(200);
  expect(response.body.ip).toBe("203.0.113.1");
  await request(app).get("/").set("X-Forwarded-For", "198.51.100.88, 203.0.113.1").expect(429);
  await request(app).get("/").set("X-Forwarded-For", "203.0.113.2").expect(200);
});
