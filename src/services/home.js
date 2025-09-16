import axios from "@/services/config";
import { isVercel } from "@/services/config";
import Mock from "mockjs";

export async function fetchHomeRecommendations({
  platform,
  category,
  page = 1,
  pageSize = 10,
}) {
  if (isVercel) {
    // 构造与 mock/homeRecommendations.js 完全一致的响应包，然后与本地一样解包返回 list
    const { Random } = Mock;
    const toMoney = (n) => Number(n.toFixed(2));
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const genLast7Days = (cur) => {
      const arr = [];
      for (let i = 0; i < 6; i++) arr.push(toMoney(cur * (1 + Random.float(-0.1, 0.1, 3, 3))));
      arr.push(toMoney(cur));
      return arr;
    };
    const genLast180Days = (cur, last7) => {
      const nodes = 12, maxPct = 0.2;
      const min = cur * (1 - maxPct), max = cur * (1 + maxPct);
      const series = [];
      let prev = clamp(cur * (1 + Random.float(-0.15, 0.15, 3, 3)), min, max);
      series.push(toMoney(prev));
      for (let i = 1; i < nodes; i++) {
        if (Random.boolean(1, 6)) { series.push(toMoney(prev)); continue; }
        let next = prev * (1 + Random.float(-0.02, 0.02, 3, 3));
        next = clamp(next, min, max);
        next = toMoney(next);
        series.push(next);
        prev = next;
      }
      return [...series, ...last7];
    };
    const genCover = () => {
      const bg = Random.color(); let fg = Random.color(); if (fg === bg) fg = "#ffffff";
      return Random.image("112x112", bg, fg, "png", "img");
    };
    const item = () => {
      const currentPrice = toMoney(Random.float(50, 5000, 2, 2));
      const last7d = genLast7Days(currentPrice);
      return {
        id: Random.guid(),
        platform: platform || "jd",
        category: category || "phone",
        cover: genCover(),
        badge: { text: Random.pick(["低于双11","历史新低","139天次低"]), color: "bg-red-500" },
        title: Random.ctitle(6, 16),
        subtitle: Random.boolean(3, 7, true) ? Random.pick(['慢慢买补贴1.4元','红包立减','平台津贴叠加','限量抢购']) : '',
        tag: Random.boolean(4, 6, true) ? { text: '店铺券', bg: 'bg-green-100', textColor: 'text-green-700' } : null,
        currentPrice,
        last7dPrices: last7d,
        last180dPrices: genLast180Days(currentPrice, last7d),
        priceText: `${currentPrice}元`,
        meta: { source: "平台", time: "12:00" },
        stats: { comments: Random.integer(0, 2000), likes: Random.integer(0, 5000) },
      };
    };
    const list = Array.from({ length: pageSize }, item);
    const mockResp = {
      code: 0,
      message: "ok",
      data: { list, page, pageSize, hasMore: page < 5 }
    };
    return mockResp.data.list; // 与本地 axios 解包后的返回一致
  }
  const { data } = await axios.get("/home/recommendations", {
    params: { platform, category, page, pageSize },
  });
  return data?.data?.list ?? [];
}