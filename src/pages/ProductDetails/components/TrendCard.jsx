import { useMemo, useState } from "react";
import LineChart from "./LineChart";

/**
 * TrendCard
 * - 入参：
 *    - last180d: 数组（近 6 个月）
 *    - last7d: 数组（近 7 天）
 * - 功能：
 *    - 提供“全部 / 6个月 / 7天”三段切换
 *    - 渐变面积折线图 + 区间最低/最高 + 最新价
 *    - 行动入口占位
 */
const TrendCard = ({ last180d = [], last7d = [] }) => {
  const [range, setRange] = useState("all"); // all | 180d | 7d

  const allSeries = useMemo(() => {
    // “全部”：优先使用 180 天序列；若无则回退 7 天
    return (Array.isArray(last180d) && last180d.length > 0)
      ? last180d
      : (Array.isArray(last7d) ? last7d : []);
  }, [last180d, last7d]);

  const series = useMemo(() => {
    if (range === "180d") return Array.isArray(last180d) ? last180d : [];
    if (range === "7d") return Array.isArray(last7d) ? last7d : [];
    return allSeries;
  }, [range, last180d, last7d, allSeries]);

  const historyLow = useMemo(() => {
    const m = Math.min(...series);
    return Number.isFinite(m) ? m : 0;
  }, [series]);
  const rangeMax = useMemo(() => {
    const m = Math.max(...series);
    return Number.isFinite(m) ? m : 0;
  }, [series]);
  const latest = useMemo(() => (series?.length ? series[series.length - 1] : 0), [series]);

  const tabBtn = (key, label) => (
    <button
      key={key}
      type="button"
      onClick={() => setRange(key)}
      className={`pb-2 text-sm ${
        range === key ? "text-black border-b-2 border-red-500" : "text-gray-500"
      }`}
    >
      {label}
    </button>
  );

  return (
    <section className="bg-white mt-2 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-gray-900 font-medium">价格趋势</div>
        <div className="flex gap-4">
          {tabBtn("all", "全部")}
          {tabBtn("180d", "6个月")}
          {tabBtn("7d", "7天")}
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
        <div className="text-xs text-gray-500 mb-2">
          数据来源：last180dPrices / last7dPrices
        </div>

        <LineChart data={series} />

        <div className="mt-2 flex justify-between text-[11px] text-gray-500">
          <span>区间 ¥{historyLow} - ¥{rangeMax}</span>
          <span>最新 ¥{latest}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
          <div className="bg-white border rounded p-2 text-center">
            全网比价
            <div className="text-gray-400">占位</div>
          </div>
          <div className="bg-white border rounded p-2 text-center">
            价格走势
            <div className="text-gray-400">历史低 ¥{historyLow}</div>
          </div>
          <div className="bg-white border rounded p-2 text-center">
            降价提醒
            <div className="text-gray-400">占位</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendCard;