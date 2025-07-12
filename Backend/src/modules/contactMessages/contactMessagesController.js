const ContactMessage = require("./contactMessagesModel");
const { sendEmail } = require("../../services/emailService");
const { notify } = require("../notification/notificationService");
const getContactMessageTemplate = require("../../templates/contactMessageTemplate");

exports.submitContactMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const contact = new ContactMessage({ name, email, phone, message });
    await contact.save();

    // ✅ Send Email to Admin
    const adminEmail = process.env.EMAIL_USER ;
    const html = getContactMessageTemplate(name, email, phone, message);
    await sendEmail(
      adminEmail,
      "📬 New Contact Message – SkinCare Pro",
      html,
      true
    );

    // ✅ Send Notification to Admin Role
    await notify({
      kind: "CONTACT_MESSAGE",
      title: "New Contact Message Received",
      body: `${name} sent a message.`,
      image: `${process.env.CLIENT_URL}/logo.png`,
      role: "admin",
      data: { name, email, phone, message },
    });

    res.status(201).json({ message: "Message submitted successfully" });
  } catch (error) {
    console.error("Error submitting contact message:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};
