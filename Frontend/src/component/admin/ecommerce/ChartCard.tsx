// src/modules/analytics/ChartCard.tsx
import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { LinePoint } from "@/types/DashboardResponse";

interface ChartCardProps {
  title: string;
  points: LinePoint[];
  units: number;
  periodLabel: "Day" | "Week" | "Month"; // narrow to the three you use
}

export default function ChartCard({
  title,
  points,
  units,
  periodLabel,
}: ChartCardProps) {
  // sort by date
  const sorted = [...points].sort(
    (a, b) => +new Date(a.date) - +new Date(b.date)
  );

  // format categories per period
  const categories = sorted.map((p) => {
    const d = new Date(p.date);
    switch (periodLabel) {
      case "Month":
        // e.g. "Jun", "Jul", "Aug"
        return d.toLocaleString("default", { month: "short" });
      case "Week":
        // e.g. "Mon", "Tue", "Wed"
        return d.toLocaleDateString("default", { weekday: "short" });
      case "Day":
        // e.g. "00:00", "13:00", "23:00"
        return d.toLocaleTimeString("default", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      default:
        return p.date;
    }
  });

  const series = [
    {
      name: title,
      data: sorted.map((p) => p.value),
    },
  ];

  const options: ApexOptions = {
    chart: { type: "area", toolbar: { show: false }, height: 280 },
    stroke: { curve: "smooth", width: 2 },
    markers: { size: 0, hover: { size: 6 } },
    fill: { type: "gradient", gradient: { opacityFrom: 0.6, opacityTo: 0.1 } },
    grid: { yaxis: { lines: { show: true } }, xaxis: { lines: { show: false } } },
    dataLabels: { enabled: false },
    tooltip: { x: { format: periodLabel === "Day" ? "HH:mm" : "dd MMM yyyy" } },
    xaxis: {
      type: "category",
      categories,
      labels: { rotate: -45, hideOverlappingLabels: true },
    },
    yaxis: { decimalsInFloat: 0 },
    colors: ["#ff69b4"],
    legend: { show: false },
  };

  return (
    <div className="flex flex-col h-full overflow-hidden rounded-2xl border bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last {units} {periodLabel==="Day"?"Hour":periodLabel==="Week"?"Day":periodLabel}
            {units > 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <div className="flex-1">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[500px]">
            <Chart options={options} series={series} type="area" height={250} />
          </div>
        </div>
      </div>
    </div>
  );
}
