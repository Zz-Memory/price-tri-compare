import { ThumbCircleO, CommentCircleO, StarO,Star,ShareO } from "@react-vant/icons";

const BottomBar = ({
  likes = 0,
  comments = 0,
  favorited = false,
  onRecommend = () => {},
  onFavorite = () => {},
  onComment = () => {},
  onShare = () => {},
  onDirectLink = () => {},
}) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t z-30">
      <div className="max-w-md mx-auto px-3 py-2 flex items-center">
        {/* 左侧操作区 */}
        <div className="flex gap-6 text-gray-700">
          <button
            type="button"
            onClick={onRecommend}
            className="flex flex-col items-center text-xs"
          >
            <span className="text-[20px]">
              <ThumbCircleO />
            </span>
            <span className="mt-0.5">{likes ?? 0}</span>
          </button>

          <button
            type="button"
            onClick={onFavorite}
            className="flex flex-col items-center text-xs"
          >
            <span className={`text-[20px] ${favorited ? "text-orange-500" : ""}`}>
              {favorited ? <Star /> : <StarO />}
            </span>
            <span className="mt-0.5">收藏</span>
          </button>

          <button
            type="button"
            onClick={onComment}
            className="flex flex-col items-center text-xs"
          >
            <span className="text-[20px]">
              <CommentCircleO />
            </span>
            <span className="mt-0.5">{comments ?? 0}</span>
          </button>

          <button
            type="button"
            onClick={onShare}
            className="flex flex-col items-center text-xs"
          >
            {/* 简易分享图标（避免外部依赖不一致） */}
            <span className="text-[20px] leading-none">
              <ShareO />
            </span>
            <span className="mt-0.5">分享</span>
          </button>
        </div>

        {/* 直达链接 CTA */}
        <button
          type="button"
          onClick={onDirectLink}
          className="ml-3 flex-1 bg-orange-500 active:bg-orange-600 text-white py-2 rounded text-base"
        >
          直达链接
        </button>
      </div>
    </footer>
  );
};

export default BottomBar;