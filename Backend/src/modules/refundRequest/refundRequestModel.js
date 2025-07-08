const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const Analytics = require("../analytics/analyticsModel");

const RefundRequestSchema = new Schema(
  {
    orderId: {
      type: Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
      enum: [
        "Item defective",
        "Wrong item received",
        "Changed my mind",
        "Other",
      ],
    },images: {
  type: [String],
  default: [],
},
    details: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    reviewedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

/**
 * When a RefundRequest is created,
 * bump RefundRate analytics for Day & Month
 */
RefundRequestSchema.post("save", async function (doc, next) {
  try {
    await Promise.all([
      Analytics.bump("RefundRate", 1, "Day", doc.createdAt),
      Analytics.bump("RefundRate", 1, "Month", doc.createdAt),
    ]);
    next();
  } catch (err) {
    console.error("[Analytics bump] RefundRate failed:", err);
    next(err);
  }
});

module.exports = mongoose.model("RefundRequest", RefundRequestSchema);
