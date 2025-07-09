/**
 * mergeDuplicateBuckets.js
 * One-time fix: merge duplicate Month analytics by metricType + period + startDate.
 */

const mongoose = require("mongoose");
const Analytics = require("../modules/analytics/analyticsModel");


(async function () {
  try {
    console.log("🔗 Connecting to DB...");
 await mongoose.connect("mongodb+srv://fa21bcs029:bcHXNzq0oLyQPPUa@aiskincare.ylnog.mongodb.net/SkinCare-Ecommerce?retryWrites=true&w=majority&appName=AISkinCare");

    // 1️⃣ Get all June/July 'Month' docs
    const docs = await Analytics.find({ period: "Month" }).lean();
    console.log(`🔍 Found ${docs.length} Month docs.`);

    // 2️⃣ Group by key
    const groups = {};
    for (const doc of docs) {
      const key = `${doc.metricType}_${doc.startDate.toISOString()}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(doc);
    }

    let merged = 0;

    for (const key in groups) {
      const group = groups[key];
      if (group.length <= 1) continue;

      const [keep, ...dupes] = group;

      const total = group.reduce((sum, d) => sum + d.value, 0);

      await Analytics.updateOne(
        { _id: keep._id },
        { $set: { value: total } }
      );

      const idsToDelete = dupes.map((d) => d._id);
      await Analytics.deleteMany({ _id: { $in: idsToDelete } });

      console.log(`✅ Merged ${group.length} → 1 for ${key}`);
      merged++;
    }

    console.log(`✅ Merged ${merged} duplicate groups.`);
    await mongoose.disconnect();
    console.log("✅ Done. Connection closed.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();
