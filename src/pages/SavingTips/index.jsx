import { useEffect, useRef, useState } from "react";
import useTitle from "@/hooks/useTitle";
import { fetchSavingTips } from "@/services/savingTips";
import Waterfall from "./components/Waterfall";
import TipCard from "./components/TipCard";

const SavingTips = () => {
  useTitle("省钱攻略");

  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadingRef = useRef(false);
  const userScrolledRef = useRef(false);
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
    const onScroll = () => {
      userScrolledRef.current = true;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !loadingRef.current && userScrolledRef.current) {
          loadPage(page + 1);
        }
      },
      { root: null, rootMargin: "0px 0px 300px 0px", threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [page, hasMore]);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-100 pb-16">
      <div className="px-3 py-3 text-base font-medium">省钱攻略</div>

      <Waterfall
        items={list}
        columnCount={2}
        gap={12}
        itemGap={12}
        renderItem={(art) => <TipCard data={art} />}
      />

      <div className="px-3 mt-3">
        {loading && <div className="py-3 text-center text-xs text-gray-400">加载中...</div>}
        {!hasMore && <div className="py-3 text-center text-xs text-gray-400">没有更多了</div>}
        <div ref={bottomRef} style={{ height: 1 }} />
      </div>
    </div>
  );
};

export default SavingTips;