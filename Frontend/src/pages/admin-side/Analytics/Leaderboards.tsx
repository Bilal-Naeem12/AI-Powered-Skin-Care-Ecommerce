// src/modules/analytics/LeaderboardsPage.tsx
import React, { useEffect, useState } from "react";
import { DataTable, Column } from "@/component/admin/ecommerce/DataTable";
import { LeaderboardRow } from "@/types/DashboardResponse";
import { Eye, ShoppingCart, Archive } from "lucide-react";

type MetricKey = "ProductViews" | "MostPurchasedProduct" | "AbandonedCarts";

const METRICS: { key: MetricKey; title: string; icon: React.ReactNode }[] = [
  {
    key: "ProductViews",
    title: "Most Viewed Products",
    icon: <Eye className="inline-block mr-1" />,
  },
  {
    key: "MostPurchasedProduct",
    title: "Top Purchased Products",
    icon: <ShoppingCart className="inline-block mr-1" />,
  }
];

export default function LeaderboardsPage() {
  const [data, setData] = useState<Record<MetricKey, LeaderboardRow[]>>(
    {} as any
  );

  useEffect(() => {
    METRICS.forEach(({ key }) => {
      fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/analytics/leaderboard?metric=${key}&period=Month&limit=10`
      )
        .then((res) => res.json())
        .then((rows: LeaderboardRow[]) =>
          setData((d) => ({ ...d, [key]: rows }))
        )
        .catch(() => setData((d) => ({ ...d, [key]: [] })));
    });
  }, []);

  // shared columns factory
  const makeColumns = (metric: MetricKey): Column<LeaderboardRow>[] => [
    {
      key: "product",
      header: "Product",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.product.images?.[0]}
            alt={row.product.name}
            className="h-[50px] w-[50px] rounded-md object-cover"
          />
          <div>
            <p className="font-medium text-gray-800 dark:text-white/90">
              {row.product.name}
            </p>
            <span className="text-gray-500 text-theme-xs dark:text-gray-400">
              {row.product.description.slice(0, 50)}…
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "brand",
      header: "Brand",
      cell: (row) => row.product.brand,
    },
    {
      key: "price",
      header: "Price",
      cell: (row) => `$${row.product.price.toFixed(2)}`,
    },
    {
      key: "views",
      header:
        metric === "MostPurchasedProduct"
          ? "Qty Purchased"
          : metric === "AbandonedCarts"
          ? "Carts Abandoned"
          : "Views",
      cell: (row) => (
        <div className="flex items-center gap-1">
          {row.views}{" "}
          {metric === "MostPurchasedProduct" ? (
            <ShoppingCart size={16} />
          ) : metric === "AbandonedCarts" ? (
            <Archive size={16} />
          ) : (
            <Eye size={16} />
          )}
        </div>
      ),
    },
  ];

 return (
  <main className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
    <h1 className="text-2xl font-semibold mb-4">Leaderboards</h1>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {METRICS.map(({ key, title, icon }) => (
        <DataTable<LeaderboardRow>
          key={key}
          title={
            <span className="flex items-center">
              {icon}
              {title}
            </span>
          }
          rows={data[key] ?? []}
          columns={makeColumns(key)}
          seeAllHref={`/admin/analytics/leaderboard?metric=${key}`}
          seeAllText="See all"
        />
      ))}
    </div>
  </main>
);
}
