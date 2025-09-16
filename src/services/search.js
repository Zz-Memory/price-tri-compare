import axios from "@/services/config";
import { isVercel } from "@/services/config";
import Mock from "mockjs";

/**
 * 获取搜索联想词（5~8 条）
 * @param {string} q 关键词
 * @returns {Promise<string[]>}
 */
export async function fetchSearchSuggestions(q) {
  const kw = (q || "").trim();
  if (!kw) return [];
  if (isVercel) {
    // Vercel 前端造数（与 mock/search.js 逻辑一致：5~8 条）
    const base = [
      `${kw}`,
      `${kw} 最低价`,
      `${kw} 历史价格`,
      `${kw} 价格走势`,
      `${kw} 参数对比`,
      `${kw} 京东/拼多多 对比`,
      `${kw} 优惠券`,
      `${kw} 官方旗舰店`,
      `${kw} 开箱测评`,
      `${kw} 用户评价`,
      `${kw} 以旧换新`,
      `${kw} 真伪鉴定`,
      `${kw} 学生优惠`,
      `${kw} 教育优惠`,
      `${kw} 近期好价`,
      `${kw} 店铺券`,
      `${kw} 补贴`,
    ];
    const pool = Mock.Random.shuffle(base);
    const count = Mock.Random.integer(5, 8);
    const set = new Set();
    const out = [];
    for (const s of pool) {
      if (!set.has(s)) {
        set.add(s);
        out.push(s);
      }
      if (out.length >= count) break;
    }
    return out;
  }
  // 本地：命中 vite-plugin-mock
  const { data } = await axios.get("/search/suggest", { params: { q: kw } });
  return data?.data?.list ?? [];
}