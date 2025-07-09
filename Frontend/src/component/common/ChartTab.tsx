import { useChartTabStore } from "@/store/adminstores/chartTabStore";

export default function ChartTab() {
  const { statisticsPeriod, setStatisticsPeriod } = useChartTabStore();

  const getButtonClass = (key: string) =>
    statisticsPeriod === key
      ? "font-semibold text-gray-900 bg-white p-2"
      : "text-gray-600 hover:text-gray-700 p-2";

  return (
    <div className="flex items-center gap-0.5 rounded-md bg-gray-100 p-1 dark:bg-gray-900">
   <button onClick={() => setStatisticsPeriod("months")} className={getButtonClass("months")}>5 months</button>
      <button onClick={() => setStatisticsPeriod("days7")} className={getButtonClass("days7")}>7 days</button>
      <button onClick={() => setStatisticsPeriod("hours24")} className={getButtonClass("hours24")}>24 hours</button>
    </div>
  );
}
