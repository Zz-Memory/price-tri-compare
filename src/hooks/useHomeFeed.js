/**
 * useHomeFeed
 * - 封装首页“平台/分类选中态 + 列表数据请求”的逻辑
 * - 组件只负责渲染与事件绑定，降低耦合
 */
import { useEffect, useState } from "react";
import { fetchHomeRecommendations } from "@/services/home";
import { PLATFORM_ITEMS, CATEGORY_ITEMS } from "@/constants/home";

export default function useHomeFeed() {
  // 平台与分类的受控选中态
  const [activePlatform, setActivePlatform] = useState(PLATFORM_ITEMS[0].key);
  const [activeCategory, setActiveCategory] = useState(CATEGORY_ITEMS[0].key);

  // 列表数据与状态
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  // 根据选中态请求推荐列表
  useEffect(() => {
    let stopped = false;
    async function load() {
      setLoading(true);
      setErrMsg("");
      try {
        const list = await fetchHomeRecommendations({
          platform: activePlatform,
          category: activeCategory,
          page: 1,
          pageSize: 10
        });
        if (stopped) return;
        setProducts(list);
      } catch (e) {
        if (stopped) return;
        setErrMsg("数据加载失败");
        setProducts([]);
      } finally {
        if (!stopped) setLoading(false);
      }
    }
    load();
    return () => {
      stopped = true;
    };
  }, [activePlatform, activeCategory]);

  return {
    // 常量（给 UI 渲染使用）
    platformItems: PLATFORM_ITEMS,
    categoryItems: CATEGORY_ITEMS,
    // 选中态与 setter
    activePlatform,
    setActivePlatform,
    activeCategory,
    setActiveCategory,
    // 列表数据与状态
    products,
    loading,
    errMsg
  };
}