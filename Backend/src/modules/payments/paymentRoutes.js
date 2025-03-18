const express = require("express");
const {
    createPayment,
    processStripePayment,
    processPaypalPayment,
    processRefund
} = require("./paymentController");
const { validateCreatePayment, validateRefundStatus, validateResult } = require("./paymentValidator");

const router = express.Router();

// **🔹 Route to Create a Payment**
router.post("/create", validateCreatePayment, validateResult, createPayment);  // Create a new payment

// **🔹 Route to Process Stripe Payment**
router.post("/stripe", processStripePayment);  // Process Stripe payment

// **🔹 Route to Process PayPal Payment**
router.post("/paypal", processPaypalPayment);  // Process PayPal payment

// **🔹 Route to Process Refund for a Payment**
router.put("/:id/refund", validateRefundStatus, validateResult, processRefund);  // Process refund for payment

module.exports = router;
