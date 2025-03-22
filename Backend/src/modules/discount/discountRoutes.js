const express = require("express");
const {
    createDiscount,
    getDiscount,
    getAllActiveDiscounts,
    updateDiscountStatus,
    applyDiscountToOrder
} = require("./discountController");

const router = express.Router();

// **🔹 Route to Create a New Discount**
router.post("/create", createDiscount);

// **🔹 Route to Get Discount by Code**
router.get("/:code", getDiscount);

// **🔹 Route to Get All Active Discounts**
router.get("/", getAllActiveDiscounts);

// **🔹 Route to Update Discount Status**
router.put("/status", updateDiscountStatus);

// **🔹 Route to Apply Discount to Order**
router.post("/apply", applyDiscountToOrder);

module.exports = router;
