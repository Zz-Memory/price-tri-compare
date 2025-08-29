import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useTitle from "@/hooks/useTitle";
import { fetchSavingTips } from "@/services/savingTips";
import TipHeader from "./components/TipHeader";
import TipMeta from "./components/TipMeta";
import TipContent from "./components/TipContent";
import TipComments from "./components/TipComments";
import TipAuthor from "./components/TipAuthor";
import { LikeO, Like, StarO, Star, ShareO, ChatO } from "@react-vant/icons";
import { THEME_COLOR } from "@/constants/theme";
import { useFavoritesStore } from "@/store/favorites";
import { useUserStore } from "@/store/login";

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

  // 收藏数持久化
  const user = useUserStore((s) => s.user);
  const userKey = user?.id ?? user?.username ?? "guest";
  const getFavCountPersist = useFavoritesStore((s) => s.getFavCount);
  const setFavCountPersist = useFavoritesStore((s) => s.setFavCount);
  const toggleFavItem = useFavoritesStore((s) => s.toggle);

  const initialFavCount = (() => {
    const stored = getFavCountPersist ? getFavCountPersist(userKey, id) : undefined;
    const fromTip = tip?.favorites ?? 0;
    return stored ?? fromTip;
  })();
  const [favCount, setFavCount] = useState(initialFavCount);
  const [likeCount, setLikeCount] = useState(() => tip?.likes ?? 0);

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
              // 初始化收藏数（若无持久化记录则使用接口值）
              const stored = getFavCountPersist ? getFavCountPersist(userKey, found.id) : undefined;
              const initFav = stored ?? (found.favorites ?? 0);
              setFavCount(initFav);
              if (stored == null && setFavCountPersist) setFavCountPersist(userKey, found.id, initFav);
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
  }, [id, tip, getFavCountPersist, setFavCountPersist]);

  // tip 就绪时，若没有持久化值则写入一份，且同步本地 state
  useEffect(() => {
    if (!tip?.id) return;
    const stored = getFavCountPersist ? getFavCountPersist(userKey, tip.id) : undefined;
    const base = tip.favorites ?? 0;
    if (stored == null) {
      setFavCount(base);
      if (setFavCountPersist) setFavCountPersist(userKey, tip.id, base);
    } else {
      setFavCount(stored);
    }
  }, [tip?.id, tip?.favorites, getFavCountPersist, setFavCountPersist]);

  const commentsCount = useMemo(() => (Array.isArray(tip?.comments) ? tip.comments.length : 0), [tip]);
  const shareCount = tip?.shares ?? 0;

  const commentsRef = useRef(null);

  const onBack = () => navigate(-1);

  const onToggleLike = () => {
    setLiked((v) => !v);
    setLikeCount((n) => (liked ? Math.max(0, n - 1) : n + 1));
  };

  // 收藏帖子：写入收藏列表，标记为 __type: 'post'，并附带 meta/stats 便于收藏页展示
  const onToggleFav = () => {
    if (!tip) return;
    setFaved((v) => !v);
    const next = faved ? Math.max(0, favCount - 1) : favCount + 1;
    setFavCount(next);
    if (setFavCountPersist) setFavCountPersist(userKey, tip.id ?? id, next);

    const favItem = {
      id: tip.id,
      __type: "post",
      title: tip.title,
      cover: tip.cover,
      priceText: "",
      meta: {
        source: tip.brand ? (tip.product ? `${tip.brand}·${tip.product}` : tip.brand) : "攻略",
        time: tip.createdAt || "",
      },
      stats: { comments: commentsCount, likes: likeCount },
      _raw: tip,
    };
    if (toggleFavItem) toggleFavItem(favItem, userKey);
  };

  const onClickCommentInput = () => {
    // 点击无反应
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
          {/* 合并卡片：作者 + 正文 + 信息 */}
          <div className="px-3 pt-3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-3">
                <TipAuthor name={tip.authorName} avatar={tip.authorAvatar} />
              </div>

              <TipContent cover={tip.cover} content={tip.content} embedded />

              <div className="px-3 pb-3">
                <TipMeta
                  brand={tip.brand}
                  product={tip.product}
                  createdAt={tip.createdAt}
                />

              </div>
            </div>
          </div>

          {/* 评论 */}
          <div ref={commentsRef} className="px-3 mt-3">
            <TipComments comments={tip.comments} />
          </div>

          {/* 底部操作栏：输入气泡 + 分享/评论/收藏/点赞（数量在下） */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100">
            <div
              className="max-w-md mx-auto px-3 pt-2 pb-2"
              style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)" }}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={onClickCommentInput}
                  className="flex-1 text-left bg-gray-100 text-gray-500 rounded-full px-4 py-2"
                >
                  点我发评论
                </button>

                <div className="flex items-end gap-5">
                  <button type="button" onClick={onClickShare} className="flex flex-col items-center text-gray-600">
                    <ShareO />
                    <span className="text-[10px] mt-1 text-gray-500">{shareCount}</span>
                  </button>
                  <button type="button" onClick={() => commentsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })} className="flex flex-col items-center text-gray-600">
                    <ChatO />
                    <span className="text-[10px] mt-1 text-gray-500">{commentsCount}</span>
                  </button>
                  <button type="button" onClick={onToggleFav} className="flex flex-col items-center text-gray-600">
                    <span style={faved ? { color: THEME_COLOR } : undefined}>{faved ? <Star /> : <StarO />}</span>
                    <span className="text-[10px] mt-1 text-gray-500">{favCount}</span>
                  </button>
                  <button type="button" onClick={onToggleLike} className="flex flex-col items-center text-gray-600">
                    <span style={liked ? { color: THEME_COLOR } : undefined}>{liked ? <Like /> : <LikeO />}</span>
                    <span className="text-[10px] mt-1 text-gray-500">{likeCount}</span>
                  </button>
                </div>
              </div>

              <div className="mt-2 mx-auto h-1 w-32 bg-gray-300 rounded-full" />
            </div>
          </div>
        </>
      ) : (
        <div className="px-3 py-6 text-center text-sm text-gray-500">暂无数据</div>
      )}
    </div>
  );
};

export default TipDetails;