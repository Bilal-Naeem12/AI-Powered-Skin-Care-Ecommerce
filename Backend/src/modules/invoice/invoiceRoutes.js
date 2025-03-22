const express = require("express");
const {
    createInvoice,
    getInvoiceByOrderId,
    updateInvoiceStatus,
    getAllInvoices
} = require("./invoiceController");

const router = express.Router();

// **🔹 Route to Create a New Invoice**
router.post("/create", createInvoice);

// **🔹 Route to Get Invoice by Order ID**
router.get("/:orderId", getInvoiceByOrderId);

// **🔹 Route to Update Invoice Status (Paid, Unpaid, Refunded)**
router.put("/status", updateInvoiceStatus);

// **🔹 Route to Get All Invoices**
router.get("/", getAllInvoices);

module.exports = router;
