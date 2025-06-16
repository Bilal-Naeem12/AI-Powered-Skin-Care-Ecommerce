module.exports = function getVerificationEmailTemplate(name, link) {
  return `
   <!DOCTYPE html>
  <html>
    <head>
      <style>
        .container {
          max-width: 600px;
          margin: auto;
          padding: 2rem;
          font-family: Arial, sans-serif;
          background-color: #ffffff;
          border: 1px solid #f0f0f0;
          border-radius: 8px;
        }
          a{
          color:white}
        .header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .logo {
          height: 50px;
          margin-bottom: 10px;
        }
        .title {
          color: #FF69B4;
          font-size: 24px;
          font-weight: bold;
        }
        .content {
          color: #444;
          font-size: 16px;
          line-height: 1.6;
        }
        .button {
          display: inline-block;
          margin-top: 1.5rem;
          padding: 12px 24px;
          background-color: #FF69B4;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
        }
        .footer {
          margin-top: 2rem;
          text-align: center;
          font-size: 13px;
          color: #888;
        }
      </style>
    </head>
    <body style="background-color: #f9f9f9; padding: 20px;">
      <div class="container">
        <div class="header">
          <img src="${process.env.CLIENT_URL}/logo.png" alt="SkinCare Pro" class="logo" />
          <div class="title">Verify Your Email</div>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>Thank you for registering at <strong>SkinCare Pro</strong>! Please confirm your email address by clicking the button below:</p>
          <p>This link will expire in <strong>10 minutes</strong>.</p>
          <a
  href="${link}"
  style="
    display: inline-block;
    margin-top: 1.5rem;
    padding: 12px 24px;
    background-color: #FF69B4;
    color: #ffffff;
    text-decoration: none;
    border-radius: 6px;
    font-weight: bold;"
>
  Verify Email
</a>
          <p>If you didn't sign up, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} SkinCare Pro. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `;
};
