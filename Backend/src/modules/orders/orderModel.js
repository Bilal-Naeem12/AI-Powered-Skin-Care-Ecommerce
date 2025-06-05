const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const Shipping = require("../products/productModel");
const Analytics = require("../analytics/analyticsModel");

/* items sub-doc */
const ItemSchema = new Schema(
  {
    productId:      { type: Types.ObjectId, ref: "Product", required: true },
    quantity:       { type: Number, required: true, min: 1 },
    selectedVariant:{ type: String },
    priceAtTimeOfOrder:{ type: Number, required: true }
  },
  { _id: false }
);

const OrderSchema = new Schema(
  { 
   isCancelled:{type: Boolean},
    orderNumber: { type: String, unique: true, required: true, index: true },
    userId:      { type: Types.ObjectId, ref: "User", required: true, index: true },

    cartItems:       [ItemSchema],
    totalAmount: { type: Number, required: true },

    /* pointers -- the ONLY way to reach payment / shipping / invoice */
    paymentId:   { type: Types.ObjectId, ref: "Payment"  },
    shippingId:  { type: Types.ObjectId, ref: "Shipping" },
    invoiceId:   { type: Types.ObjectId, ref: "Invoice"  },

    /* order-level timeline (optional but useful) */
   statusHistory: [
  {
    what: {
      type: String,
     enum: ["Created","Unpaid","Paid","Cancelled","Closed"],

    },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  }
],
    placedAt:  { type: Date, default: Date.now }
  },
  { timestamps: true }
);

/* virtual shortcuts */
OrderSchema.virtual("payment",  { localField: "paymentId",  ref: "Payment",  foreignField: "_id", justOne: true });
OrderSchema.virtual("shipping", { localField: "shippingId", ref: "Shipping", foreignField: "_id", justOne: true });
OrderSchema.virtual("invoice",  { localField: "invoiceId",  ref: "Invoice",  foreignField: "_id", justOne: true });

/* compute total & reserve stock */
OrderSchema.pre("validate", async function (next) {
  try {
    const session = this.$session?.();
    let sum = 0;

    for (const it of this.cartItems) {
      const product = await mongoose.model("Product").findById(it.productId).session(session);
      if (!product || product.isDeleted) throw new Error("Product not found");
      await product.adjustStock(it.quantity, it.selectedVariant, session);
      sum += it.priceAtTimeOfOrder * it.quantity;
    }
    this.totalAmount = sum;
    next();
  } catch (e) { next(e); }
});

OrderSchema.set("toObject", {
  virtuals: true,
  transform: function (doc, ret) {
    if (ret.statusHistory && Array.isArray(ret.statusHistory)) {
      ret.statusHistory.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }
    return ret;
  }
});

OrderSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    if (ret.statusHistory && Array.isArray(ret.statusHistory)) {
      ret.statusHistory.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }
    return ret;
  }
});

OrderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "cartItems.productId",
    select: "name images price category brand",   // keep it lightweight
  });
  next();
});
/* helper to fetch a full order */
OrderSchema.statics.withAll = function (id) {
  return this.findById(id)
    .populate({
      path: "cartItems.productId",
      model: "Product",
      select: "name images price category brand", // optional: restrict fields
    })
    .populate("paymentId")
    .populate("shippingId")
    .populate("invoiceId")
    .populate("userId", "first_name last_name email");
};


OrderSchema.post("save", async function (doc, next) {
  try {
    const latest = doc.statusHistory?.[doc.statusHistory.length - 1]?.what;
    if (latest === "Paid") {
      await Promise.all([
        /* Daily buckets */
        Analytics.bump("TotalOrders", 1,           "Day",   doc.placedAt),
        Analytics.bump("TotalRevenue", doc.totalAmount, "Day", doc.placedAt),
        Analytics.bump("AverageOrderValue", doc.totalAmount, "Day", doc.placedAt),

        /* Monthly buckets (for charts) */
        Analytics.bump("TotalOrders", 1,           "Month", doc.placedAt),
        Analytics.bump("TotalRevenue", doc.totalAmount, "Month", doc.placedAt),
        Analytics.bump("AverageOrderValue", doc.totalAmount, "Month", doc.placedAt)
      ]);
       const ops = [];
      for (const it of doc.cartItems) {
        ops.push(
          // Day
          Analytics.bump(
            "MostPurchasedProduct",
            it.quantity,
            "Day",
            doc.placedAt,
            { associatedEntity: it.productId, entityModel: "Product" }
          ),
          // Month
          Analytics.bump(
            "MostPurchasedProduct",
            it.quantity,
            "Month",
            doc.placedAt,
            { associatedEntity: it.productId, entityModel: "Product" }
          )
        );
      }
      await Promise.all(ops);
    }
    next();
  } catch (err) {
    next(err);
  }
});
module.exports = mongoose.model("Order", OrderSchema);
