const InvoiceService = require("./invoiceService");

// **🔹 Create a New Invoice**
exports.createInvoice = async (req, res) => {
    try {
        const invoiceData = req.body;
        const newInvoice = await InvoiceService.createInvoice(invoiceData);
        res.status(201).json({ message: "Invoice created successfully", invoice: newInvoice });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// **🔹 Get Invoice by Order ID**
exports.getInvoiceByOrderId = async (req, res) => {
    try {
        const { orderId } = req.params;
        const invoice = await InvoiceService.getInvoiceByOrderId(orderId);
        if (!invoice) return res.status(404).json({ message: "Invoice not found" });

        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Update Invoice Status**
exports.updateInvoiceStatus = async (req, res) => {
    try {
        const { invoiceId, status } = req.body;
        const updatedInvoice = await InvoiceService.updateInvoiceStatus(invoiceId, status);
        res.status(200).json({ message: "Invoice status updated", invoice: updatedInvoice });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// **🔹 Get All Invoices**
exports.getAllInvoices = async (req, res) => {
    try {
        const invoices = await InvoiceService.getAllInvoices();
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
