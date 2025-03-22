// **🔹 Validate Discount Code Format**
exports.isValidDiscountCode = (code) => {
    return /^[A-Z0-9]{6,10}$/.test(code);  // Simple validation for code length and uppercase
};

// **🔹 Calculate Discount Value**
exports.calculateDiscount = (discount, orderAmount) => {
    let discountAmount = 0;
    if (discount.discountType === "Percentage") {
        discountAmount = (discount.discountValue / 100) * orderAmount;
        if (discount.maxDiscountAmount && discountAmount > discount.maxDiscountAmount) {
            discountAmount = discount.maxDiscountAmount;
        }
    } else if (discount.discountType === "Fixed Amount") {
        discountAmount = discount.discountValue;
    }

    if (orderAmount < discount.minOrderAmount) {
        discountAmount = 0;  // No discount if order amount is less than minimum
    }

    return discountAmount;
};

// **🔹 Apply Discount to Order**
exports.applyDiscountToOrder = (discount, orderAmount) => {
    const discountAmount = this.calculateDiscount(discount, orderAmount);
    return orderAmount - discountAmount;  // Return the new total after applying the discount
};
