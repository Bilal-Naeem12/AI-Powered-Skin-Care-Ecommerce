const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, content, isHtml = false) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"SkinCare Pro" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    ...(isHtml ? { html: content } : { text: content }),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

module.exports = { sendEmail };
