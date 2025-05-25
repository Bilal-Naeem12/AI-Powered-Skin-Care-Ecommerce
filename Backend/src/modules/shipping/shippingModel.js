const mongoose = require('mongoose');

const ShippingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        postal_code: { type: String, required: true }
    },
 trackingNumber: {
  type: String,
  unique: true,
  sparse: true
}
,
    carrier: {
        type: String,
        enum: ["DHL", "FedEx", "UPS", "USPS", "Other"],
        default: "Other"
    },
    estimatedDeliveryDate: {
        type: Date
    },
    shippingStatus: {
        type: String,
        enum: ["Pending", "Processing", "Out for Delivery", "Delivered", "Cancelled","Returned"],
        default: "Pending"
    },
    deliveryConfirmation: {
        type: Boolean,
        default: false
    },
    isDelayed: {
        type: Boolean,
        default: false
    },
    delayReason: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

/* ── Auto-generate tracking number ─────────────────────────────── */
ShippingSchema.pre("validate", async function (next) {
  if (!this.trackingNumber) {
    const uniqueSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.trackingNumber = `TRK-${Date.now()}-${uniqueSuffix}`;
  }
  next();
});

/* ── Auto-update timestamps ────────────────────────────────────── */
ShippingSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

/* ── Sync shippingStatus with Order.deliveryStatus ─────────────── */
// ShippingSchema.pre("save", async function (next) {
//   if (this.isModified("shippingStatus")) {
//     await mongoose.model("Order").findByIdAndUpdate(
//       this.orderId,
//       { deliveryStatus: this.shippingStatus },
//       { new: false }
//     );
//   }
//   this.updatedAt = Date.now();
//   next();
// });

module.exports = mongoose.model("Shipping", ShippingSchema);
