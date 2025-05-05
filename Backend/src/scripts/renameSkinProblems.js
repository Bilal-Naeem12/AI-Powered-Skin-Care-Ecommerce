/* scripts/dropSkinProblems.js ------------------------------------ */
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),   // adjust if your .env is elsewhere
});

const mongoose = require("mongoose");
const Product  = require("../modules/products/productModel");

(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌  MONGODB_URI not set in .env");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("✅  Connected to MongoDB");

  const result = await Product.updateMany(
    { skinProblems: { $exists: true } },   // only docs that still have it
    { $unset: { skinProblems: "" } }
  );

  console.log(`🗑️  skinProblems field removed from ${result.modifiedCount} documents`);
  await mongoose.disconnect();
  process.exit(0);
})();
