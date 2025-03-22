const DiscountService = require("./discountService");

// **🔹 Create a New Discount**
exports.createDiscount = async (req, res) => {
    try {
        const discountData = req.body;
        const newDiscount = await DiscountService.createDiscount(discountData);
        res.status(201).json({ message: "Discount created successfully", discount: newDiscount });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// **🔹 Get Discount by Code**
exports.getDiscount = async (req, res) => {
    try {
        const { code } = req.params;
        const discount = await DiscountService.getDiscountByCode(code);
        if (!discount) return res.status(404).json({ message: "Discount not found or expired" });

        res.status(200).json(discount);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Get All Active Discounts**
exports.getAllActiveDiscounts = async (req, res) => {
    try {
        const discounts = await DiscountService.getActiveDiscounts();
        res.status(200).json(discounts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Update Discount Status (Activate/Deactivate)**
exports.updateDiscountStatus = async (req, res) => {
    try {
        const { discountId, status } = req.body;
        const updatedDiscount = await DiscountService.updateDiscountStatus(discountId, status);
        res.status(200).json({ message: "Discount status updated", discount: updatedDiscount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Apply Discount to Order**
exports.applyDiscountToOrder = async (req, res) => {
    try {
        const { discountCode, orderAmount } = req.body;
        const totalAfterDiscount = await DiscountService.applyDiscountToOrder(discountCode, orderAmount);
        res.status(200).json({ totalAmount: totalAfterDiscount });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
