const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const Shipping = require("../products/productModel");
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




module.exports = mongoose.model("Order", OrderSchema);
