const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        unique: true,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        required: true
    },
    invoiceDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date
    },
    totalAmount: {
        type: Number,
        required: true
    },
    taxAmount: {
        type: Number,
        default: 0
    },
    discountAmount: {
        type: Number,
        default: 0
    },
    grandTotal: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ["Credit Card", "Debit Card", "PayPal", "Google Pay", "Apple Pay", "Bank Transfer"],
        required: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    invoiceFileUrl: {
        type: String,
        default: null // Stores the downloadable PDF URL
    },
    status: {
        type: String,
        enum: ["Paid", "Unpaid", "Refunded"],
        default: "Paid"
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
InvoiceSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Invoice", InvoiceSchema);
