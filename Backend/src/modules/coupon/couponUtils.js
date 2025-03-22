// **🔹 Validate Coupon Date**
exports.isCouponValid = (coupon) => {
    const currentDate = new Date();
    return coupon.isActive && coupon.startDate <= currentDate && coupon.endDate >= currentDate;
};

// **🔹 Calculate Discount Value**
exports.calculateDiscount = (coupon, orderAmount) => {
    if (!this.isCouponValid(coupon)) {
        return 0;  // If coupon is invalid, no discount
    }

    let discount = 0;

    // Apply percentage discount
    if (coupon.discountType === "Percentage") {
        discount = (coupon.discountValue / 100) * orderAmount;
        if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
            discount = coupon.maxDiscountAmount;
        }
    } else if (coupon.discountType === "Fixed Amount") {
        discount = coupon.discountValue;
    }

    if (orderAmount < coupon.minOrderAmount) {
        discount = 0;  // If the order amount is less than the minimum required, no discount
    }

    return discount;
};

// **🔹 Apply Coupon to Order**
exports.applyCoupon = (coupon, orderAmount) => {
    const discount = this.calculateDiscount(coupon, orderAmount);
    return orderAmount - discount;  // Return the new total after applying the discount
};
