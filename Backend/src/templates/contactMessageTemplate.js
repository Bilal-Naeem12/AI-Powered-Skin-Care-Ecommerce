// File: templates/contactMessageTemplate.js

module.exports = function getContactMessageTemplate(name, email, phone, message) {
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
        .info {
          margin-top: 1rem;
          background: #f9f9f9;
          padding: 1rem;
          border-left: 4px solid #FF69B4;
          border-radius: 5px;
        }
        .footer {
          margin-top: 2rem;
          text-align: center;
          font-size: 13px;
          color: #888;
        }
      </style>
    </head>
    <body style="background-color: #f4f4f4; padding: 20px;">
      <div class="container">
        <div class="header">
          <img src="${process.env.CLIENT_URL}/logo.png" alt="SkinCare Pro" class="logo" />
          <div class="title">New Contact Message Received</div>
        </div>
        <div class="content">
          <p><strong>${name}</strong> has submitted a contact message.</p>
          <div class="info">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Message:</strong><br/>${message}</p>
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} SkinCare Pro. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `;
}
