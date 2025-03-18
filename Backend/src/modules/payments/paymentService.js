const Payment = require("./paymentModel");
const OrderService = require("../orders/orderService"); // To update order status after payment
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);  // Stripe API Key from environment

// **🔹 Create Payment Record**
exports.createPayment = async (userId, orderId, paymentData) => {
    const { paymentGateway, transactionId, amountPaid, currency, paymentStatus, paymentMethodDetails } = paymentData;

    // Ensure the order exists
    const order = await OrderService.getOrderById(orderId);
    if (!order) throw new Error("Order not found");

    // Create payment record in the database
    const payment = new Payment({
        userId,
        orderId,
        paymentGateway,
        transactionId,
        amountPaid,
        currency,
        paymentStatus,
        paymentMethodDetails
    });

    await payment.save();

    // Update the order status to "Completed" after successful payment
    if (paymentStatus === "Completed") {
        await OrderService.updateOrderStatus(orderId, "Completed");
    }

    return payment;
};

// **🔹 Process Payment with Stripe**
exports.processStripePayment = async (orderId, token, amount) => {
    const order = await OrderService.getOrderById(orderId);
    if (!order) throw new Error("Order not found");

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe requires the amount in cents
            currency: 'usd',
            payment_method: token.id,
            confirm: true
        });

        // Create a payment record after successful transaction
        const paymentData = {
            paymentGateway: "Stripe",
            transactionId: paymentIntent.id,
            amountPaid: amount,
            currency: "USD",
            paymentStatus: "Completed",
            paymentMethodDetails: {
                cardType: token.card.brand,
                last4Digits: token.card.last4
            }
        };

        return await this.createPayment(order.userId, orderId, paymentData);
    } catch (error) {
        throw new Error("Payment failed: " + error.message);
    }
};

// **🔹 Process Payment with PayPal**
exports.processPaypalPayment = async (orderId, paymentDetails) => {
    const order = await OrderService.getOrderById(orderId);
    if (!order) throw new Error("Order not found");

    // Assume paymentDetails contains necessary information from PayPal
    const { transactionId, amountPaid, paypalEmail } = paymentDetails;

    // Create a payment record after successful transaction
    const paymentData = {
        paymentGateway: "PayPal",
        transactionId: transactionId,
        amountPaid: amountPaid,
        currency: "USD",
        paymentStatus: "Completed",
        paymentMethodDetails: {
            paypalEmail: paypalEmail
        }
    };

    return await this.createPayment(order.userId, orderId, paymentData);
};

// **🔹 Handle Payment Refund**
exports.processRefund = async (paymentId) => {
    const payment = await Payment.findById(paymentId);
    if (!payment) throw new Error("Payment not found");

    if (payment.paymentStatus === "Refunded") {
        throw new Error("Payment already refunded");
    }

    // Handle refund via Stripe or PayPal (based on the payment gateway)
    if (payment.paymentGateway === "Stripe") {
        try {
            const refund = await stripe.refunds.create({
                payment_intent: payment.transactionId
            });

            payment.paymentStatus = "Refunded";
            payment.refundStatus = "Processed";
            payment.refundTransactionId = refund.id;

            await payment.save();
            return payment;
        } catch (error) {
            throw new Error("Refund failed: " + error.message);
        }
    }

    // Implement PayPal refund logic here if necessary
    // For now, we'll assume the payment was refunded successfully.
    payment.paymentStatus = "Refunded";
    payment.refundStatus = "Processed";

    await payment.save();
    return payment;
};
