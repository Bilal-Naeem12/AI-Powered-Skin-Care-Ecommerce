// **🔹 Validate Shipping Status**
exports.isValidShippingStatus = (status) => {
    const validStatuses = ["Pending", "Processing", "Shipped", "Out for Delivery", "Delivered", "Returned"];
    return validStatuses.includes(status);
};

// **🔹 Generate Tracking Number**
exports.generateTrackingNumber = () => {
    return `TRACK-${Math.floor(Math.random() * 1000000)}`;
};

// **🔹 Update Delivery Status**
exports.updateShippingStatus = (currentStatus, newStatus) => {
    if (currentStatus === "Delivered" || currentStatus === "Returned") {
        return "Cannot update after delivery/return";
    }
    return newStatus;
};
