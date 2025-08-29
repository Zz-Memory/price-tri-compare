import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useTitle from "@/hooks/useTitle";
import { useUserStore } from "@/store/login";
import { useFavoritesStore } from "@/store/favorites";
import InfoCard from "./components/InfoCard";
import TrendCard from "./components/TrendCard";
import BottomBar from "./components/BottomBar";
import { ArrowLeft } from "@react-vant/icons";

const EMPTY = Object.freeze([]);

/**
 * 商品详情（组件化）
 * - 仅使用首页卡片字段进行渲染
 */
const ProductDetails = () => {
  useTitle("商品详情");
  const navigate = useNavigate();
  const { state } = useLocation();
  const product = state?.item;

  // 当前用户 key（优先 id，其次 username；未登录 -> guest）
  const user = useUserStore((s) => s.user);
  const userKey = user?.id ?? user?.username ?? "guest";

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
  const isLogin = useUserStore((s) => s.isLogin);

  // 仅读写当前用户的收藏列表
  const byUser = useFavoritesStore((s) => s.byUser);
  const items = byUser?.[userKey] ?? EMPTY;
  const toggleFav = useFavoritesStore((s) => s.toggle);

  const favorited = useMemo(() => {
    if (!product?.id) return false;
    return items.some((it) => it.id === product.id);
  }, [items, product?.id]);

  const handleFavorite = () => {
    if (!product?.id) return;

    // 未登录则跳转登录，登录完成后返回当前商品详情页
    if (!isLogin) {
      const pid = product?.id;
      const from = pid != null ? `/product/${pid}` : "/product";
      navigate("/login", { replace: true, state: { from, backState: { item: product } } });
      return;
    }

    // 已登录：正常收藏/取消收藏
    const existed = items.some((it) => it.id === product.id);
    toggleFav(product, userKey);
    if (existed) {
      decFavorites(1);
    } else {
      incFavorites(1);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen pb-20">
      {/* 顶部栏 */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur">
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
        favorited={favorited}
        onFavorite={handleFavorite}
      />
    </div>
  );
};

export default ProductDetails;