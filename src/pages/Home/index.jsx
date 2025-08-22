import { useEffect, useRef } from "react";
import { Skeleton } from "react-vant";
import useTitle from "@/hooks/useTitle";
import useHomeFeed from "@/hooks/useHomeFeed";
import HomeHeader from "@/pages/Home/components/HomeHeader";
import QuickActions from "@/pages/Home/components/QuickActions";
import PlatformTabs from "@/pages/Home/components/PlatformTabs";
import CategoryChips from "@/pages/Home/components/CategoryChips";
import ProductCard from "@/pages/Home/components/ProductCard";
import { Link } from 'react-router-dom';

/**
 * 首页容器（纯渲染）
 * - 数据与状态通过 useHomeFeed Hook 提供
 * - 使用 IntersectionObserver 实现列表的“无限下拉”加载更多
 */
const Home = () => {
  useTitle("首页");

  // 从 Hook 获取 UI 所需的常量、选中态与数据
  const {
    platformItems,
    categoryItems,
    activePlatform,
    setActivePlatform,
    activeCategory,
    setActiveCategory,
    products,
    loading,
    loadingMore,
    hasMore,
    errMsg,
    loadMore,
  } = useHomeFeed();

  // 底部哨兵，用于触发加载更多
  const loadMoreRef = useRef(null);
  useEffect(() => {
    if (!hasMore) return; // 没有更多则不再监听
    const el = loadMoreRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first && first.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loadMore]);

  return (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen pb-16">
      {/* 顶部：标题 + 搜索框 */}
      <header className="p-3 bg-white">
        <HomeHeader />
      </header>

      {/* 快捷功能入口（5个圆形入口） */}
      <section className="bg-white p-3">
        <QuickActions />
      </section>

      {/* 主体区域：平台 Tabs、分类 Chips、列表 */}
      <main className="bg-gray-100 p-3">
        {/* 平台 Tabs（受控） */}
        <PlatformTabs
          items={platformItems}
          active={activePlatform}
          onChange={setActivePlatform}
          onMenuClick={() => {}}
        />

        {/* 分类 Chips（受控） */}
        <CategoryChips
          items={categoryItems}
          active={activeCategory}
          onChange={setActiveCategory}
        />

        {/* 加载骨架屏（首屏/切换筛选时） */}
        {loading && (
          <div>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-3 mb-3">
                <div className="flex items-start">
                  <div className="mr-3">
                    <Skeleton avatar avatarShape="square" avatarSize={112} title={false} row={0} />
                  </div>
                  <div className="flex-1">
                    <Skeleton title row={3} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 错误提示 */}
        {errMsg && !loading && (
          <div className="text-center text-sm text-red-500 py-6">{errMsg}</div>
        )}

        {/* 商品列表 */}
        {!loading &&
          !errMsg &&
          products.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              state={{ item: p }}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <ProductCard
                cover={p.cover}
                badge={p.badge}
                title={p.title}
                subtitle={p.subtitle}
                tag={p.tag}
                price={{ amount: `${p.currentPrice}元` }}
                last7dPrices={p.last7dPrices}
                meta={p.meta}
                stats={p.stats}
              />
            </Link>
          ))}

        {/* 底部哨兵 + 状态提示（仅在非首屏加载时展示） */}
        {!loading && !errMsg && (
          <>
            {hasMore && <div ref={loadMoreRef} className="h-6" />}
            <div className="text-center text-xs text-gray-400 py-3">
              {loadingMore ? "加载中..." : hasMore ? "" : products.length ? "已无更多" : ""}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;