require("dotenv").config();
const { getTransporter } = require("../services/emailService");
(async () => {
  try {
    await getTransporter().verify();
    console.log("SMTP connection and authentication verified. Sender verification/delivery still requires an actual email.");
  } catch (error) {
    console.error("SMTP verification failed", { code: error.code || "CONFIGURATION_ERROR" });
    process.exitCode = 1;
  }
})();
