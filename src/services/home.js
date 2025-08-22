import axios from "axios";

/**
 * 获取首页推荐商品列表
 * - platform: 平台 key
 * - category: 分类 key
 * - page: 页码（默认 1）
 * - pageSize: 每页数量（默认 10）
 * 返回：数组 list（已从响应中取出）
 */
export async function fetchHomeRecommendations({
  platform,
  category,
  page = 1,
  pageSize = 10,
}) {
  const { data } = await axios.get("/api/home/recommendations", {
    params: { platform, category, page, pageSize },
  });
  return data?.data?.list ?? [];
}