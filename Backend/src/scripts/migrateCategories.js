/* src/migrateCategories.js -------------------------------------------------- */
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),   // <— root‑level .env
});

const mongoose = require("mongoose");
const Product  = require("./modules/products/productModel");
const Category = require("./modules/category/categoryModel");

(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌  MONGODB_URI not set.  Check your .env");
    process.exit(1);
  }

  console.log("⏳  Connecting to MongoDB…");
  await mongoose.connect(uri);
  console.log("✅  Connected");

  try {
    /* 1️⃣  make sure Category docs exist */
    const names = await Product.distinct("category");
    console.log(`→  found ${names.length} distinct category names`);

    const nameToId = {};
    for (const n of names) {
      const doc = await Category.findOneAndUpdate(
        { name: n },
        {},
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      nameToId[n] = doc._id;
    }
    console.log("✅  Category collection ready");

    /* 2️⃣  update Products lacking categoryId */
    const cursor = Product.find({ categoryId: { $exists: false } })
                          .select("_id category")
                          .lean()
                          .cursor();

    const bulk  = Product.collection.initializeUnorderedBulkOp();
    let patched = 0;

    for await (const p of cursor) {
      bulk.find({ _id: p._id })
          .updateOne({ $set: { categoryId: nameToId[p.category] } });
      patched++;
      if (patched % 500 === 0) console.log(`  → queued ${patched}`);
    }

    if (patched) {
      console.log(`⏳  Executing bulk update (${patched}) …`);
      await bulk.execute();
    }

    console.log("✅  Migration complete. Products patched:", patched);
  } catch (err) {
    console.error("❌  Migration failed:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
