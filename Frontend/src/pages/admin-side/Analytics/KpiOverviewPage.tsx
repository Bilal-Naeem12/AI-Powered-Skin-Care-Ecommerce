// src/modules/analytics/KpiOverviewPage.tsx
import React, { useEffect, useState } from "react";
import ChartTab from "@/component/common/ChartTab";

import { useChartTabStore, PERIOD_MAP } from "@/store/ChartTabStore";
import {
  GroupIcon,
  BoxIconLine,
  UserIcon,
  PieChartIcon,
  // add more icons as desired…
} from "@/icons";
import MetricsGrid, { MetricItem } from "@/component/admin/ecommerce/MetricsGrid";

type RawKpis = Record<
  string,
  { value: number; changePct: number }
>;

export default function KpiOverviewPage() {
  const { globalPeriod } = useChartTabStore();
  const periodLabel = PERIOD_MAP[globalPeriod]; // "Day" | "Week" | "Month"

  const [kpis, setKpis] = useState<RawKpis | null>(null);

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_BACKEND_URL}/analytics/kpis?period=${periodLabel}`
    )
      .then((r) => r.json())
      .then((data: RawKpis) => setKpis(data))
      .catch(console.error);
  }, [periodLabel]);

  if (!kpis) return <p className="p-6 text-center">Loading metrics…</p>;

  // map metric keys → icons & human labels
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> =
    {
      TotalRevenue: GroupIcon,
      TotalOrders: BoxIconLine,
      TotalUsers: UserIcon,
      TotalProducts: PieChartIcon,
      NewUsers: UserIcon,
      ActiveUsers: UserIcon,
      ReturningCustomers: UserIcon,
      CustomerChurn: UserIcon,
      AverageOrderValue: BoxIconLine,
      RefundRate: BoxIconLine,
      ProductViews: BoxIconLine,
      AbandonedCarts: BoxIconLine,
      // fallback: GroupIcon
    };

  // helper: camelCase → Title Case
  const humanize = (s: string) =>
    s.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()).trim();

  // build MetricItem[]
  const metrics: MetricItem[] = Object.entries(kpis).map(
    ([metric, { value, changePct }]) => ({
      label: humanize(metric),
      value: metric === "TotalRevenue"
        ? `$${value.toFixed(2)}`
        : value,
      changePct,
      Icon: iconMap[metric] || GroupIcon,
    })
  );

  return (
    <main className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Key Metrics Overview
        </h1>
        <ChartTab />
      </div>
      <MetricsGrid metrics={metrics} />
    </main>
  );
}
