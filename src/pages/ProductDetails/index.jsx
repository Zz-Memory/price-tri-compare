import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useTitle from "@/hooks/useTitle";
import { useUserStore } from "@/store/login";
import InfoCard from "./components/InfoCard";
import TrendCard from "./components/TrendCard";
import BottomBar from "./components/BottomBar";
import { ArrowLeft } from "@react-vant/icons";

/**
 * 商品详情（组件化）
 * - 仅使用首页卡片字段进行渲染
 */
const ProductDetails = () => {
  useTitle("商品详情");
  const navigate = useNavigate();
  const { state } = useLocation();
  const product = state?.item;

  // 兜底（如果直接打开详情且没有 state）
  const safe = useMemo(() => {
    if (product) return product;
    return {
      title: "未知商品",
      cover: "",
      badge: { text: "" },
      subtitle: "",
      tag: null,
      currentPrice: 0,
      priceText: "",
      last7dPrices: [],
      last180dPrices: [],
      meta: { source: "-", time: "-" },
      stats: { comments: 0, likes: 0 },
    };
  }, [product]);

  const incFavorites = useUserStore((s) => s.incFavorites);
  const decFavorites = useUserStore((s) => s.decFavorites);
  const [isFavorited, setIsFavorited] = useState(false);
  const handleFavorite = () => {
    if (isFavorited) {
      decFavorites(1);
      setIsFavorited(false);
    } else {
      incFavorites(1);
      setIsFavorited(true);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen pb-20">
      {/* 顶部栏 */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b">
        <div className="h-12 px-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            aria-label="返回"
            type="button"
          >
            <span className="text-xl leading-none"><ArrowLeft /></span>
          </button>
          <div className="text-sm text-gray-500">商品详情</div>
          <div className="w-8 h-8" />
        </div>
      </header>

      {/* 大图 */}
      <section className="bg-white">
        {safe.cover ? (
          <img src={safe.cover} alt={safe.title} className="w-full aspect-square object-cover" />
        ) : (
          <div className="w-full aspect-square bg-gray-100" />
        )}
      </section>

      {/* 信息区 */}
      <InfoCard data={safe} />

      {/* 价格趋势：传入 180 天与 7 天序列，内部提供范围切换 */}
      <TrendCard last180d={safe.last180dPrices} last7d={safe.last7dPrices} />

      <BottomBar
        likes={safe?.stats?.likes ?? 0}
        comments={safe?.stats?.comments ?? 0}
        onFavorite={handleFavorite}
      />
    </div>
  );
};

export default ProductDetails;