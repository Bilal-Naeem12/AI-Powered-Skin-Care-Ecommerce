
const mongoose = require("mongoose");
const Analytics = require("../modules/analytics/analyticsModel");
const { floorDate, ceilDate } = require("../utils/dateUtils");

(async () => {
  await mongoose.connect("mongodb+srv://fa21bcs029:bcHXNzq0oLyQPPUa@aiskincare.ylnog.mongodb.net/SkinCare-Ecommerce?retryWrites=true&w=majority&appName=AISkinCare");

  // Only find docs with startDate in June or July 2024
  const rangeStart = new Date("2025-06-01T00:00:00Z");
  const rangeEnd = new Date("2025-08-01T00:00:00Z");

  const docs = await Analytics.find({
    startDate: { $gte: rangeStart, $lt: rangeEnd }
  });

  console.log(`Found ${docs.length} docs in June/July`);

  const ops = [];

  for (const doc of docs) {
    const correctStart = floorDate(doc.startDate, doc.period);
    const correctEnd = ceilDate(doc.startDate, doc.period);

    if (+doc.startDate !== +correctStart || +doc.endDate !== +correctEnd) {
      ops.push({
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: { startDate: correctStart, endDate: correctEnd } }
        }
      });
    }
  }

  if (ops.length) {
    const res = await Analytics.bulkWrite(ops);
    console.log(`✅ Updated ${res.modifiedCount} docs`);
  } else {
    console.log("✅ No misaligned docs found");
  }

  await mongoose.disconnect();
})();
