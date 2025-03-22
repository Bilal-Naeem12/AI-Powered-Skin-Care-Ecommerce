const Shipping = require("./shippingModel");
const { isValidShippingStatus, generateTrackingNumber, updateShippingStatus } = require("./shippingUtils");

// **🔹 Create Shipping Record**
exports.createShippingRecord = async (shippingData) => {
    shippingData.trackingNumber = generateTrackingNumber();  // Generate tracking number automatically
    const newShipping = new Shipping(shippingData);
    await newShipping.save();
    return newShipping;
};

// **🔹 Get Shipping Info by Order ID**
exports.getShippingInfoByOrder = async (orderId) => {
    return await Shipping.findOne({ orderId }).populate("userId orderId");
};

// **🔹 Update Shipping Status**
exports.updateShippingStatus = async (shippingId, newStatus) => {
    const shippingRecord = await Shipping.findById(shippingId);
    if (!shippingRecord) throw new Error("Shipping record not found");

    if (!isValidShippingStatus(newStatus)) throw new Error("Invalid shipping status");

    const updatedStatus = updateShippingStatus(shippingRecord.shippingStatus, newStatus);
    shippingRecord.shippingStatus = updatedStatus;
    await shippingRecord.save();
    return shippingRecord;
};

// **🔹 Mark Delivery as Confirmed**
exports.confirmDelivery = async (shippingId) => {
    const shippingRecord = await Shipping.findById(shippingId);
    if (!shippingRecord) throw new Error("Shipping record not found");

    shippingRecord.deliveryConfirmation = true;
    await shippingRecord.save();
    return shippingRecord;
};

// **🔹 Mark Shipping as Delayed**
exports.markAsDelayed = async (shippingId, reason) => {
    const shippingRecord = await Shipping.findById(shippingId);
    if (!shippingRecord) throw new Error("Shipping record not found");

    shippingRecord.isDelayed = true;
    shippingRecord.delayReason = reason;
    await shippingRecord.save();
    return shippingRecord;
};
