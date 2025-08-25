import axios from "@/services/config";

/**
 * 获取搜索联想词（5~8 条）
 * @param {string} q 关键词
 * @returns {Promise<string[]>}
 */
export async function fetchSearchSuggestions(q) {
  const kw = (q || "").trim();
  if (!kw) return [];
  const { data } = await axios.get("/search/suggest", { params: { q: kw } });
  return data?.data?.list ?? [];
}