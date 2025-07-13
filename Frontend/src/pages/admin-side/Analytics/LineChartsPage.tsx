// src/modules/analytics/LineChartsPage.tsx
import React, { useEffect, useState, useMemo } from "react";
import ChartTab from "@/component/common/ChartTab";
import { LinePoint } from "@/types/DashboardResponse";
import { PERIOD_MAP, useChartTabStore } from "@/store/ChartTabStore";
import ChartCard from "@/component/admin/ecommerce/ChartCard";
const METRIC_TYPES = [
  "TotalOrders", "TotalRevenue", "AverageOrderValue", "RefundRate",

  "ProductViews", "MostPurchasedProduct",
];
const LINE_METRIC_KEYS = METRIC_TYPES.filter(
  (m) => m !== "Custom" 
);
function humanize(key: string) {
  return key.replace(/([A-Z])/g, " $1").trim();
}
// build your array dynamically:
const LINE_METRICS: { key: string; title: string }[] = LINE_METRIC_KEYS.map(
  (key) => ({
    key,
    title: humanize(key),
  })
);

// explicit union for your ChartCard
type PeriodLabel = "Day" | "Week" | "Month";

export default function LineChartsPage() {
  const { globalPeriod } = useChartTabStore();
  // cast the lookup so TS knows it's one of our three
  const periodLabel = PERIOD_MAP[globalPeriod] as PeriodLabel;

  // how many buckets?
  const units = periodLabel === "Day"  
    ? 24 
    : periodLabel === "Week" 
      ? 7 
      : 12;

  // only compute once
  const metricsParam = useMemo(
    () => LINE_METRICS.map((m) => m.key).join(","),
    []
  );

  const [allPoints, setAllPoints] = useState<Record<string, LinePoint[]>>({});

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_BACKEND_URL}/analytics/lines` +
      `?period=${periodLabel}&units=${units}&metrics=${metricsParam}`
    )
      .then((res) => res.json())
      .then((data: Record<string, LinePoint[]>) => setAllPoints(data))
      .catch(console.error);
  }, [periodLabel, units, metricsParam]);

  return (
    <main className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Trends Overview
        </h1>
        <ChartTab />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {LINE_METRICS.map(({ key, title }) => (
          <div key={key} className="h-[380px]">
            <ChartCard
              title={title}
              points={allPoints[key] ?? []}
              units={units}
              periodLabel={periodLabel}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
