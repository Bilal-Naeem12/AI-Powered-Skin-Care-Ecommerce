/**
 * Rename field:
 *   categoryId (ObjectId)  ➜  category
 *   and drop the old string "category" field.
 *
 *  ▸  Safe to re‑run; it skips docs already migrated.
 *  ▸  Requires MONGODB_URI in the project‑root .env
 */

const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),   // adjust if .env elsewhere
});

const mongoose = require("mongoose");
const Category = require("../modules/category/categoryModel"); // <— add this
const Product  = require("../modules/products/productModel");
(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌  MONGODB_URI missing in .env");
    process.exit(1);
  }
  await mongoose.connect(uri);
  console.log("✅  Connected to Mongo");

  /* docs that still:
     • have categoryId ObjectId
     • and *string* category OR no category field at all        */
  const filter = {
    categoryId: { $type: "objectId" },
    $or: [
      { category: { $type: "string" } },
      { category: { $exists: false } },
    ],
  };

  const cursor = Product.find(filter)
                        .select("_id categoryId")
                        .lean()
                        .cursor();

  const bulk   = Product.collection.initializeUnorderedBulkOp();
  let count    = 0;

  for await (const doc of cursor) {
    bulk.find({ _id: doc._id })
        .updateOne({
          $set  : { category: doc.categoryId },  // rename
          $unset: { categoryId: "", }            // drop old key
        });
    count++;
    if (count % 500 === 0) console.log(`  → queued ${count}`);
  }

  if (count) {
    console.log(`⏳  Executing bulk update (${count})…`);
    await bulk.execute();
  }

  console.log("✅  Migration finished. Updated docs:", count);
  await mongoose.disconnect();
  process.exit(0);
})();
