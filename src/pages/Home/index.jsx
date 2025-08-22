import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "react-vant";
import useTitle from "@/hooks/useTitle";
import HomeHeader from "@/pages/Home/components/HomeHeader";
import QuickActions from "@/pages/Home/components/QuickActions";
import PlatformTabs from "@/pages/Home/components/PlatformTabs";
import CategoryChips from "@/pages/Home/components/CategoryChips";
import ProductCard from "@/pages/Home/components/ProductCard";
/**
 * 平台 Tab 数据（受控）
 * - key：传给接口的 platform 参数
 * - label：展示名称
 */
const platformItems = [
  { key: "douyin", label: "抖音商城" },
  { key: "pdd", label: "拼多多" },
  { key: "jd", label: "京东" },
  { key: "tb", label: "淘宝" },
  { key: "tmall", label: "天猫" },
  { key: "kuaishou", label: "快手商城" },
];

/**
 * 分类 Chips 数据（受控）
 * - key：传给接口的 category 参数
 * - label：展示名称
 */
const categoryItems = [
  { key: "pc", label: "电脑" },
  { key: "phone", label: "手机" },
  { key: "appliance", label: "家电" },
  { key: "clothes", label: "服饰" },
  { key: "beauty", label: "美妆" },
  { key: "sports", label: "运动" },
  { key: "home", label: "居家" },
];

/**
 * 首页容器
 * - 管理平台/分类选中态（受控）
 * - 根据选中态请求 Mock 接口获取推荐商品数据
 * - 展示加载/错误状态与商品卡片
 */
const Home = () => {
  useTitle("首页");

  // 平台与分类当前选中项（受控）
  const [activePlatform, setActivePlatform] = useState(platformItems[0].key);
  const [activeCategory, setActiveCategory] = useState(categoryItems[0].key);

  // 列表数据与状态
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  /**
   * 监听平台/分类变化，请求推荐列表
   * - 接口：GET /api/home/recommendations
   * - 参数：platform / category / page / pageSize
   * - 注意：通过 stopped 标志避免组件卸载后的状态更新
   */
  useEffect(() => {
    let stopped = false;
    async function load() {
      setLoading(true);
      setErrMsg("");
      try {
        const { data } = await axios.get("/api/home/recommendations", {
          params: {
            platform: activePlatform,
            category: activeCategory,
            page: 1,
            pageSize: 10,
          },
        });
        if (stopped) return;
        const list = data?.data?.list ?? [];
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

        {/* 加载/错误提示 */}
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
        {errMsg && !loading && (
          <div className="text-center text-sm text-red-500 py-6">{errMsg}</div>
        )}

        {/* 商品列表（将接口的 currentPrice 映射为展示用字符串） */}
        {!loading &&
          !errMsg &&
          products.map((p) => (
            <ProductCard
              key={p.id}
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
          ))}
      </main>
    </div>
  );
};

export default Home;