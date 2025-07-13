import { useEffect, useState } from "react";
import PageMeta from "@/component/common/PageMeta";
import { useChartTabStore, PERIOD_MAP } from "@/store/ChartTabStore";
import ChartTab from "@/component/common/ChartTab";
import EcommerceMetrics  from "@/component/admin/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "@/component/admin/ecommerce/MonthlySalesChart";
import StatisticsChart   from "@/component/admin/ecommerce/StatisticsChart";
import {MonthlyTarget}     from "@/component/admin/ecommerce/MonthlyTarget";
import RecentOrders      from "@/component/admin/ecommerce/RecentOrders";
import {
  DashboardResponse,
  DashboardKPI   as KPI,
  LinePoint,
  LeaderboardRow as Leader,
  MetricKPI,
} from "@/types/DashboardResponse";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [kpi, setKpi]       = useState<KPI | null>(null);
  const [line, setLine]     = useState<LinePoint[]>([]);
  const [leaders, setLeaders]=useState<Leader[]>([]);
  const [todayRevenue, setTodayRevenue] = useState<MetricKPI>();
  const TARGET = 2500;

  const { globalPeriod } = useChartTabStore();
 
  useEffect(() => {
    (async () => {
      try {
        const dash: DashboardResponse = await fetch(
          `${import.meta.env.VITE_API_BACKEND_URL}/analytics/dashboard?period=Month`
        ).then(r => r.json());
        setKpi(dash.kpi);
        setLine(dash.lineChart);
        setLeaders(dash.leaderboard);

        const recJson = await fetch(
          `${import.meta.env.VITE_API_BACKEND_URL}/analytics/period/Day?metricTypes=TotalRevenue&today=true`
        ).then(r => {
          if (!r.ok) throw new Error("Failed to fetch analytics");
          return r.json();
        });

        const raw = Array.isArray(recJson.docs) ? recJson.docs : [recJson];
        setTodayRevenue({
          value:     raw[0]?.value     ?? 0,
          changePct: raw[0]?.changePct ?? 0,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading…</div>;

  const progress = kpi ? (kpi.totalRevenue.value / TARGET) * 100 : 0;

  return (
    <>
      <PageMeta title="Admin Dashboard" description="E-commerce metrics" />

     

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-7 space-y-6">
          <EcommerceMetrics kpi={kpi} />
          <MonthlySalesChart points={line} />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget
            progress={progress}
            target={TARGET}
            revenue={kpi!.totalRevenue.value}
            todayRevenue={todayRevenue}
            changePct={kpi!.totalRevenue.changePct}
          />
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
