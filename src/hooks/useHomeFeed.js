/**
 * useHomeFeed
 * - 封装首页“平台/分类选中态 + 列表数据请求 + 分页加载”的逻辑
 * - 组件仅负责渲染与事件绑定，避免业务逻辑散落在页面
 */
import { useEffect, useState } from "react";
import { fetchHomeRecommendations } from "@/services/home";
import { PLATFORM_ITEMS, CATEGORY_ITEMS } from "@/constants/home";

const PAGE_SIZE = 10;

export default function useHomeFeed() {
  // 平台与分类的受控选中态
  const [activePlatform, setActivePlatform] = useState(PLATFORM_ITEMS[0].key);
  const [activeCategory, setActiveCategory] = useState(CATEGORY_ITEMS[0].key);

  // 列表数据与分页状态
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 加载状态
  const [loading, setLoading] = useState(false);      // 首屏/筛选切换加载
  const [loadingMore, setLoadingMore] = useState(false); // 上拉加载更多
  const [errMsg, setErrMsg] = useState("");

  // 内部通用加载函数
  const loadPage = async (pageToLoad, append) => {
    try {
      append ? setLoadingMore(true) : setLoading(true);
      const list = await fetchHomeRecommendations({
        platform: activePlatform,
        category: activeCategory,
        page: pageToLoad,
        pageSize: PAGE_SIZE,
      });
      setErrMsg("");
      setHasMore(list.length === PAGE_SIZE); // 简单按条数判断更多
      setPage(pageToLoad);
      setProducts((prev) => (append ? [...prev, ...list] : list));
    } catch (e) {
      setErrMsg("数据加载失败");
      if (!append) setProducts([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 平台/分类变化时重置并拉取第一页
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setErrMsg("");
    loadPage(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePlatform, activeCategory]);

  // 供外部触发的加载更多
  const loadMore = () => {
    if (loading || loadingMore || !hasMore) return;
    loadPage(page + 1, true);
  };

  // 手动刷新
  const refresh = () => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    loadPage(1, false);
  };

  return {
    // 常量（UI 渲染所需）
    platformItems: PLATFORM_ITEMS,
    categoryItems: CATEGORY_ITEMS,

    // 受控选中态
    activePlatform,
    setActivePlatform,
    activeCategory,
    setActiveCategory,

    // 列表与状态
    products,
    loading,
    loadingMore,
    hasMore,
    errMsg,

    // 行为
    loadMore,
    refresh,
  };
}