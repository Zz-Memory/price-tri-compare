import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useTitle from "@/hooks/useTitle";
import { fetchSavingTips } from "@/services/savingTips";
import TipHeader from "./components/TipHeader";
import TipMeta from "./components/TipMeta";
import TipContent from "./components/TipContent";
import TipComments from "./components/TipComments";
import { LikeO, Like, StarO, Star } from "@react-vant/icons";

function getStateArticle(state) {
  // 兼容多种传参命名
  if (!state) return null;
  return state.data || state.item || state.article || state.tip || null;
}

const TipDetails = () => {
  useTitle("攻略详情");

  const { id } = useParams?.() || {};
  const location = useLocation();
  const navigate = useNavigate();

  const [tip, setTip] = useState(() => getStateArticle(location.state));
  const [loading, setLoading] = useState(!getStateArticle(location.state) && !!id);
  const [error, setError] = useState("");

  const [liked, setLiked] = useState(false);
  const [faved, setFaved] = useState(false);
  const [likeCount, setLikeCount] = useState(() => tip?.likes ?? 0);
  const [favCount, setFavCount] = useState(() => tip?.favorites ?? 0);

  useEffect(() => {
    if (!tip && id) {
      // 兜底：分页查找该 id（mock 5 页）
      let cancelled = false;
      const findById = async () => {
        setLoading(true);
        setError("");
        try {
          let page = 1;
          let found = null;
          let hasMore = true;
          while (!found && hasMore && page <= 5) {
            const { list, hasMore: more } = await fetchSavingTips({ page, pageSize: 10 });
            found = list.find((x) => String(x.id) === String(id));
            hasMore = more;
            page += 1;
          }
          if (!cancelled) {
            if (found) {
              setTip(found);
              setLikeCount(found.likes ?? 0);
              setFavCount(found.favorites ?? 0);
            } else {
              setError("未找到该攻略");
            }
          }
        } catch (e) {
          if (!cancelled) setError("加载失败，请稍后重试");
        } finally {
          if (!cancelled) setLoading(false);
        }
      };
      findById();
      return () => {
        cancelled = true;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const commentsCount = useMemo(() => (Array.isArray(tip?.comments) ? tip.comments.length : 0), [tip]);

  const onBack = () => navigate(-1);

  const onToggleLike = () => {
    setLiked((v) => !v);
    setLikeCount((n) => (liked ? Math.max(0, n - 1) : n + 1));
  };
  const onToggleFav = () => {
    setFaved((v) => !v);
    setFavCount((n) => (faved ? Math.max(0, n - 1) : n + 1));
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-100 pb-16">
      <TipHeader title={tip?.title} onBack={onBack} />

      {loading ? (
        <div className="px-3 py-6 text-center text-sm text-gray-500">加载中...</div>
      ) : error ? (
        <div className="px-3 py-6 text-center text-sm text-red-500">{error}</div>
      ) : tip ? (
        <>
          <div className="px-3 py-3">
            <div className="bg-white rounded-lg shadow-sm p-3">
              <h1 className="text-[18px] font-bold text-gray-900 leading-6">{tip.title}</h1>
              <TipMeta
                brand={tip.brand}
                product={tip.product}
                createdAt={tip.createdAt}
                commentsCount={commentsCount}
                likes={likeCount}
                favorites={favCount}
              />
            </div>
          </div>

          <div className="px-3">
            <TipContent cover={tip.cover} content={tip.content} />
          </div>

          <div className="px-3 mt-3">
            <TipComments comments={tip.comments} />
          </div>

          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 px-4 py-2 flex justify-around">
            <button
              onClick={onToggleLike}
              className="flex items-center gap-1 text-sm text-gray-700 px-3 py-2 rounded hover:bg-gray-100 active:bg-gray-200"
            >
              {liked ? <Like /> : <LikeO />} {likeCount}
            </button>
            <button
              onClick={onToggleFav}
              className="flex items-center gap-1 text-sm text-gray-700 px-3 py-2 rounded hover:bg-gray-100 active:bg-gray-200"
            >
              {faved ? <Star /> : <StarO />} {favCount}
            </button>
          </div>
        </>
      ) : (
        <div className="px-3 py-6 text-center text-sm text-gray-500">暂无数据</div>
      )}
    </div>
  );
};

export default TipDetails;