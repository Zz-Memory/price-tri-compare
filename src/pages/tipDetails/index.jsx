import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useTitle from "@/hooks/useTitle";
import { fetchSavingTips } from "@/services/savingTips";
import TipHeader from "./components/TipHeader";
import TipComments from "./components/TipComments";
import TipCombinedCard from "./components/TipCombinedCard";
import TipActionsBar from "./components/TipActionsBar";

function getStateArticle(state) {
  if (!state) return null;
  return state.data || state.item || state.article || state.tip || null;
}

const TipDetails = () => {
  useTitle("攻略详情");

  const { id } = (typeof useParams === "function" ? useParams() : {}) || {};
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
  }, [id, tip]);

  const commentsCount = useMemo(() => (Array.isArray(tip?.comments) ? tip.comments.length : 0), [tip]);
  const shareCount = tip?.shares ?? 0;

  const commentsRef = useRef(null);

  const onBack = () => navigate(-1);
  const onToggleLike = () => {
    setLiked((v) => !v);
    setLikeCount((n) => (liked ? Math.max(0, n - 1) : n + 1));
  };
  const onToggleFav = () => {
    setFaved((v) => !v);
    setFavCount((n) => (faved ? Math.max(0, n - 1) : n + 1));
  };
  const onClickCommentInput = () => {
    if (commentsRef.current) commentsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const onClickShare = () => {};

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-100 pb-24">
      <TipHeader title={tip?.title} onBack={onBack} />

      {loading ? (
        <div className="px-3 py-6 text-center text-sm text-gray-500">加载中...</div>
      ) : error ? (
        <div className="px-3 py-6 text-center text-sm text-red-500">{error}</div>
      ) : tip ? (
        <>
          <div className="px-3 pt-3">
            <TipCombinedCard
              tip={tip}
              likeCount={likeCount}
              favCount={favCount}
              commentsCount={commentsCount}
            />
          </div>

          <div ref={commentsRef} className="px-3 mt-3">
            <TipComments comments={tip.comments} />
          </div>

          <TipActionsBar
            placeholder="点我发评论"
            shareCount={shareCount}
            commentsCount={commentsCount}
            favCount={favCount}
            likeCount={likeCount}
            faved={faved}
            liked={liked}
            onClickCommentInput={onClickCommentInput}
            onClickShare={onClickShare}
            onToggleFav={onToggleFav}
            onToggleLike={onToggleLike}
          />
        </>
      ) : (
        <div className="px-3 py-6 text-center text-sm text-gray-500">暂无数据</div>
      )}
    </div>
  );
};

export default TipDetails;