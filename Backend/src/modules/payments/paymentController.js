const PaymentService = require("./paymentService");

// **🔹 Create a Payment Record**
exports.createPayment = async (req, res) => {
    try {
        const { orderId, paymentData } = req.body;
        const userId = req.user.userId;  // Get the user from the authenticated session

        const payment = await PaymentService.createPayment(userId, orderId, paymentData);
        res.status(201).json({ message: "Payment created successfully", payment });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// **🔹 Process Stripe Payment**
exports.processStripePayment = async (req, res) => {
    try {
        const { orderId, token, amount } = req.body;
        const payment = await PaymentService.processStripePayment(orderId, token, amount);
        res.status(200).json({ message: "Payment processed successfully", payment });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// **🔹 Process PayPal Payment**
exports.processPaypalPayment = async (req, res) => {
    try {
        const { orderId, paymentDetails } = req.body;
        const payment = await PaymentService.processPaypalPayment(orderId, paymentDetails);
        res.status(200).json({ message: "Payment processed successfully", payment });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// **🔹 Handle Refund**
exports.processRefund = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const payment = await PaymentService.processRefund(paymentId);
        res.status(200).json({ message: "Refund processed successfully", payment });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
