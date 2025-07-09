// src/modules/analytics/analyticsModel.js
const { Schema, model, Types } = require("mongoose");
const { floorDate, ceilDate,shiftDate } = require("../../utils/dateUtils");
/* ── 1. Metric catalogue ───────────────────────────── */
const METRIC_TYPES = [
  /* commerce */          "TotalOrders", "TotalRevenue", "AverageOrderValue", "RefundRate",
  /* user */              "NewUsers", "ActiveUsers", "ReturningCustomers", "CustomerChurn",
  /* product engagement */"ProductViews", "MostPurchasedProduct", "AbandonedCarts","TotalUsers",
  /* custom */            "Custom"
];

/* ── 2. Schema ─────────────────────────────────────── */
const AnalyticsSchema = new Schema(
  {
    metricType: { type: String, enum: METRIC_TYPES, required: true, index: true },
    period:     { type: String, enum: ["Day", "Week", "Month", "Quarter", "Year"], required: true, index: true },
    startDate:  { type: Date,   required: true, index: true },
    endDate:    { type: Date,   required: true },
    value:      { type: Number, required: true, default: 0, min: 0 },

    breakdown:  {
      type: [{ label: String, v: { type: Number, min: 0 } }],
      default: []
    },

    dimension:         { type: Map, of: String, default: {} },
    associatedEntity:  { type: Types.ObjectId, default: null },
    entityModel:       { type: String, enum: ["Order", "User", "Product", null], default: null },

    trendAbs: { type: Number, default: 0 },
    trendPct: { type: Number, default: 0 }
  },
  { timestamps: true }
);

AnalyticsSchema.index({ metricType: 1, period: 1, startDate: 1 });

/* ── 3. Static helpers ─────────────────────────────── */
AnalyticsSchema.statics.bump = async function (
  metricType,
  delta = 1,
  period = "Day",
  date = new Date(),
  link = {},          // { associatedEntity, entityModel }
  dimension = {}      // { status: "Paid", brand: "Dove" }
) {
  const start = floorDate(date, period);
  const end   = ceilDate(date, period);
  const label = date.toISOString().slice(0, 10);

  const query = { metricType, period, startDate: start, ...link };

  await this.updateOne(
    query,
    {
      $inc: { value: delta },
      $setOnInsert: { startDate: start, endDate: end, dimension },
      $push: { breakdown: { label, v: delta } }
    },
    { upsert: true, setDefaultsOnInsert: true }
  );
};

AnalyticsSchema.statics.updateTrend = async function (metricType, period = "Day", date = new Date()) {
  const nowStart  = floorDate(date, period);
  const prevStart = floorDate(shiftDate(date, period, -1), period);

  const [nowDoc, prevDoc] = await Promise.all([
    this.findOne({ metricType, period, startDate: nowStart }),
    this.findOne({ metricType, period, startDate: prevStart })
  ]);

  if (!nowDoc || !prevDoc) return;

  const abs = nowDoc.value - prevDoc.value;
  const pct = prevDoc.value ? (abs / prevDoc.value) * 100 : 0;

  await this.updateOne({ _id: nowDoc._id }, { $set: { trendAbs: abs, trendPct: pct.toFixed(2) } });
};

/* ── 4. Date helpers ──────────────────────────────── */


module.exports = model("Analytics", AnalyticsSchema);
