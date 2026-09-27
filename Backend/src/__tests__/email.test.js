jest.mock("nodemailer", () => ({ createTransport: jest.fn() }));
const nodemailer = require("nodemailer");
let service, sendMail;
beforeEach(() => {
  jest.resetModules();
  process.env.SMTP_USER = "test@smtp-brevo.com";
  process.env.SMTP_PASS = "test-key";
  process.env.EMAIL_FROM = "sender@example.com";
  process.env.SMTP_PORT = "587";
  sendMail = jest.fn().mockResolvedValue({ accepted: ["recipient@example.com"], rejected: [] });
  require("nodemailer").createTransport.mockReturnValue({ sendMail });
  service = require("../services/emailService");
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());
test("uses Brevo STARTTLS and separates sender from SMTP login", async () => {
  await service.sendEmail("recipient@example.com", "Subject", "Body");
  expect(require("nodemailer").createTransport).toHaveBeenCalledWith(expect.objectContaining({ host: "smtp-relay.brevo.com", port: 587, secure: false, requireTLS: true }));
  expect(sendMail).toHaveBeenCalledWith(expect.objectContaining({ from: { name: "SkinCare Pro", address: "sender@example.com" }, text: "Body" }));
});
test("reuses transport and sends HTML", async () => {
  await service.sendEmail("recipient@example.com", "Subject", "<p>Body</p>", true);
  await service.sendEmail("recipient@example.com", "Subject", "Body");
  expect(require("nodemailer").createTransport).toHaveBeenCalledTimes(1);
  expect(sendMail.mock.calls[0][0].html).toBe("<p>Body</p>");
});
test("port 465 uses implicit TLS", () => {
  process.env.SMTP_PORT = "465";
  service.getTransporter();
  expect(require("nodemailer").createTransport).toHaveBeenCalledWith(expect.objectContaining({ secure: true, port: 465 }));
});
test("port 2525 uses required STARTTLS", () => {
  process.env.SMTP_PORT = "2525";
  service.getTransporter();
  expect(require("nodemailer").createTransport).toHaveBeenCalledWith(expect.objectContaining({ secure: false, requireTLS: true, port: 2525 }));
});
test("missing credentials fail without attempting delivery", async () => {
  delete process.env.SMTP_PASS;
  await expect(service.sendEmail("recipient@example.com", "Subject", "Body")).rejects.toMatchObject({ status: 503 });
  expect(sendMail).not.toHaveBeenCalled();
});
test("delivery errors are not reported as success and secrets stay private", async () => {
  sendMail.mockRejectedValue(new Error("private SMTP response"));
  await expect(service.sendEmail("recipient@example.com", "Subject", "Body")).rejects.toMatchObject({ status: 503 });
  expect(JSON.stringify(console.error.mock.calls)).not.toContain("private SMTP response");
});
test("recipient rejection is a delivery failure", async () => {
  sendMail.mockResolvedValue({ accepted: [], rejected: ["recipient@example.com"] });
  await expect(service.sendEmail("recipient@example.com", "Subject", "Body")).rejects.toMatchObject({ status: 503 });
});
