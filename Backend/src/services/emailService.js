const nodemailer = require("nodemailer");
const createError = require("http-errors");
let transporter;
function getTransporter() {
  if (transporter) return transporter;
  const port = Number(process.env.SMTP_PORT || 587);
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.EMAIL_FROM || ![587,465,2525].includes(port)) {
    throw createError(503, "Email service is not configured.");
  }
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp-relay.brevo.com", port,
    secure: port === 465, requireTLS: port !== 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 20000,
    tls: { minVersion: "TLSv1.2" },
  });
  return transporter;
}
async function sendEmail(to, subject, content, isHtml = false) {
  try {
    const result = await getTransporter().sendMail({
      from: { name: process.env.EMAIL_FROM_NAME || "SkinCare Pro", address: process.env.EMAIL_FROM },
      to, subject, ...(isHtml ? { html: content } : { text: content }),
    });
    if (!result.accepted?.length || result.rejected?.length) throw new Error("Recipient rejected");
    return true;
  } catch (error) {
    console.error("Email delivery failed", { code: error.code || "EMAIL_UNAVAILABLE" });
    throw createError(503, "Email could not be sent. Please try again later.");
  }
}
module.exports = { sendEmail, getTransporter };
