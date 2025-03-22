// **🔹 Check if notification is related to a specific model**
exports.getRelatedModel = (type) => {
    switch (type) {
        case "Order":
            return "Order";
        case "Payment":
            return "Payment";
        case "Shipping":
            return "Shipping";
        case "Review":
            return "Review";
        default:
            return null;
    }
};

// **🔹 Create a formatted message for the notification**
exports.formatNotificationMessage = (type, relatedModel, relatedId) => {
    switch (type) {
        case "Order":
            return `Your order #${relatedId} has been placed successfully.`;
        case "Payment":
            return `Your payment for order #${relatedId} has been received.`;
        case "Shipping":
            return `Your order #${relatedId} has been shipped.`;
        case "Review":
            return `Your review for product #${relatedId} has been approved.`;
        case "Promotion":
            return `Check out our new promotion!`;
        case "System":
            return `There is an important update in the system.`;
        default:
            return "You have a new notification.";
    }
};
