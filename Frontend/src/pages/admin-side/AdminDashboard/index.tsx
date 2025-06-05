// src/pages/admin/Home.tsx  (or wherever your page lives)
import { useEffect, useState } from "react";
import PageMeta from "@/component/common/PageMeta";

import EcommerceMetrics   from "@/component/admin/ecommerce/EcommerceMetrics";
import MonthlySalesChart  from "@/component/admin/ecommerce/MonthlySalesChart";
import StatisticsChart    from "@/component/admin/ecommerce/StatisticsChart";
import MonthlyTarget      from "@/component/admin/ecommerce/MonthlyTarget";
import RecentOrders       from "@/component/admin/ecommerce/RecentOrders";

import {
  DashboardResponse,
  DashboardKPI as KPI,
  LinePoint,
  LeaderboardRow as Leader,
} from "@/types/DashboardResponse";

const API = import.meta.env.VITE_API_BASE;

export default function Home() {
  /* ----------------------------------------------------------------
     Local state
     ---------------------------------------------------------------- */
  const [loading, setLoading] = useState(true);
  const [kpi,      setKpi]      = useState<KPI | null>(null);
  const [line,     setLine]     = useState<LinePoint[]>([]);
  const [leaders,  setLeaders]  = useState<Leader[]>([]);
  // const [recent,   setRecent]   = useState<RecentOrder[]>([]);

  /* ----------------------------------------------------------------
     Side-effect: fetch dashboard + recent orders
     ---------------------------------------------------------------- */
  useEffect(() => {
    (async () => {
      try {
        /* dashboard: kpi + line + leaderboard */
        const dash: DashboardResponse = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/analytics/dashboard?period=Month`).then(r => r.json());
        setKpi(dash.kpi);
        setLine(dash.lineChart);
        setLeaders(dash.leaderboard);

        /* recent orders (6) */
        // const recJson = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/orders?limit=6`).then(r => r.json());
        // setRecent(recJson.docs ?? recJson);           // adapt if you paginate
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ----------------------------------------------------------------
     Loading / empty UI
     ---------------------------------------------------------------- */
  if (loading) return <div className="p-10 text-center">Loading…</div>;

  /* target for radial chart (20 K here — change to env or prop) */
  const progress = kpi ? (kpi.totalRevenue.value / 2000) * 100 : 0;

  return (
    <>
      <PageMeta title="Admin Dashboard" description="E-commerce metrics" />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics kpi={kpi} />
          <MonthlySalesChart points={line} />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget progress={progress} />
        </div>

        <div className="col-span-12">
          <StatisticsChart points={line} />
        </div>

        <div className="col-span-12">
          <RecentOrders rows={leaders} />
        </div>
      </div>
    </>
  );
}
