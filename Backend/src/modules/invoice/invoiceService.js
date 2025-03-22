const Invoice = require("./invoiceModel");
const { generateInvoiceNumber, calculateGrandTotal } = require("./invoiceUtils");

// **🔹 Create Invoice**
exports.createInvoice = async (invoiceData) => {
    // Generate Invoice Number
    invoiceData.invoiceNumber = generateInvoiceNumber();
    
    // Calculate Grand Total
    invoiceData.grandTotal = calculateGrandTotal(invoiceData.totalAmount, invoiceData.taxAmount, invoiceData.discountAmount);

    const newInvoice = new Invoice(invoiceData);
    await newInvoice.save();
    return newInvoice;
};

// **🔹 Get Invoice by Order ID**
exports.getInvoiceByOrderId = async (orderId) => {
    return await Invoice.findOne({ orderId }).populate("userId orderId paymentId");
};

// **🔹 Update Invoice Status**
exports.updateInvoiceStatus = async (invoiceId, status) => {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) throw new Error("Invoice not found");

    invoice.status = status;
    await invoice.save();
    return invoice;
};

// **🔹 Get All Invoices**
exports.getAllInvoices = async () => {
    return await Invoice.find();
};
