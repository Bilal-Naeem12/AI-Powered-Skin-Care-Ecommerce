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
    const adminEmail = process.env.CONTACT_EMAIL || process.env.EMAIL_FROM ;
    const html = getContactMessageTemplate(name, email, phone, message);
    await sendEmail(
      adminEmail,
      "📬 New Contact Message – SkinCare Pro",
      html,
      true
    ).catch(() => console.error("Contact saved, but admin email delivery failed"));

    // ✅ Send Notification to Admin Role
    await notify({
      kind: "CONTACT_MESSAGE",
      title: "New Contact Message Received",
      body: `${name} sent a message.`,
      role: "admin",
      data: { name, email, phone, message },
    });

    res.status(201).json({ message: "Message submitted successfully" });
  } catch (error) {
    console.error("Error submitting contact message:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};






// Admin: get all contact messages
exports.getAllMessages = async (req, res, next) => {
  try {
    const msgs = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .lean();
    res.json(msgs);
  } catch (err) {
    next(err);
  }
};

// Admin: get one message by ID
exports.getMessageById = async (req, res, next) => {
  try {
    const msg = await ContactMessage.findById(req.params.id).lean();
    if (!msg) return res.status(404).json({ message: "Not found" });
    res.json(msg);
  } catch (err) {
    next(err);
  }
};

// Admin: optionally delete a message
exports.deleteMessage = async (req, res, next) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
