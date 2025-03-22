// **🔹 Generate Invoice Number (e.g., INV-2023-001)**
exports.generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const randomId = Math.floor(Math.random() * 1000);
    return `INV-${year}-${String(randomId).padStart(3, '0')}`;
};

// **🔹 Calculate Grand Total**
exports.calculateGrandTotal = (totalAmount, taxAmount, discountAmount) => {
    return totalAmount + taxAmount - discountAmount;
};
