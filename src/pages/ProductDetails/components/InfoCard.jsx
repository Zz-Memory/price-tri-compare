import { useMemo } from "react";
import { ThumbCircleO, CommentCircleO } from "@react-vant/icons";
import PriceSparkline from "@/pages/Home/components/PriceSparkline";

/**
 * InfoCard
 * - 基于首页卡片字段渲染信息区（角标、标题/副标题、标签、价格、7天迷你图、来源/互动）
 */
const InfoCard = ({ data }) => {
  const safe = data || {};
  const priceStr = useMemo(() => {
    if (safe?.priceText) return safe.priceText;
    if (safe?.currentPrice) return `${safe.currentPrice}元`;
    return "-";
  }, [safe]);

  // 计算历史低价用于价格旁“历史最低”角标（本地计算，不请求接口）
  const trend = useMemo(() => {
    if (Array.isArray(safe?.last180dPrices) && safe.last180dPrices.length > 1) return safe.last180dPrices;
    if (Array.isArray(safe?.last7dPrices) && safe.last7dPrices.length > 1) return safe.last7dPrices;
    return [];
  }, [safe]);
  const historyLow = useMemo(() => {
    if (!trend.length) return 0;
    const m = Math.min(...trend);
    return Number.isFinite(m) ? m : 0;
  }, [trend]);

  return (
    <section className="bg-white mt-2 p-4">
      {/* 角标 */}
      {safe?.badge?.text ? (
        <div className="mb-2">
          <span className={`inline-block text-white text-xs px-2 py-0.5 rounded ${safe.badge.color || "bg-red-500"}`}>
            {safe.badge.text}
          </span>
        </div>
      ) : null}

      {/* 标题/副标题 */}
      <h1 className="text-[15px] text-gray-900 leading-6">{safe?.title || "未知商品"}</h1>
      {safe?.subtitle ? <p className="text-xs text-gray-500 mt-1">{safe.subtitle}</p> : null}

      {/* 标签 */}
      {safe?.tag?.text ? (
        <div className="mt-2">
          <span
            className={`inline-block text-xs px-2 py-0.5 rounded ${
              safe.tag.bg || "bg-yellow-100"
            } ${safe.tag.textColor || "text-yellow-700"}`}
          >
            {safe.tag.text}
          </span>
        </div>
      ) : null}

      {/* 价格 + 历史低 */}
      <div className="mt-2 flex items-center gap-2">
        <span className="text-red-600 text-xl font-bold">{priceStr}</span>
        {historyLow > 0 && (
          <span className="text-[11px] px-1.5 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-700">
            历史最低 ¥{historyLow}
          </span>
        )}
      </div>

      {/* 近 7 天迷你折线 */}
      {Array.isArray(safe?.last7dPrices) && safe.last7dPrices.length > 0 ? (
        <div className="flex justify-end mt-2">
          <PriceSparkline data={safe.last7dPrices} />
        </div>
      ) : null}

      {/* 来源/互动 */}
      <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
        <span>
          {safe?.meta?.source || "-"} | {safe?.meta?.time || "-"}
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-gray-400" aria-label="comments">
            <CommentCircleO />
          </span>
          <span>{safe?.stats?.comments ?? 0}</span>
          <span className="text-gray-400" aria-label="likes">
            <ThumbCircleO />
          </span>
          <span>{safe?.stats?.likes ?? 0}</span>
        </div>
      </div>
    </section>
  );
};

export default InfoCard;