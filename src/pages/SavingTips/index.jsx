import { useEffect, useRef, useState } from "react";
import useTitle from "@/hooks/useTitle";
import { fetchSavingTips } from "@/services/savingTips";
import Waterfall from "./components/Waterfall";
import TipCard from "./components/TipCard";
import TipSkeleton from "./components/TipSkeleton";
import { THEME_COLOR } from "@/constants/theme";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/login";

const SavingTips = () => {
  useTitle("省钱攻略");
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = useUserStore((s) => s.isLogin);

  const [activeTab, setActiveTab] = useState("recommend"); // 'recommend' 或 'follow'
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadingRef = useRef(false);
  const bottomRef = useRef(null);

  const loadPage = async (nextPage = 1) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const { list: rows, hasMore: more } = await fetchSavingTips({
        page: nextPage,
        pageSize: 10,
      });
      setList((prev) => (nextPage === 1 ? rows : [...prev, ...rows]));
      setHasMore(more);
      setPage(nextPage);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    loadPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 根据 URL 查询参数同步激活的标签（用于登录后返回定位“关注”）
  useEffect(() => {
    const params = new URLSearchParams(location.search || "");
    const tab = params.get("tab") || "recommend";
    if (tab !== activeTab) {
      setActiveTab(tab);
      setList([]);
      setPage(1);
      setHasMore(true);
      loadPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !loadingRef.current) {
          loadPage(page + 1);
        }
      },
      { root: null, rootMargin: "0px 0px 300px 0px", threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [page, hasMore, list.length]);

  // 兜底：窗口滚动接近底部时加载（避免某些环境下 IO 不触发）
  useEffect(() => {
    const onScroll = () => {
      if (!hasMore || loadingRef.current || list.length === 0) return;
      const doc = document.scrollingElement || document.documentElement;
      const nearBottom = window.innerHeight + window.scrollY >= doc.scrollHeight - 200;
      if (nearBottom) loadPage(page + 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [page, hasMore, list.length]);

  // 首屏骨架占位（两列瀑布流，10 个）
  const showSkeleton = loading && list.length === 0;
  const skeletonSeeds = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-100 pb-16">
      
      {/* 分页标签 */}
      <div className="flex bg-white mb-2">
        <div 
          className={`flex-1 py-3 text-center ${activeTab === 'recommend' ? 'font-medium border-b-2' : 'text-gray-500'}`}
          style={activeTab === 'recommend' ? { color: THEME_COLOR, borderColor: THEME_COLOR } : undefined}
          onClick={() => {
            if (activeTab !== 'recommend') {
              setActiveTab('recommend');
              setList([]);
              setPage(1);
              setHasMore(true);
              loadPage(1);
              navigate(`${location.pathname}?tab=recommend`);
            }
          }}
        >
          推荐
        </div>
        <div 
          className={`flex-1 py-3 text-center ${activeTab === 'follow' ? 'font-medium border-b-2' : 'text-gray-500'}`}
          style={activeTab === 'follow' ? { color: THEME_COLOR, borderColor: THEME_COLOR } : undefined}
          onClick={() => {
            if (activeTab !== 'follow') {
              if (!isLogin) {
                navigate("/login", { replace: true, state: { from: `${location.pathname}?tab=follow` } });
                return;
              }
              setActiveTab('follow');
              setList([]);
              setPage(1);
              setHasMore(true);
              loadPage(1);
              navigate(`${location.pathname}?tab=follow`);
            }
          }}
        >
          关注
        </div>
      </div>

      {showSkeleton ? (
        <Waterfall
          items={skeletonSeeds}
          columnCount={2}
          gap={12}
          itemGap={12}
          renderItem={(seed) => <TipSkeleton seed={seed} />}
        />
      ) : (
        <>
          <Waterfall
            items={list}
            columnCount={2}
            gap={12}
            itemGap={12}
            renderItem={(art) => <TipCard data={art} />}
          />

          <div className="px-3 mt-3">
            {loading && (
              <div className="py-3 text-center text-xs text-gray-400">加载中...</div>
            )}
            {!hasMore && (
              <div className="py-3 text-center text-xs text-gray-400">没有更多了</div>
            )}
            <div ref={bottomRef} style={{ height: 1 }} />
          </div>
        </>
      )}
    </div>
  );
};

export default SavingTips;