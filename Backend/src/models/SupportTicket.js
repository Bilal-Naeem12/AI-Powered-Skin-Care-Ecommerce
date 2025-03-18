const mongoose = require('mongoose');

const SupportTicketSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    ticketNumber: {
        type: String,
        unique: true,
        required: true
    },
    category: {
        type: String,
        enum: [
            "Order Issue", "Payment Problem", "Product Inquiry",
            "Refund Request", "Technical Issue", "Account Issue", "Other"
        ],
        required: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High", "Urgent"],
        default: "Medium"
    },
    status: {
        type: String,
        enum: ["Open", "In Progress", "Resolved", "Closed"],
        default: "Open"
    },
    assignedAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        default: null // Assigned only when admin picks the ticket
    },
    conversation: [
        {
            senderId: { type: mongoose.Schema.Types.ObjectId, refPath: "senderModel" },
            senderModel: { type: String, enum: ["User", "Admin"] },
            message: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ],
    attachments: {
        type: [String], // Stores URLs of attached screenshots, files
        default: []
    },
    resolutionNotes: {
        type: String,
        default: null
    },
    closedByAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// **Middleware: Auto-update timestamps on save**
SupportTicketSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("SupportTicket", SupportTicketSchema);
